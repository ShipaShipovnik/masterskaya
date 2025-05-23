export default defineNuxtPlugin(async (nuxtApp) => {
    const profileStore = useProfileStore()

    // Инициализация при старте приложения
    await profileStore.init()

    // Автоматическая подписка на изменения аутентификации
    const { data: { subscription } } = useSupabaseClient().auth.onAuthStateChange(() => {
        profileStore.init()
    })

    // Реалтайм-обновления профиля
    let channel: any = null

    const initRealtime = () => {
        if (!profileStore.user?.id) return

        channel = useSupabaseClient().channel('profile-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'master_profiles',
                filter: `user_id=eq.${profileStore.user.id}`
            }, (payload) => {
                console.log('Realtime update:', payload)
                if (profileStore.activeRole === 'master') {
                    profileStore.activeProfile = payload.new
                }
            })
            .subscribe()
    }

    // Инициализируем при монтировании
    nuxtApp.hook('app:mounted', () => {
        initRealtime()
    })

    // Очистка при закрытии
    window.addEventListener('beforeunload', () => {
        subscription?.unsubscribe()
        channel?.unsubscribe()
    })
})