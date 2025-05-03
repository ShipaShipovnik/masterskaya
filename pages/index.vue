<template>
    <!-- Баннер -->
    <div class="banner">
        <div class="layout-container">
            <h1>MASTERSKAYA</h1>
            <p>Биржа творцов и фрилансеров.</p>
            <button class="banner__btn btn btn-red">Я ищу услуги</button>или
            <button class="banner__btn btn btn-red">Я предоставляю услуги</button>
        </div>
    </div>
    <!-- Контент -->
    <div class="content">
        <div class="layout-container">
            <h2 class="section-subhead">Самые свежие предложения:</h2>
            <div class="services-grid">
                <ServiceCard v-for="i in 4" :key="i" />
            </div>
        </div>
    </div>
    <div class="content">
        <div class="layout-container">
            <h2 class="section-subhead">Полезные статьи:</h2>
            <div class="articles-grid">
                <!-- 1 -->
                <div class="article">
                    <div class="article__top">
                        <NuxtLink to="/" class="article__readmore">
                            <h2 class="article__title">КАК НАЧАТЬ КАРЬЕРУ МАСТЕРА?</h2>
                        </NuxtLink>
                        <p class="article__description">Правила публикации на площадке. Работа с Услугами. Советы по
                            оформлению услуг и профиля.</p>
                    </div>

                    <div class="article__bottom">
                        <NuxtLink to="/" class="article__readmore">
                            <p> Читать статью </p>
                            <Icon name="material-symbols:arrow-right-alt" size="2em" />
                        </NuxtLink>
                        <SvgoQuestionCircle class="article__icon" />
                    </div>
                </div>
                <!-- 2 -->
                <div class="article">
                    <div class="article__top">
                        <NuxtLink to="/" class="article__readmore">
                            <h2 class="article__title">КАК ПРАВИЛЬНО ЗАКАЗАТЬ УСЛУГУ?</h2>
                        </NuxtLink>
                        <p class="article__description">Как найти подходящую услугу. Как работать с мастерами.</p>
                    </div>

                    <div class="article__bottom">
                        <NuxtLink to="/" class="article__readmore">
                            <p> Читать статью </p>
                            <Icon name="material-symbols:arrow-right-alt" size="2em" />
                        </NuxtLink>
                        <SvgoQuestionCircle class="article__icon" />
                    </div>
                </div>
                <!-- 3 -->
                <div class="article">
                    <div class="article__top">
                        <NuxtLink to="/faq" class="article__readmore">
                            <h2 class="article__title">Частые вопросы</h2>
                        </NuxtLink>
                        <p class="article__description">Ответы на частые вопросы</p>
                    </div>

                    <div class="article__bottom">
                        <NuxtLink to="/faq" class="article__readmore">
                            <p>Найти ответ</p>
                            <Icon name="material-symbols:arrow-right-alt" size="2em" />
                        </NuxtLink>
                        <SvgoQuestionCircle class="article__icon" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
// баннер
.banner {
    position: relative;
    padding: 200px 0;
    text-align: center;
    background-image: url(~/assets/images/banner.jpg);
    background-color: $black;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    color: $white;
}

.banner::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.banner .layout-container {
    position: relative;
    z-index: 1;
}

.content {
    .layout-container {
        // background-color: $white;
        padding: 40px 0;
    }
}

/* Сетка услуг */
.services-grid {
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 40px;
}

.articles-grid {
    // display: flex;
    // justify-content: space-between;
    display: grid;
    grid-template-columns: repeat(3, 4fr);
    gap: 15px;
}

.article {
    background-color: $idk;
    border-radius: 5px;
    padding: 28px;
    height: 360px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .article__top {
        .article__title {
            font-size: 30px;
        }
    }

    .article__bottom {
        display: flex;
        justify-content: space-between;
        align-items: end;

        .article__icon {
            font-size: 100px;
        }

        .nuxt-icon {
            margin: 0;
        }

        .article__readmore {
            text-decoration: underline;
            align-items: center;
            display: flex;
        }
    }




}
</style>