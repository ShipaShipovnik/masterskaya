<template>
    <template v-if="profile">
        <div class="profile-container">
            <div class="profile-sidebar">
                <div class="profile-sidebar__avatar">
                    <img :src="profile?.avatar_url || defaultAvatar" alt="Аватар">
                </div>
                <p class="profile-sidebar__name">{{ profile?.public_name || username }}</p>
                <p class="profile-sidebar__job text-muted">{{ profile?.job || 'Должность не указана' }}</p>

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

                <!-- Кнопки редактирования для владельца -->
                <div v-if="isOwner" class="owner-actions">
                    <button @click="navigateTo(`/users/profile/${username}`)" class="edit-btn">
                        Редактировать профиль
                    </button>
                </div>

            </div>
            <div class="profile-content" v-if="role === master">

                <div class="profile-content__tab active-tab" id="gallery" v-if="activeTab === 'gallery'">
                    <div class="profile-content__gallery-img"></div>
                    <div class="profile-content__gallery-img"></div>
                    <div class="profile-content__gallery-img"></div>

                </div>

                <div class="profile-content__tab" id="services" v-else-if="activeTab === 'services'">
                    <div v-if="isOwner" class="owner-actions">
                        <button @click="navigateTo('/services/add')" class="btn-red edit-btn ">
                            Добавить услугу
                        </button>
                    </div>
                    <div class="services-container">
                        <ServiceCard v-for="service in services" :key="service.id" :service="service" />
                        <div v-if="!loading && services.length === 0" class="empty-state">
                            У этого мастера пока нет услуг
                        </div>
                    </div>

                </div>

                <div class="profile-content__tab" id="about" v-else>
                    <section class="profile-content__about-me">
                        <h2>Обо мне:</h2>
                        <p>{{ profile?.description || 'Пользователь пока не добавил информацию о себе' }}</p>
                    </section>
                    <!-- <section class="profile-content__about-socials">
                    <h2>Контакты и соц-сети:</h2>

                </section> -->
                </div>
            </div>

        </div>
    </template>
    <template v-else>
        <div class="not-found">
            Профиль с именем "{{ username }}" не найден
        </div>
    </template>

</template>

<script setup>
definePageMeta({
    layout: 'profile',
})

import defaultAvatar from '@/assets/images/default-avatar.png'

const client = useSupabaseClient()
const user = useSupabaseUser() //авторизированый юзер
const { username } = useRoute().params //юзернейм на профиль кторого хочу перейти щас

const services = ref([])
const loading = ref({
    profile: true,
    services: true
})
const error = ref(null)
const activeTab = ref('gallery')
const profile = ref(null)
const isOwner = computed(() =>
    user.value?.id === profile.value?.user_id
)
const errorMessage = ref('')

// Загрузка данных профиля
const { data } = await useAsyncData(`profile-${username}`, async () => {
    try {
        const { data, error } = await client
            .from('master_profiles')
            .select('*')
            .eq('username', username)
            .single()

        if (error) throw error
        return data
    } catch (err) {
        error.value = err.message
        console.error('Ошибка загрузки профиля:', err)
        return null
    } finally {
        loading.value.profile = false
    }
})

profile.value = data.value
const fetchMasterServices = async () => {
    if (!profile.value?.id) return

    try {
        loading.value.services = true
        const { data, error } = await client
            .from('services')
            .select(`
                *,
                categories (
                    title
                )
            `)
            .eq('master_id', profile.value.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        services.value = data || []
    } catch (err) {
        error.value = err.message
        console.error('Ошибка загрузки услуг:', err)
    } finally {
        loading.value.services = false
    }
}
// Загружаем услуги при изменении профиля
watch(() => profile.value?.id, fetchMasterServices, { immediate: true })

// Realtime обновления
onMounted(() => {
    if (!username) return

    const channel = client
        .channel('profile-updates')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'master_profiles',
            filter: `username=eq.${username}`
        }, (payload) => {
            profile.value = payload.new
        })
        .subscribe()

    onUnmounted(() => client.removeChannel(channel))
})

const handleTabChange = (tab) => {
    activeTab.value = tab
}
</script>

<style lang="scss" scoped>
.profile-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    // border: 1px green solid;
    min-height: 1000px;
}

.profile-sidebar {
    background-color: $white;
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
            color: $white;
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
            color: $black;
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
    background-color: $white;
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

.owner-actions {
    margin: 15px 0;

    .edit-btn {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;

    }
}

.profile-content__gallery-img {
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.services-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    row-gap: 20px;
}
</style>