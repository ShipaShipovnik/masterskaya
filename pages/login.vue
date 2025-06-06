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
                <input type="password" class="auth-form__input default-input" v-model="password">
            </div>

            <button class="auth-form__btn btn">
                Войти
            </button>

            <!-- Сообщения об ошибках/успехе -->
            <div class="auth-messages">
                <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
                <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
            </div>

            <p class="auth-form__subtext text-muted">
                Нет аккаунта?
                <NuxtLink to="/register" no-prefetch class="auth-form__link ">
                    Зарегистрироваться.
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

// сообщения
const errorMsg = ref("")
const successMsg = ref("")


async function signIn() {
    try {
        errorMsg.value = "";
        const { data, error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (error) throw error;

        console.log('Успешный вход!', data);
        successMsg.value = "Успешный вход!";
        await navigateTo('/', { replace: true })
    } catch (error) {
        errorMsg.value = error.message
        console.error("ОШИБКА ТАКАЯ" + errorMsg)
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