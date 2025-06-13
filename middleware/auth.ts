// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
    const profileStore = useProfileStore()
    const supabase = useSupabaseClient()

    // Проверка авторизации
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
        return navigateTo('/login')
    }

    // Если на странице выбора роли, но роль уже есть
    if (to.path === '/choose-role' && user.user_metadata?.current_role) {
        return navigateTo('/')
    }

    // Если не на странице выбора роли и нет роли
    if (to.path !== '/choose-role' && !user.user_metadata?.current_role) {
        const role = await profileStore.determineUserRole(user.id)

        if (role) {
            // Автоматически назначаем роль если профиль один
            await profileStore.assignRole(role)
        } else {
            // Перенаправляем на выбор если профилей нет или их несколько
            return navigateTo('/choose-role')
        }
    }
})