<template>
    <!-- Баннер -->
    <div class="banner">
        <div class="layout-container">
            <h1>MASTERSKAYA</h1>
            <p>Биржа творцов и мастеров</p>
            <button>Я ищу услуги</button>
            <button>Я предоставляю услуги</button>
        </div>
    </div>
    <!-- Контент -->
    <section class="content">
        <div class="layout-container">
            <h2>Самые свежие предложения</h2>
            <div class="services-grid">
                <ServiceCard v-for="i in 5" :key="i" />
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
/* Баннер */
.banner {
    background-color: #da6161;
    padding: 80px 0;
    text-align: center;
}

.content {
    .layout-container {
        padding-bottom: 40px;
        background-color: white;
    }
}

/* Сетка услуг */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 40px;
}
</style>