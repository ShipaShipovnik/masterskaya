<template>
    <template v-if="profile">
        <div class="profile-container">
            <div class="profile-sidebar">
                <div class="profile-sidebar__avatar">
                    <img :src="profile?.avatar_url || defaultAvatar" alt="Аватар">
                </div>
                <p class="profile-sidebar__name">{{ profile?.public_name || username }}</p>
                <!-- <p class="profile-sidebar__job text-muted">{{ profile?.job || 'Должность не указана' }}</p> -->

                <p class="text-muted">Связаться через: </p>
                <div class="profile-sidebar__socials">
                    <NuxtLink to="/" class="profile-sidebar__social-btn">
                        <SvgoOkIcon class="footer__icon" />
                    </NuxtLink>
                    <NuxtLink to="/" class="profile-sidebar__social-btn">
                        <SvgoVkIcon class="footer__icon" />
                    </NuxtLink>
                    <NuxtLink to="/" class="profile-sidebar__social-btn">
                        <SvgoTgIcon class="footer__icon" />
                    </NuxtLink>
                </div>

                <!-- Кнопки редактирования для владельца -->
                <!-- <div v-if="isOwner" class="owner-actions">
                    <button @click="navigateTo(`/users/profile/${username}`)" class="profile-edit-btn btn">
                        Редактировать профиль
                    </button>
                </div> -->

            </div>
            <div class="profile-content">
                <section class="profile-content__about-me">
                    <h2 class="text-muted">Обо мне:</h2>
                    <p>{{ profile?.description || 'Пользователь пока не добавил информацию о себе.' }}</p>
                </section>
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

const loading = ref({
    profile: true,
})
const error = ref(null)
const profile = ref(null)
const isOwner = computed(() =>
    user.value?.id === profile.value?.user_id
)
const errorMessage = ref('')

// Загрузка данных профиля
const { data } = await useAsyncData(`profile-${username}`, async () => {
    try {
        const { data, error } = await client
            .from('customer_profiles')
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

// Realtime обновления
onMounted(() => {
    if (!username) return

    const channel = client
        .channel('profile-updates')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'customer_profiles',
            filter: `username=eq.${username}`
        }, (payload) => {
            profile.value = payload.new
        })
        .subscribe()

    onUnmounted(() => client.removeChannel(channel))
})

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

    .profile-sidebar__socials {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;

        .profile-sidebar__social-btn {
            background-color: rgb(177, 177, 177);
            font-size: 50px;
            color: white;
            padding: 10px;
            border-radius: 5px;
            aspect-ratio: 1 / 1;
            transition: all 0.3s ease, box-shadow 0.3s ease;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
                background-color: $red;

            }
        }
    }
}

.profile-edit-btn {
    width: 100%;
    background-color: $yellow;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
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