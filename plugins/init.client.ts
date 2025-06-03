export default defineNuxtPlugin(async (nuxtApp) => {
    const profileStore = useProfileStore()
    const supabase = useSupabaseClient()

    // 1. Инициализация при старте
    await profileStore.init()

    // 2. Реалтайм-подписка на профиль
    let channel: ReturnType<typeof supabase.channel> | null = null

    const initRealtime = () => {
        // Отписываемся от старой подписки
        channel?.unsubscribe()

        // Если пользователь не авторизован или нет активной роли - выходим
        if (!profileStore.user?.id || !profileStore.activeRole) return

        // Подписываемся на изменения нужной таблицы
        channel = supabase.channel('profile-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: `${profileStore.activeRole}_profiles`,
                filter: `user_id=eq.${profileStore.user.id}`
            }, (payload) => {
                console.log('Realtime profile update:', payload)
                profileStore.activeProfile = payload.new
            })
            .subscribe()
    }

    // 3. Обработчик изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        console.log('Auth state changed:', event)
        await profileStore.init()
        initRealtime()
    })

    // 4. Инициализация при монтировании
    nuxtApp.hook('app:mounted', initRealtime)

    // 5. Очистка
    nuxtApp.hook('app:beforeMount', () => {
        subscription?.unsubscribe()
        channel?.unsubscribe()
    })

    // Для дебага
    console.log('Profile plugin initialized')
})