// plugins/profile.init.ts
export default defineNuxtPlugin(async () => {
    const profileStore = useProfileStore()

    const supabase = useSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user)
        await profileStore.loadProfile()
})