<template>
    <div class="profile-container">
        <div class="profile-sidebar">
            <div class="profile-sidebar__avatar">
                <img src="" alt="logo">
            </div>
            <p class="profile-sidebar__name">Имя Пользователя</p>
            <p class="profile-sidebar__job text-muted">Иллюстраторка</p>
            <div class="profile-sidebar__tabs">
                <button class="profile-sidebar__tab-btn btn" :class="{ 'active-tab-btn': activeTab === 'gallery' }"
                    @click="handleTabChange('gallery')">Галлерея</button>
                <button class="profile-sidebar__tab-btn btn" :class="{ 'active-tab-btn': activeTab === 'services' }"
                    @click="handleTabChange('services')">Услуги</button>
                <button class="profile-sidebar__tab-btn btn" :class="{ 'active-tab-btn': activeTab === 'about' }"
                    @click="handleTabChange('about')">Обо мне</button>
            </div>
            <p class="text-muted">Написать с помощью: </p>
            <div class="profile-sidebar__socials">
                <button class="profile-sidebar__social-btn">тг</button>
                <button class="profile-sidebar__social-btn">ок</button>
                <button class="profile-sidebar__social-btn">вк</button>
            </div>
        </div>
        <div class="profile-content">

            <div class="profile-content__tab active-tab" id="gallery" v-if="activeTab === 'gallery'">
                <div class="profile-content__gallery-img"></div>
                <div class="profile-content__gallery-img"></div>
                <div class="profile-content__gallery-img"></div>

            </div>

            <div class="profile-content__tab" id="services" v-else-if="activeTab === 'services'">
                <ServiceCard />
            </div>

            <div class="profile-content__tab" id="about" v-else>
                <section class="profile-content__about-me">
                    <h2>Обо мне:</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta similique officiis quae impedit
                        consectetur quisquam incidunt eligendi quas, nisi cumque doloremque voluptatibus tempore,
                        distinctio vero aspernatur deleniti, quasi consequuntur labore!</p>
                </section>
                <!-- <section class="profile-content__about-socials">
                    <h2>Контакты и соц-сети:</h2>

                </section> -->
            </div>
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'profile'
})

const activeTab = ref('gallery')

const handleTabChange = (tab) => {
    activeTab.value = tab
    console.log('Вкладка' + tab)
}
</script>

<style lang="scss" scoped>
.profile-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    border: 1px green solid;
    min-height: 1000px;
}

.profile-sidebar {
    background-color: white;
    padding: 20px;
    grid-column: 1 / 4;

    display: flex;
    flex-direction: column;

    .profile-sidebar__avatar {
        width: 100%;
        aspect-ratio: 1 / 1;
        background-color: grey;
        margin-bottom: 15px;
    }

    .profile-sidebar__tabs {
        margin: 15px 0;

        .profile-sidebar__tab-btn {
            width: 100%;
            color: white;
            background-color: grey;
            text-transform: uppercase;
            padding: 10px 0;
            margin-bottom: 12px;
            border-radius: 5px;
            transition: all ease-in-out 0.5s;
        }

        .active-tab-btn {
            width: 100%;
            background-color: rgb(255, 255, 255);
            color: black;
            border: 1px solid grey;
            padding: 15px 0;
        }
    }


    .profile-sidebar__name {
        font-size: 20px;
        font-weight: bold;
    }

    .profile-sidebar__job {
        font-size: 16px;
        font-weight: 700px;
    }
}

.profile-content {
    background-color: white;
    padding: 20px;
    grid-column: 4 / 13;
}

#gallery {
    width: 100%;
    display: flex;
    gap: 15px;

    .profile-content__gallery-img {
        background-color: grey;
        border: 1px solid grey;
        width: 100%;
        aspect-ratio: 1 / 1;
    }

}
</style>