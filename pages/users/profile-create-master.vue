<template>
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
            <input type="text" class="default-input" v-model="form.public_name">
        </div>
        <div class="profile-create__input-group">
            <label>Юзернейм:</label>
            <p class="profile-create__input-subtext">Данное имя будет служить в качестве ссылки на ваш профиль.
            </p>
            <input type="text" class="default-input" v-model="form.username" required>
        </div>
        <div class="profile-create__input-group">
            <label>Спелизация:</label>
            <p class="profile-create__input-subtext">Опишите в чем вы специализируетесь.
            </p>
            <input type="text" class="default-input" v-model="form.job" required>
        </div>
        <div class="profile-create__input-group">
            <label>Описание профиля:</label>
            <p class="profile-create__input-subtext">Кратко опишите себя и чем вы занимаетесь.</p>
            <textarea v-model="form.description" class="default-textarea"></textarea>
        </div>

        <!-- контакты -->
        <div class="input-group">
            <label>Контакты профиля:</label>
            <p class="profile-create__input-subtext">Будут отображаться в вкладке "Обо мне" в вашем профиле.</p>

            <div class="input-group">
                <label>Telegram:</label>
                <input type="text" class="default-input" v-model="form.contacts.telegram">
            </div>
            <div class="input-group">
                <label>ВКонтакте:</label>
                <input type="text" class="default-input" v-model="form.contacts.vkontakte">
            </div>
            <div class="input-group">
                <label>Одноклассники:</label>
                <input type="text" class="default-input" v-model="form.contacts.odnoklassniki">
            </div>
        </div>

        <button class="btn btn-red">Создать профиль Мастера</button>
    </form>
</template>
<!-- TODO: реактивная проверка на никнейм в реальном времени времени -->
<script setup>
definePageMeta({
    layout: 'default',
    middleware: 'auth',
})
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const errorMsg = ref("")
const isLoading = ref(false)

// Форма профиля
const form = ref({
    public_name: '',
    username: '',
    description: '',
    job: '',
    contacts: {
        telegram: '',
        vkontakte: '',
        odnoklassniki: ''
    }
})


const validateUsername = async () => {
    if (!form.value.username) return

    const { data, error } = await client
        .from('master_profiles')
        .select('username')
        .eq('username', form.value.username)

    if (error) {
        errorMsg.value = 'Ошибка проверки username'
        return false
    }

    if (data.length > 0) {
        errorMsg.value = 'Этот username уже занят'
        return false
    }

    errorMsg.value = ''
    return true
}

// Создание профиля
const createProfile = async () => {
    try {
        isLoading.value = true
        errorMsg.value = ''

        // Проверяем username
        const isUsernameValid = await validateUsername()
        if (!isUsernameValid) return

        // Создаем/обновляем профиль
        const { error: profileError } = await client
            .from('master_profiles')
            .upsert({
                user_id: user.value.id,
                ...form.value
            })

        if (profileError) throw profileError

        // 2. ВАЖНО: Принудительно обновляем хранилище
        const profileStore = useProfileStore()
        profileStore.activeRole = 'master' // Вручную устанавливаем роль
        profileStore.activeProfile = { ...form.value, user_id: user.value.id }

        // 3. Перенаправляем
        await navigateTo(`/users/master/${form.value.username}`)

    } catch (error) {
        errorMsg.value = error.message || 'Произошла ошибка при создании профиля мастера'
        console.error('Ошибка:', error)
    } finally {
        isLoading.value = false
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