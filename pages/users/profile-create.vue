<template>
    <div class="layout-container">

        <p>Теперь давайте создадим вам профиль для взаимодействия с сайтом.</p>
        <p>На данной версии проекта доступно только создание профиля Мастера.</p>


        <form @submit.prevent="createProfile" class="profile-create__form">
            <div class="profile-create__input-group">
                <label>Аватар:</label>
                <p class="profile-create__input-subtext">Не больше мб.</p>
                <input type="file" class="default-input" id="">
            </div>
            <!-- публичное имя -->
            <div class="profile-create__input-group">
                <label>Публичное имя:</label>
                <p class="profile-create__input-subtext">Данное имя будет отображаться в вашем профиле.</p>
                <input type="text" class="default-input" v-model="publicName">
            </div>
            <div class="profile-create__input-group">
                <label>Юзернейм:</label>
                <p class="profile-create__input-subtext">Данное имя будет служить в качестве ссылки на ваш профиль.
                </p>
                <input type="text" class="default-input" v-model="username" required>
            </div>
            <div class="profile-create__input-group">
                <label>Описание профиля:</label>
                <p class="profile-create__input-subtext">Кратко опишите себя и чем вы занимаетесь.</p>
                <textarea v-model="about" class="default-textarea"></textarea>
            </div>

            <!-- контакты -->
            <div class="input-group">
                <label>Контакты профиля:</label>
                <p class="profile-create__input-subtext">Будут отображаться в вкладке "Обо мне" в вашем профиле.</p>

                <div class="input-group">
                    <label>Telegram:</label>
                    <input type="text" class="default-input" v-model="contacts.telegram">
                </div>
                <div class="input-group">
                    <label>ВКонтакте:</label>
                    <input type="text" class="default-input" v-model="contacts.vkontakte">
                </div>
                <div class="input-group">
                    <label>Одноклассники:</label>
                    <input type="text" class="default-input" v-model="contacts.odnoklassniki">
                </div>
            </div>

            <button class="btn btn-red">Создать профиль Мастера</button>
        </form>

    </div>
</template>
<!-- TODO: реактивная проверка на никнейм в реальном времени времени -->
<script setup>
definePageMeta({
    layout: 'default',
    middleware: 'auth',
})
const client = useSupabaseClient()

const errorMsg = ref("")


// Получаем текущего пользователя
const { data: authData } = await client.auth.getUser()
const currentUser = authData.user
// console.log('Current user ID:', (await client.auth.getUser()).data.user?.id);

const avatarFile = ref("")
const publicName = ref("")
const username = ref("")
const about = ref("")
const contacts = ref({
    telegram: '',
    odnoklassniki: '',
    vkontakte: '',
})

async function createProfile() {
    try {

        const { error } = await client
            .from('master_profiles')
            .upsert({
                user_id: currentUser.id, 
                public_name: publicName.value,
                username: username.value,
                description: about.value,
                contacts: { 
                    telegram: contacts.value.telegram,
                    vkontakte: contacts.value.vkontakte,
                    odnoklassniki: contacts.value.odnoklassniki
                }
            })
        if (error) throw error
        console.log('Профиль успешно создан/обновлен!')

        // Перенаправляем на профиль после создания
        await navigateTo(`/profile/${username.value}`)
    } catch (error) {
        errorMsg.value = error.message
        console.error('Ошибка:', error.message)
    }
}
</script>

<style lang="scss" scoped>
.profile-create__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    background-color: white;
    padding: 15px;
}

.profile-create__input-subtext {
    color: rgb(0, 0, 0, 50%);
    font-size: 12px;
}
</style>