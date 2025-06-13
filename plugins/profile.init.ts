export default defineNuxtPlugin(async () => {
    const profileStore = useProfileStore();
    const supabase = useSupabaseClient();

    // Обработчик входа
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
            try {
                // 1. Если роль уже назначена — грузим профиль
                if (session.user.user_metadata?.current_role) {
                    await profileStore.loadProfile();
                    return;
                }

                // 2. Автоматически определяем роль
                const role = await profileStore.determineUserRole(session.user.id);
                if (role) {
                    await profileStore.assignRole(role); // Вызовет loadProfile() внутри себя
                } else {
                    console.warn("[profileinit] Не удалось определить роль — перенаправляем на выбор");
                    await navigateTo("/choose-role");
                }
            } catch (error) {
                console.error("[profileinit] Ошибка инициализации:", error);
            }
        }
    });

    // Инициализация при загрузке приложения
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await profileStore.loadProfile(); // Роль уже должна быть назначена!
});