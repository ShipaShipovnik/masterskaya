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
        // Геттер теперь учитывает временную роль
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
        setTempRole(role: 'master' | 'customer') {
            this.temp_role = role
        },
        setProfile(profile: Profile) {
            this.current_profile = profile
            this.temp_role = null // Очищаем временную роль
        },

        async setCurrentProfile(profile: Profile) {
            try {
                const supabase = useSupabaseClient()

                // 1. Обновляем метаданные в Supabase Auth
                const { data: { user }, error } = await supabase.auth.updateUser({
                    data: {
                        current_role: profile.role,
                        current_profile_id: profile.id
                    }
                })
                if (error) throw error

                // 2. Принудительно обновляем сессию
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    await supabase.auth.setSession(session)
                }

                // 3. Сохраняем профиль в хранилище
                this.setProfile(profile)

                console.log('[setProfile] Профиль в хранилище и JWT успешно обновлены')
                return user
            } catch (error) {
                console.error('[setProfile] Ошибка обновления профиля:', error)
            }
        },

        async loadProfile() {
            const supabase = useSupabaseClient()

            try {
                this.isLoading = true
                this.error = null

                // Принудительно получаем свежую сессию
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error) throw error
                if (!user) {
                    this.current_profile = null
                    return
                }

                // Проверяем метаданные
                const { current_role, current_profile_id } = user.user_metadata || {}
                if (!current_role || !current_profile_id) {
                    console.error('[loadProfile] Метаданные не найдены в JWT')
                    this.current_profile = null
                    return
                }

                // Загружаем профиль из нужной таблицы
                const { data: profile, error: profileError } = await supabase
                    .from(`${current_role}_profiles`)
                    .select('*')
                    .eq('id', current_profile_id)
                    .single()

                if (profileError) throw profileError
                if (!profile) throw new Error('[loadProfile] Профиль не найден')


                this.current_profile = {
                    ...profile,
                    role: current_role
                }

                console.log('User:', user)
                console.log('App metadata:', user.app_metadata)
                console.log('Profile data:', profile)

            } catch (err) {
                console.error('[loadProfile] Ошибка загрузки профиля:', err)
            } finally {
                this.isLoading = false
            }
        }
    }
}
)