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
const isLoading = ref(false);
const errorMsg = ref("");

// данные формы
const email = ref("");
const password = ref("")
const passIsVisible = ref(false)

// сообщения
const successMsg = ref("")

async function signIn() {
    errorMsg.value = '';
    try {
        isLoading.value = true;
        const { error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });
        if (error) throw error;

        await navigateTo('/choose-role');

    } catch (error) {
        errorMsg.value = error.message;
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