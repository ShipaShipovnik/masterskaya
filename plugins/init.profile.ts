export default defineNuxtPlugin(async () => {
    if (process.client) {
        const supabase = useSupabaseClient();
        const profileStore = useProfileStore();

        const initialize = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                // Для страниц создания профиля - только восстановление temp_role
                if (window.location.pathname.includes('/profile-create-')) {
                    if (user?.user_metadata?.temp_role) {
                        profileStore.setTempRole(user.user_metadata.temp_role);
                    }
                    return;
                }

                // Стандартная инициализация
                if (user?.user_metadata?.current_role) {
                    await profileStore.loadProfile();
                }
            } catch (error) {
                console.error('[init] Ошибка:', error);
            }
        };

        await initialize();

        supabase.auth.onAuthStateChange(async (event) => {
            if (event === 'SIGNED_IN') await initialize();
            if (event === 'SIGNED_OUT') profileStore.setProfile(null);
        });
    }
});