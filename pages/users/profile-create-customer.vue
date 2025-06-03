<template>
    <form @submit.prevent="createCustomerProfile" class="profile-create__form">
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

        <button :disabled="isLoading" class="btn btn-red">
            {{ isLoading ? 'Создание...' : 'Создать профиль заказчика' }}
        </button>
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
})

const validateUsername = async () => {
    if (!form.value.username) return

    const { data, error } = await client
        .from('customer_profiles')
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
const createCustomerProfile = async () => {
    try {
        isLoading.value = true

        // 1. Создаем профиль заказчика
        const { error: profileError } = await client
            .from('customer_profiles')
            .upsert({
                user_id: user.value.id,
                ...form.value
            })

        if (profileError) throw profileError

        // 2. ВАЖНО: Принудительно обновляем хранилище
        const profileStore = useProfileStore()
        profileStore.activeRole = 'customer' // Вручную устанавливаем роль
        profileStore.activeProfile = { ...form.value, user_id: user.value.id }

        // 3. Перенаправляем
        await navigateTo(`/users/customer/${form.value.username}`)

    } catch (error) {
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