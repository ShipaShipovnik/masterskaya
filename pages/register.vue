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
                <label for="password">Пароль:</label>
                <div class="password-input-group">
                    <input :type="passIsVisible ? 'text' : 'password'"
                        class="auth-form__input default-input password-input" v-model="password1" required>
                    <button type="button" @click="passIsVisible = !passIsVisible"
                        class="pass-visibility-btn cursor-pointer" aria-label="password toggle">
                        <Icon name="bx:show" style="color: black" class="" v-if="!passIsVisible" />
                        <Icon name="bx:hide" style="color: black" class="" v-else />
                    </button>
                </div>
            </div>
            <div class="auth-form__input-group">
                <label for="password">Пароль:</label>
                <div class="password-input-group">
                    <input :type="passIsVisible ? 'text' : 'password'"
                        class="auth-form__input default-input password-input" v-model="password2" required>
                    <button type="button" @click="passIsVisible = !passIsVisible"
                        class="pass-visibility-btn cursor-pointer" aria-label="password toggle">
                        <Icon name="bx:show" style="color: black" class="" v-if="!passIsVisible" />
                        <Icon name="bx:hide" style="color: black" class="" v-else />
                    </button>
                </div>
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
// definePageMeta({
//     // layout: 'profile',
//     middleware: 'guest',
// })
const client = useSupabaseClient();
const profileStore = useProfileStore()

// данные формы
const email = ref("");
const password1 = ref("")
const password2 = ref("")
const passIsVisible = ref(false)


// сообщения
const errorMsg = ref("")
const successMsg = ref("")

async function signUp() {
    if (password2.value !== password1.value) {
        errorMsg.value = "Пароли не совпадают!";
        return;
    }

    try {
        errorMsg.value = "";

        const { data, error } = await client.auth.signUp({
            email: email.value,
            password: password1.value
        });
        if (error) throw error;

        if (data.user) {
            // сохранение в сессию 
            sessionStorage.setItem('temp_user', data.user);

            successMsg.value = "Успешная регистрация!";
            console.log(successMsg.value + data.user);

            console.log('User status:', await client.auth.getUser())
            console.log('Session:', await client.auth.getSession())

            await navigateTo('/choose-role')
        }

    } catch (error) {
        errorMsg.value = error.message
        console.error("ОШИБКА РЕГИСТРАЦИИ" + error)
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