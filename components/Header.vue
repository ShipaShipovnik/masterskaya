<template>
    <header class="header">
        <div class="header-container">
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
                <span v-if="isAuth && user">
                    <!-- <NuxtLink to="/users/profile" class="header-auth__profile">
                        <img src="~/assets/images/default-avatar.png" alt="avatar" class="header__avatar">
                    </NuxtLink> -->
                    <button @click="isMenuOpen = !isMenuOpen" class="menu-toggle" aria-label="Toggle menu">
                        <h1>МЕНЮ</h1>
                        <Icon name="meteor-icons:list" size="2em" />
                    </button>
                </span>
                <span v-else>
                    <NuxtLink to="/register" no-prefetch>
                        <button class="header__auth-btn btn">
                            Вход\Регистрация
                        </button>
                    </NuxtLink>
                </span>
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div class="dropdown-menu" :class="{ 'dropdown-open': isMenuOpen }" v-if="isMenuOpen" @click.stop>
            <div class="dropdown-content">
                <NuxtLink to="/" class="dropdown-item" @click="closeMenu">
                    Создать профиль Заказчика
                </NuxtLink>
                <hr class="dropdown-divider">
                <NuxtLink to="/users/profile-create" class="dropdown-item" @click="closeMenu">
                    Создать профиль Мастера
                </NuxtLink>
                <hr class="dropdown-divider">
                <NuxtLink to="/faq" class="dropdown-item" @click="closeMenu">
                    Поддержка
                </NuxtLink>
                <hr class="dropdown-divider">
                <button @click="logout" class="dropdown-item dropdown-logout">
                    Выйти
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const isAuth = computed(() => !!user.value)
const successMsg = ref('');

// меню
let isMenuOpen = ref(false)

const closeMenu = () => {
    isMenuOpen.value = false
}

// Закрытие при клике вне меню
const handleClickOutside = (event) => {
    if (!event.target.closest('.header__auth') && isMenuOpen.value) {
        closeMenu()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})


onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

// логаут
async function logout() {
    try {
        let { error } = await supabase.auth.signOut()

        if (error) throw error;

        successMsg.value = "Вы вышли";
        console.log(successMsg);

        await navigateTo('/', { replace: true })
        closeMenu()
    } catch (error) {
        console.log(error)
    }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.header {
    background-color: $black;
    height: 60px;
    position: relative;

    .header-container {
        align-items: center;
        display: grid;
        height: 100%;
        grid-template-columns: repeat(12, 1fr);
        column-gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .header__logo {
        color: $red;
        font-family: "Prompt", sans-serif;
        font-size: 30px;
        font-weight: bold;
        grid-column: 1 / 4;
    }

    .header__nav {
        grid-column: 4 / 10;
        width: 100%;
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
        grid-column: 10 / 13;

        display: flex;
        color: $white;
        justify-content: end;

        .menu-toggle {
            display: flex;
            align-items: center;
        }

        // .header-auth__profile {
        //     display: flex;
        //     align-items: center;

        //     .header__avatar {
        //         max-width: 30px;
        //         border-radius: 5px;
        //         margin-right: 10px;
        //     }
        // }

        .header__auth-btn {
            border: $red 1px solid;
            padding: 10px;
            transition: all ease-in-out 0.5s;
        }

        .header__auth-btn:hover {
            background-color: $red;
        }

        span {
            display: flex;
            align-items: center;
        }
    }

}

// .auth__burger-menu {
//     position: absolute;
//     right: 300px;
//     display: none;
//     width: 300px;
//     height: auto;
//     background: white;
//     outline: 1px grey solid;
//     padding: 10px;
//     text-align: right;

//     .burger-menu__nav {
//         display: flex;
//         flex-direction: column;
//         gap: 5px;
//     }
// }

// .open {
//     display: block;
// }


/* Dropdown Menu Styles */
.dropdown-menu {
    position: absolute;
    top: 100%;
    right: calc((100% - 1200px) / 2 + 30px); // Выравнивание по grid
    width: 250px;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    pointer-events: none;

    &.dropdown-open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
    }

    .dropdown-content {
        display: flex;
        flex-direction: column;
        padding: 8px 0;
    }

    .dropdown-item {
        padding: 12px 16px;
        color: $black;
        text-decoration: none;
        transition: background 0.2s;

        &:hover {
            background: #f5f5f5;
        }
    }

    .dropdown-divider {
        margin: 0;
        border: none;
        border-top: 1px solid #eee;
    }

    .dropdown-logout {
        color: $red;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
    }

    .burger-icon {
        cursor: pointer;
        margin-left: 10px;
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.1);
        }
    }
}
</style>