<template>
    <div class="layout-container">
        <form class="auth-form" @submit.prevent="signIn">
            <h2 class="auth-form__title">Войти</h2>

            <div class="auth-form__input-group">
                <label for="email">Почта:</label>
                <input type="email" class="auth-form__input default-input" v-model="email">
            </div>
            <div class="auth-form__input-group">
                <label for="password">Пароль:</label>
                <div class="password-input-group">
                    <input :type="passIsVisible ? 'text' : 'password'"
                        class="auth-form__input default-input password-input" v-model="password" required>
                    <button type="button" @click="passIsVisible = !passIsVisible"
                        class="pass-visibility-btn cursor-pointer" aria-label="password toggle">
                        <Icon name="bx:show" style="color: black" class="" v-if="!passIsVisible" />
                        <Icon name="bx:hide" style="color: black" class="" v-else />
                    </button>
                </div>
            </div>

            <button class="auth-form__btn btn" :disabled="isLoading">
                {{ isLoading ? 'Загрузка...' : 'Войти' }}
            </button>

            <!-- Сообщения об ошибках/успехе -->
            <div class="auth-messages">
                <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
                <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
            </div>

            <p class="auth-form__subtext text-muted">
                <NuxtLink to="/register" no-prefetch class="auth-form__link ">
                    Нет аккаунта? Зарегистрироваться.
                </NuxtLink>
            </p>
        </form>
    </div>
</template>

<script setup>

const client = useSupabaseClient();

// данные формы
const email = ref("");
const password = ref("")

const passIsVisible = ref(false)

// сообщения
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function signIn() {
    try {
        isLoading.value = true;
        errorMsg.value = "";
        successMsg.value = "";

        // 1. Выполняем вход
        const { error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });
        if (error) throw error;

        // 2. Ждем инициализации профиля
        const profileStore = useProfileStore();
        let attempts = 0;
        const maxAttempts = 10; // ~5 секунд максимум

        while (!profileStore.current_profile && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }

        // 3. Перенаправляем
        if (profileStore.current_profile) {
            await navigateTo('/');
        } else {
            console.warn('[signIn] Профиль не загрузился автоматически');
            await navigateTo('/profile-check', { replace: true });
        }

        successMsg.value = "Успешный вход!";
    } catch (error) {
        errorMsg.value = error.message;
        console.error("[signIn] Ошибка:", error);
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