// ~/stores/profile.store.ts
import { defineStore } from "pinia";

export const useProfileStore = defineStore('profile', () => {
    const client = useSupabaseClient()

    // Состояния
    const user = ref<any>(null)
    const activeProfile = ref<any>(null)
    const activeRole = ref<'master' | 'customer' | 'guest'>('guest')
    const isLoading = ref(false)

    const checkProfileExists = async (type: 'master' | 'customer') => {
        try {
            const { data, error } = await client
                .from(`${type}_profiles`)
                .select('id, username')
                .eq('user_id', user.value?.id || '')
                .maybeSingle() // Используем maybeSingle вместо single

            return {
                exists: !!data?.id,
                username: data?.username || null
            }
        } catch (error) {
            console.error(`Ошибка проверки профиля ${type}:`, error)
            return { exists: false, username: null }
        }
    }

    // Инициализация
    const init = async () => {
        isLoading.value = true
        try {
            // Проверка авторизации
            const { data: { user: authUser }, error } = await client.auth.getUser()
            if (error) throw error

            user.value = authUser

            if (!user.value) {
                resetToGuest()
                return
            }

            const preferredRole = localStorage.getItem('preferredRole') as 'master' | 'customer' | null;

            if (preferredRole) {
                const { data } = await client
                    .from(`${preferredRole}_profiles`)
                    .select('*')
                    .eq('user_id', user.value?.id || '')
                    .single();

                if (data) {
                    activeRole.value = preferredRole;
                    activeProfile.value = data;
                    localStorage.removeItem('preferredRole'); // Очищаем после использования
                    return;
                }
            }

            // Проверка профилей (параллельно)
            const [master, customer] = await Promise.all([
                checkProfileExists('master'),
                checkProfileExists('customer')
            ])

            // Определение активного профиля
            if (customer.exists) {
                await loadProfile('customer')
            } else if (master.exists) {
                await loadProfile('master')
            } else {
                resetToGuest()
            }

        } catch (error) {
            console.error('Ошибка инициализации:', error)
            resetToGuest()
        } finally {
            isLoading.value = false
        }
    }
    // 3. Вспомогательные методы (новые)
    const resetToGuest = () => {
        activeRole.value = 'guest'
        activeProfile.value = null
    }

    const loadProfile = async (type: 'master' | 'customer') => {
        try {
            const { data, error } = await client
                .from(`${type}_profiles`)
                .select('*')
                .eq('user_id', user.value.id)
                .single()

            if (error) throw error

            activeProfile.value = data
            activeRole.value = type
            console.log(`Профиль ${type} загружен:`, data.username)

        } catch (error) {
            console.error(`Ошибка загрузки профиля ${type}:`, error)
            throw error
        }
    }


    // геттеры

    const profileName = computed(() => activeProfile.value?.public_name || 'Гость')
    const username = computed(() => activeProfile.value?.username || '')
    const publicName = computed(() => activeProfile.value?.public_name || '')
    const avatarUrl = computed(() => activeProfile.value?.avatar_url || '/default-avatar.png')

    return {
        user,
        activeProfile,
        activeRole,
        isLoading,
        profileName,
        username,
        publicName,
        avatarUrl,
        init,
        loadProfile,
        forceSetRole: (role, data) => {
            activeRole.value = role
            activeProfile.value = data
        }
    }
})