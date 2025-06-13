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
        temp_role: null as 'master' | 'customer' | null,
        isLoading: false,
        error: null as string | null
    }),
    getters: {

        current_role: (state) => state.current_profile?.role || state.temp_role,
        hasProfile: (state) => state.current_profile !== null,
        username: (state) => state.current_profile?.username || 'Гость',
        avatarUrl: (state) => state.current_profile?.avatar_url || '/default-avatar.jpg',

        masterProfile: (state): MasterProfile | null => {
            return state.current_profile?.role === 'master'
                ? (state.current_profile as MasterProfile)
                : null
        },

        customerProfile: (state): CustomerProfile | null => {
            return state.current_profile?.role === 'customer'
                ? (state.current_profile as CustomerProfile)
                : null
        }

    },
    actions: {
        // ПРИ РЕГИСТРАЦИИ ПРОФИЛЯ
        setTempRole(role: 'master' | 'customer') {
            this.temp_role = role
        },

        setProfile(profile: Profile | null) {
            this.current_profile = profile
            this.temp_role = null
        },

        // обнволение роли вручную
        async assignRole(role: "master" | "customer") {
            try {
                const supabase = useSupabaseClient();
                await supabase.auth.updateUser({
                    data: { current_role: role },
                });

                await this.refreshSession(); // <- Заменили дублирование кода
                await this.loadProfile();

            } catch (error) {
                console.error("[assignRole] Ошибка:", error);
                throw error;
            }
        },

        // Ничего не сохраняет, только анализирует БД.
        async determineUserRole(userId: string): Promise<'master' | 'customer' | null> {
            const supabase = useSupabaseClient()

            try {
                // 1. Параллельно проверяем оба типа профилей
                const [
                    { data: masterProfile },
                    { data: customerProfile }
                ] = await Promise.all([
                    supabase
                        .from('master_profile')
                        .select('id')
                        .eq('user_id', userId)
                        .maybeSingle(),
                    supabase
                        .from('customer_profiles')
                        .select('id')
                        .eq('user_id', userId)
                        .maybeSingle()
                ])

                // 2. Определяем приоритетную роль, если есть оба профиля
                if (masterProfile && customerProfile) {
                    return 'master' // или можно добавить логику выбора
                }

                // 3. Возвращаем роль, если найден ровно один профиль
                if (masterProfile) return 'master'
                if (customerProfile) return 'customer'

                // 4. Если профилей нет
                console.warn('[determineUserRole] Не найдено ни одного профиля для пользователя', userId)
                return null

            } catch (error) {
                console.error('[determineUserRole] Ошибка проверки профилей:', error)
                return null
            }
        },

        async refreshSession() {
            const supabase = useSupabaseClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                await supabase.auth.setSession(session)
            }
        },

        // загрузка профиля и его данных в состояние стора, чтобы можно было через геттеры брать инфу о профиле на сайт
        async loadProfile() {
            try {
                this.isLoading = true
                const supabase = useSupabaseClient()

                const { data: { user }, error } = await supabase.auth.getUser();
                if (error || !user) {
                    this.setProfile(null); // <- Используем существующий метод
                    return;
                }

                console.log("[loadprofile] Текущий user_metadata:",user.user_metadata)

                // Проверяем роль в user_metadata
                const role = user.user_metadata?.current_role
                const profileId = user.user_metadata?.current_profile_id || user.id
                if (!role) {
                    console.warn('[loadProfile] Роль не назначена в userdata')
                    this.current_profile = null
                    return
                }

                // Загружаем профиль
                const { data: profile, error: profileError } = await supabase
                    .from(`${role}_profiles`) // или ваше название таблицы
                    .select('*')
                    .eq('user_id', user.id)
                    .single()
                if (profileError) throw profileError

                this.setProfile({ ...profile, role });

            } catch (err) {
                console.error('[loadProfile] Ошибка:', err);
                this.error = err.message;
                this.setProfile(null);
            } finally {
                this.isLoading = false
            }
        }
    }
}
)