export default defineNuxtRouteMiddleware(async (to) => {
    // Только дублирующая проверка для дополнительной надежности
    const supabase = useSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !['/login', '/register'].includes(to.path)) {
        return navigateTo('/login')
    }
})