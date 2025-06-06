// plugins/profile.init.ts
export default defineNuxtPlugin(async () => {
    const profileStore = useProfileStore()
    await profileStore.loadProfile()
})