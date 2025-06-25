<template>
    <div class="layout-container">
        <form class="auth-form" @submit.prevent="logout">
            <h2 class="auth-form__title">Вы хотите выйти из аккаунта? :(</h2>

            <button type="submit" class="auth-form__btn btn" :disabled="isLoading">
                {{ isLoading ? 'Загрузка...' : 'Да' }}
            </button>
            <p class="auth-form__subtext text-muted">
                <NuxtLink to="/" no-prefetch class="auth-form__link ">
                    Нет не хочу.
                </NuxtLink>
            </p>

            <!-- Сообщения об ошибках/успехе -->
            <div class="auth-messages">
                <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
                <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
            </div>


        </form>
    </div>
</template>

<script setup>
const client = useSupabaseClient();
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function logout() {
    try {
        isLoading.value = true;
        const profileStore = useProfileStore();

        // 1. Принудительный сброс роли на сервере
        await client.auth.updateUser({
            data: { current_role: null }
        });

        // 2. Выход из системы
        const { error } = await client.auth.signOut();
        if (error) throw error;

        // 3. Полный сброс хранилища
        profileStore.$reset();

        // 4. Очистка локального хранилища
        localStorage.removeItem('profileStore');
        sessionStorage.clear();

        // 5. Перенаправление с сообщением
        successMsg.value = "Вы успешно вышли из системы";
        await navigateTo('/', { replace: true, redirectCode: 301 });

    } catch (error) {
        errorMsg.value = error.message || 'Ошибка при выходе из системы';
        console.error('Ошибка выхода:', error);
    } finally {
        isLoading.value = false;
    }
}
</script>

<style lang="scss" scoped>
.layout-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    padding-top: 80px;
}

.auth-messages {
    color: black;
}
</style>