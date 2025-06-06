export default defineNuxtRouteMiddleware(async (to) => {
    const client = useSupabaseClient()
    const user = useSupabaseUser()

    // Пропускаем маршруты регистрации/входа
    if (['/register', '/login'].includes(to.path)) {
        return
    }

    // Если пользователь не авторизован
    if (!user.value) {
        return navigateTo('/login')
    }
})