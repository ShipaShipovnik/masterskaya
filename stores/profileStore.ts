// stores/profile.ts
import { defineStore } from 'pinia'

// интерфейсы тайпскрипта =============================================
export type ProfileRole = 'master' | 'customer'

interface BaseProfile {
    id: string
    user_id: string
    role: ProfileRole
    username: string
    public_name?: string
    avatar_url?: string
    created_at: string
}

export interface MasterProfile extends BaseProfile {
    role: 'master'
    description: string
    job: string
    contacts: {
        telegram?: string
        phone?: string
    }
}

export interface CustomerProfile extends BaseProfile {
    role: 'customer'
}

type Profile = MasterProfile | CustomerProfile


export const useProfileStore = defineStore('profileStore', {
    state: () => ({
        current_profile: null as Profile | null,
        // temp_role: null as 'master' | 'customer' | null,
        isLoading: false,
        error: null as string | null
    }),

    getters: {
        current_role: (state) => state.current_profile?.role,
        hasProfile: (state) => state.current_profile !== null,
        username: (state) => state.current_profile?.username || 'Гость',
        avatarUrl: (state) => state.current_profile?.avatar_url || '/default-avatar.jpg',
        masterProfile: (state): MasterProfile | null =>
            state.current_profile?.role === 'master' ? (state.current_profile as MasterProfile) : null,
        customerProfile: (state): CustomerProfile | null =>
            state.current_profile?.role === 'customer' ? (state.current_profile as CustomerProfile) : null
    },

    actions: {
        // ----------------------------
        // БАЗОВЫЕ МЕТОДЫ (Использовать везде)
        // ----------------------------
        setProfile(profile: Profile | null) {
            this.current_profile = profile
        },

        // setTempRole(role: 'master' | 'customer') {
        //     console.log(`[setTempRole] Установлена временная роль: ${role}`)
        //     this.temp_role = role
        // },

        // clearTempRole() {
        //     this.temp_role = null
        // },

        // ----------------------------
        // ОСНОВНЫЕ МЕТОДЫ (вызывать в компонентах)
        // ----------------------------

        /**
         * Основной метод для выбора роли (использовать на странице /choose-role)
         * 1. Проверяет наличие профиля
         * 2. Если есть - загружает профиль
         * 3. Если нет - сохраняет temp_role для создания профиля
         */
        async selectRole(role: 'master' | 'customer') {
            try {
                console.log(`[selectRole] Начало выбора роли: ${role}`)
                this.isLoading = true

                // 1. Сначала назначаем роль
                await this.assignRole(role)

                // 2. Проверяем наличие профиля
                const profileExists = await this.checkProfile(role)
                console.log(`[selectRole] Профиль ${role} существует:`, profileExists)

                if (profileExists) {
                    // 3. Если профиль есть - загружаем его
                    await this.loadProfile()
                    return true
                }

                return false

            } catch (error) {
                console.error(`[selectRole] Ошибка выбора роли ${role}:`, error)
                this.error = error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Проверка + загрузка профиля если есть (использовать при входе в приложение)
         */
        async initProfile() {
            try {
                console.log('[initProfile] Инициализация профиля')
                const supabase = useSupabaseClient()
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    console.warn('[initProfile] Пользователь не авторизован. Обнуляю профиль')
                    this.setProfile(null)
                    return false
                }

                // Если роль уже выбрана - загружаем профиль
                if (user.user_metadata?.current_role) {
                    console.log('[initProfile] Роль уже назначена, загружаем профиль')
                    await this.loadProfile()
                    return !!this.current_profile; // true если профиль загружен

                }

                return false
            } catch (error) {
                console.error('[initProfile] Ошибка инициализации:', error)
                this.error = error.message
                return false
            }
        },

        // ----------------------------
        // СЛУЖЕБНЫЕ МЕТОДЫ не для вызова в компонентах, используются в других методах для проверок итд
        // ----------------------------

        async checkProfile(role: 'master' | 'customer'): Promise<boolean> {
            console.log(`[checkProfile] Проверка на наличие профиля ${role} у текущего пользователя`)
            const supabase = useSupabaseClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user?.id) {
                console.warn('[checkProfile] Пользователь не авторизован')
                return false
            }

            try {
                const { data } = await supabase
                    .from(`${role}_profiles`)
                    .select('id')
                    .eq('user_id', user.id)
                    .maybeSingle()

                return !!data
            } catch (error) {
                console.error(`[checkProfile] Ошибка проверки профиля ${role}:`, error)
                return false
            }
        },

        // назначение роли принудительно
        async assignRole(role: "master" | "customer") {
            console.log(`[assignRole] Назначение роли: ${role}`)
            const supabase = useSupabaseClient()
            await supabase.auth.updateUser({
                data: { current_role: role }
            })
            await this.refreshSession()
        },

        // загрузхка данных профиля в стор
        async loadProfile() {
            try {
                console.log('[loadProfile] Запуск загрузки');
                this.isLoading = true;

                const supabase = useSupabaseClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    console.warn('[loadProfile] Пользователь не авторизован');
                    this.setProfile(null);
                    return;
                }

                // Получаем роль ТОЛЬКО из user_metadata
                const role = user.user_metadata?.current_role;
                if (!role) {
                    console.warn('[loadProfile] Роль не назначена в user_metadata');
                    this.setProfile(null);
                    return;
                }

                const { data: profile, error } = await supabase
                    .from(`${role}_profiles`)
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;

                console.log('[loadProfile] Успешно загружен профиль:', profile);
                this.setProfile({ ...profile, role });

            } catch (err) {
                console.error('[loadProfile] Ошибка:', err);
                this.setProfile(null);
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async refreshSession() {
            console.log('[refreshSession] Обновление сессии')
            const supabase = useSupabaseClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (session) await supabase.auth.setSession(session)
        },
    }
})