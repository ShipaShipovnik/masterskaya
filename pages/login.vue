<template>
    <div class="layout-container">
        <div class="auth-form">
            <h2 class="auth-form__title">Войти</h2>

            <div class="auth-form__input-group">
                <label for="">Почта:</label>
                <input type="email" class="auth-form__input default-input">
            </div>
            <div class="auth-form__input-group">
                <label for="">Пароль:</label>
                <input type="password" class="auth-form__input default-input">
            </div>
            <button class="auth-form__btn btn">
                Войти
            </button>

            <NuxtLink to="/register" class="auth-form__subtext text-muted">
                Уже есть аккаунт? Войти.
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.layout-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    padding-top: 200px;
}

.auth-form {
    grid-column: 4 / 9;
    background-color: white;
    height: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .auth-form__title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    .auth-form__input-group {
        display: block;

        .auth-form__input {
            width: 100%;
        }
    }

    label {
        color: rgb(0, 0, 0, 50%);
    }

    .auth-form__btn {
        background-color: black;
        padding: 15px;
        color: white;
        text-transform: uppercase;
    }


    .auth-form__subtext {
        text-align: center;
    }

    .auth-form__subtext:hover {
        text-decoration: underline;
    }

}
</style>