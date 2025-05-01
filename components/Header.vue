<template>
    <header class="header">
        <div class="layout-container">
            <div class="header__logo">
                <h1>MASTERSKAYA</h1>
            </div>
            <nav class="header__nav">
                <NuxtLink to="/">
                    <li class="header__nav-link">Главная</li>
                </NuxtLink>
                <NuxtLink to="/search">
                    <li class="header__nav-link">Поиск</li>
                </NuxtLink>
                <NuxtLink to="/faq">
                    <li class="header__nav-link">FAQ</li>
                </NuxtLink>
            </nav>
            <div class="header__auth">
                <img src="" alt="avatar" class="">
                <p>МОЙ ПРОФИЛЬ</p>

                <button class="header__auth-btn">
                    Вход\Регистрация
                </button>
            </div>
        </div>
    </header>
</template>

<script>

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

$red: #DC3B46;
$salat: #84C318;

.header {
    background-color: black;
    height: 60px;

    .layout-container {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        align-items: center;
    }

    .header__logo {
        color: $red;
        font-family: "Prompt", sans-serif;
    }

    .header__nav {
        display: flex;
        justify-content: space-around;
        color: white;
    }

    .header__auth {
        display: flex;
        color: white;
    }
}
</style>