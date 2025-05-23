<template>
    <!-- Баннер -->
    <div class="banner">
        <div class="layout-container">
            <h1>MASTERSKAYA</h1>
            <p>Биржа творцов и фрилансеров для ваших проектов</p>
            <div class="banner-actions">
                <button class="banner__btn btn btn-red">Я ищу услуги</button>
                <span class="btn-separator">или</span>
                <button class="banner__btn btn btn-red">Я предоставляю услуги</button>
            </div>
        </div>
    </div>
    <!-- Контент -->
    <div class="content">
        <div class="layout-container">
            <h2 class="section-subhead">Самые свежие предложения:</h2>
            <div class="services-grid">
                <ServiceCard v-for="service in latestServices" :key="service.id" :service="service" />
                <div v-if="latestServices.length === 0" class="empty-state">
                    У этого мастера пока нет услуг
                </div>
            </div>
        </div>
    </div>
    <div class="content">
        <div class="layout-container">
            <h2 class="section-subhead">Полезные статьи:</h2>
            <div class="articles-grid">
                <!-- 1 -->
                <div class="article article--gradient1">
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
                <div class="article article--gradient2">
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
                <div class="article article--gradient3">
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

<script setup>
const error = ref(null)
const client = useSupabaseClient()


const fetchLatestServices = async () => {
    try {
        const { data: latestServices, error } = await client
            .from('services')
            .select(`
                    id,
                    title,
                    min_price,
                    categories (title)  
                    `)
            .order('created_at', { ascending: false })
            .limit(4);
        if (error) throw error
        return latestServices || []
    } catch (err) {
        error.value = err.message
        console.error('Ошибка загрузки услуг:', err)
        return []
    }
}

const latestServices = await fetchLatestServices()

onUnmounted(fetchLatestServices)
</script>

<style scoped lang="scss">
// баннер
.banner {
    position: relative;
    padding: 180px 0 220px;
    text-align: center;
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(~/assets/images/banner.jpg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    color: $white;
    overflow: hidden;

    // градиент
    // &::after {
    //     content: "";
    //     position: absolute;
    //     bottom: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100px;
    //     background: linear-gradient(to top, #f0f0f0, transparent);
    //     z-index: 2;
    // }

    .layout-container {
        position: relative;
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        font-family: "Raleway", sans-serif;
        font-weight: 800;
        font-size: 72px;
        letter-spacing: 2px;
        margin-bottom: 20px;
        text-transform: uppercase;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        animation: fadeInDown 1s ease;

        @media (max-width: 768px) {
            font-size: 48px;
        }
    }

    p {
        font-size: 24px;
        max-width: 600px;
        margin: 0 auto 40px;
        line-height: 1.4;
        opacity: 0.9;
        animation: fadeIn 1.2s ease 0.3s forwards;
        opacity: 0;

        @media (max-width: 768px) {
            font-size: 18px;
            padding: 0 20px;
        }
    }

    &__btn {
        font-weight: 600;
        letter-spacing: 0.5px;
        padding: 12px 30px !important;
        margin: 0 10px;
        font-size: 16px;
        transform: translateY(20px);
        opacity: 0;
        animation: fadeInUp 0.8s ease 0.6s forwards;

        &:first-of-type {
            animation-delay: 0.5s;
        }

        &:last-of-type {
            animation-delay: 0.7s;
        }

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
    }

    .btn-separator {
        display: inline-block;
        margin: 0 15px;
        color: rgba(255, 255, 255, 0.7);
        animation: fadeIn 1s ease 0.9s forwards;
        opacity: 0;
    }
}

// Анимации
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
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
        padding: 30px 0;
    }
}

/* Сетка услуг */
.services-grid {
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    display: flex;
    justify-content: space-between;
    gap: 20px;
    // margin-top: 40px;
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 4fr);
    gap: 15px;
}

.article {
    border-radius: 5px;
    padding: 28px;
    height: 360px;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;

    // text-shadow: 1px 1px 3px rgb(0, 0, 0,50%);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        opacity: 0.9;
    }

    .article__top {
        .article__title {
            font-size: 30px;
            text-transform: uppercase;
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

.article--gradient1::before {
    background-image: linear-gradient(to right, #f83600 0%, #d8b921 100%);
}

.article--gradient2::before {
    background-image: linear-gradient(to right, #0ba360 0%, #3cba92 100%);
}

.article--gradient3::before {
    background: linear-gradient(180deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%);
}

.article {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
}
</style>