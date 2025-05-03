<template>
    <header class="header">
        <div class="layout-container">
            <div class="header__logo">
                <NuxtLink to="/">
                    <h1>MASTERSKAYA</h1>
                </NuxtLink>
            </div>
            <nav class="header__nav">
                <NuxtLink to="/">
                    <li class="header__nav-link">Главная</li>
                </NuxtLink>
                <NuxtLink to="/search">
                    <li class="header__nav-link ">Поиск</li>
                </NuxtLink>
                <NuxtLink to="/faq">
                    <li class="header__nav-link ">FAQ</li>
                </NuxtLink>
            </nav>

            <div class="header__auth">
                <span v-if="isAuth === false">
                    <NuxtLink to="/users/profile" class="header-auth__profile">
                        <img src="~/assets/images/default-avatar.png" alt="avatar" class="header__avatar">
                        <p>МОЙ ПРОФИЛЬ</p>
                    </NuxtLink>
                </span>
                <span v-else>
                    <NuxtLink to="/register">
                        <button class="header__auth-btn btn">
                            Вход\Регистрация
                        </button>
                    </NuxtLink>
                </span>
            </div>
        </div>
    </header>
</template>

<script setup>
const isAuth = ref(false)
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

$red: $red;
$yellow: #ffe89c;

.header {
    background-color: $black;
    height: 80px;

    .layout-container {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        align-items: center;
    }

    .header__logo {
        color: $red;
        font-family: "Prompt", sans-serif;
        font-size: 30px;
        font-weight: bold;
    }

    .header__nav {
        display: flex;
        justify-content: space-around;
        color: $white;

        .header__nav-link {
            transition: all ease-in-out 1s;
        }

        .header__nav-link:hover {
            text-decoration: underline;
        }
    }

    .header__auth {
        display: flex;
        color: $white;
        justify-content: end;

        .header-auth__profile {
            display: flex;
            align-items: center;

            .header__avatar {
                max-width: 40px;
                border-radius: 5px;
                margin-right: 10px;
            }
        }

        .header__auth-btn {
            border: $red 1px solid;
            padding: 10px;
            transition: all ease-in-out 0.5s;
        }

        .header__auth-btn:hover {
            background-color: $red;
        }
    }


}
</style>