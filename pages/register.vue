<template>
    <div class="layout-container">
        <form class="auth-form" @submit.prevent="signUp()">
            <h2 class="auth-form__title">Зарегестрироваться</h2>

            <div class="auth-form__input-group">
                <label for="email-input">Почта:</label>
                <input type="email-input" id="email" v-model="email" required class="auth-form__input default-input"
                    placeholder="youremail@example.com">
            </div>
            <div class="auth-form__input-group">
                <label for="password-input">Пароль:</label>
                <input type="password" id="password-input" v-model="password1" required
                    class="auth-form__input default-input">
            </div>
            <div class="auth-form__input-group">
                <label for="">Повторите пароль:</label>
                <input type="password" class="auth-form__input default-input" v-model="password2" required>
            </div>
            <button class="auth-form__btn btn">
                Зарегестрироваться
            </button>

            <div class="auth-messages">
                <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
                <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
            </div>

            <p class="auth-form__subtext text-muted">
                Уже есть аккаунт? <NuxtLink to="/login" no-prefetch class="auth-form__link ">Войти</NuxtLink>
            </p>
        </form>

    </div>
</template>

<script setup>
definePageMeta({
    // layout: 'profile',
    middleware: 'guest',
})
const client = useSupabaseClient();

// данные формы
const email = ref("");
const password1 = ref("")
const password2 = ref("")


// сообщения
const errorMsg = ref("")
const successMsg = ref("")

async function signUp() {
    if (password2.value === password1.value) {
        try {
            errorMsg.value = "";

            const { data, error } = await client.auth.signUp({
                email: email.value,
                password: password1.value
            });

            if (error) throw error;

            console.log('Успешная регистрация!', data);
            successMsg.value = "Успешная регистрация!";
            await navigateTo('/profile-choose', { replace: true })
        } catch (error) {
            errorMsg.value = error.message
            console.error("ОШИБКА " + error.message)
        }
    } else {
        errorMsg.value = "Пароли не совпадают!"

    }
}
</script>

<style lang="scss" scoped>
.layout-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    padding-top: 80px;
}
</style>