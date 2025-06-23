export default defineNuxtPlugin(async () => {
    if (process.client) {
        const supabase = useSupabaseClient();
        const profileStore = useProfileStore();
        const router = useRouter(); // Добавляем router для более надежной проверки пути

        // Функция для проверки, находимся ли мы на странице создания профиля
        const isProfileCreatePage = () => {
            return window.location.pathname.includes('/profile-create-');
        };

        const initialize = async () => {
            // console.log('Initialize called from:', new Error().stack);
            try {
                // Полностью пропускаем инициализацию на странице создания профиля
                if (isProfileCreatePage()) {
                    return;
                }

                const { data: { user } } = await supabase.auth.getUser();

                if (user?.user_metadata?.current_role) {
                    await profileStore.loadProfile();
                }
            } catch (error) {
                console.error('[init] Ошибка:', error);
            }
        };

        // Инициализируем только если не на странице создания профиля
        if (!isProfileCreatePage()) {
            await initialize();
        }

        supabase.auth.onAuthStateChange(async (event) => {
            // Пропускаем обработку событий аутентификации на странице создания профиля
            if (isProfileCreatePage()) {
                return;
            }

            if (event === 'SIGNED_IN') {
                await initialize();
            }
            if (event === 'SIGNED_OUT') {
                profileStore.setProfile(null);
            }
        });
    }
});