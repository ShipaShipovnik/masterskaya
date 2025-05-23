// ~/stores/profile.store.ts
import { defineStore } from "pinia";

export const useProfileStore = defineStore('profile', () => {
    const client = useSupabaseClient()

    // Состояния
    const user = ref<any>(null)
    const activeProfile = ref<any>(null)
    const activeRole = ref<string | null>(null)

    // 1. Загрузка пользователя
    const loadUser = async () => {
        const { data } = await client.auth.getUser()
        user.value = data.user
    }

    // 2. Загрузка профиля
    const loadProfile = async (type: 'master' | 'customer') => {
        const { data } = await client
            .from(`${type}_profiles`)
            .select('*')
            .eq('user_id', user.value.id)
            .single()

        activeProfile.value = data
        activeRole.value = type
        localStorage.setItem('activeProfile', type)
    }

    // 3. Инициализация
    const init = async () => {
        await loadUser()

        if (!user.value) return

        // Пробуем загрузить сохранённую роль
        const savedRole = localStorage.getItem('activeProfile')
        if (savedRole) {
            await loadProfile(savedRole as 'master' | 'customer')
        } else {
            // Если нет профиля - перенаправляем на выбор
            const { data } = await client
                .from('master_profiles')
                .select('id')
                .eq('user_id', user.value.id)

            if (!data?.length) {
                navigateTo('/create-profile')
            } else {
                await loadProfile('master')
            }
        }
    }

    const profileName = computed(() => {
        return activeProfile.value?.public_name || 'Гость'
    })

    type ProfileFields = keyof MasterProfile | keyof CustomerProfile
    const getProfileField = (field: string) => {
        return computed(() => {
            if (!activeProfile.value) {
                console.warn('Профиль не загружен')
                return null
            }

            if (!(field in activeProfile.value)) {
                console.error(`Поле ${field} не существует в профиле`)
                return null
            }

            return activeProfile.value[field]
        })
    }

    // Геттеры
    const username = computed(() => activeProfile.value?.username || '')
    const publicName = computed(() => activeProfile.value?.public_name || '')
    const avatarUrl = computed(() => activeProfile.value?.avatar_url || '/default-avatar.png')

    return {
        user,
        profileName,
        activeProfile,
        username,
        publicName,
        avatarUrl,
        activeRole,
        loadProfile,
        init,
        getProfileField,
    }
})