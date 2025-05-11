export default defineNuxtRouteMiddleware(async (to) => {
    const client = useSupabaseClient()
    const { data: { user }, error } = await client.auth.getUser()

    if (!user) {
        return navigateTo('login?redirect=' + to.path)
    }
})