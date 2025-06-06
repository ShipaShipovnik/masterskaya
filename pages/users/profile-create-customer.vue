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
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const profileStore = useProfileStore()
const router = useRouter()

const errorMsg = ref("")
const isLoading = ref(false)

// Форма профиля
const form = ref({
    public_name: '',
    username: '',
})

// Создание профиля
const createProfile = async () => {
    try {
        const supabase = useSupabaseClient()
        const user = useSupabaseUser()

        // Проверяем роль в JWT
        const currentRole = user.value?.user_metadata?.current_role
        if (currentRole !== 'customer') {
            throw new Error('в jwt user_metadata роль не кастомер')
        }

        //Создаем профиль
        const { data: profile, error } = await supabase
            .from('customer_profiles')
            .insert({
                user_id: user.value.id,
                ...form.value
            })
            .select()
            .single()

        if (error) throw error

        //Обновляем JWT с ID профиля
        await supabase.auth.updateUser({
            data: { current_profile_id: profile.id }
        })

        await navigateTo(`/users/customer/${profile.username}`)

    } catch (err) {
        console.error('Ошибка создания профиля:', err.message)
        // Перенаправляем на выбор роли при ошибке
        if (err.message.includes('выберите роль')) {
            await navigateTo('/profile-choose')
        }
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