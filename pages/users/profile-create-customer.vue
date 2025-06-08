<template>
    <form @submit.prevent="createProfile" class="profile-create__form">
        <div class="profile-create__input-group">
            <label>Аватар:</label>
            <avatarUploader @file-selected="handleFileSelected" />
            <p class="profile-create__input-subtext">Не больше 5 мб.</p>

            <div v-if="uploadError" class="error-message">
                {{ uploadError }}
            </div>
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
            <label>Описание профиля:</label>
            <p class="profile-create__input-subtext">Кратко опишите себя и чем вы занимаетесь.</p>
            <textarea v-model="form.description" class="default-textarea"></textarea>
        </div>

        <button :disabled="isLoading" class="btn btn-red">
            {{ isLoading ? 'Создание...' : 'Создать профиль заказчика' }}
        </button>
    </form>
</template>
<!-- TODO: реактивная проверка на никнейм в реальном времени времени -->
<script setup>
definePageMeta({
    middleware: ['auth']
});

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const profileStore = useProfileStore()
const router = useRouter()

const errorMsg = ref("")
const isLoading = ref(false)
const uploadError = ref(null)


// Форма профиля
const form = ref({
    public_name: '',
    username: '',
    description:'',
})

const avatarFile = ref < File | null > (null)

const handleFileSelected = (file) => {
    // получает файл
    console.log('получаем файл ', file.name)
    avatarFile.value = file
}

// Создание профиля
const createProfile = async () => {
    try {
        const supabase = useSupabaseClient()
        const user = useSupabaseUser()

        isLoading.value = true
        uploadError.value = null

        // Проверяем роль в JWT
        const currentRole = user.value?.user_metadata?.current_role
        if (currentRole !== 'customer') {
            throw new Error('в jwt user_metadata роль не кастомер')
        }

        // 1. Сначала загружаем аватар (если есть)========================
        let avatarUrl = null
        if (avatarFile.value) {
            try {
                // Создаем безопасное имя файла
                const fileExt = avatarFile.value.name.split('.').pop()
                const fileName = `${user.value.id}_${Date.now()}.${fileExt}`
                const filePath = `customer_avatars/${fileName}`

                // Загружаем файл с обработкой CORS
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile.value, {
                        cacheControl: '3600',
                        contentType: avatarFile.value.type || 'image/jpeg',
                        upsert: true
                    })

                if (uploadError) {
                    console.error('Ошибка загрузки:', uploadError)
                    throw new Error('Не удалось загрузить аватар')
                }

                // Получаем ПОСТОЯННЫЙ URL
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath)

                form.value.avatar_url = publicUrl

            } catch (error) {
                console.error('Ошибка загрузки аватара:', error)
                throw new Error('Проблема с загрузкой аватара')
            }
        }

        //Создаем профиль ====================================================
        console.log('Отправка формы', form.value)

        const { data: profile, error } = await supabase
            .from('customer_profiles')
            .insert({
                user_id: user.value.id,
                ...form.value,
            })
            .select()
            .single()

        if (error) throw error

        //Обновляем JWT с ID профиля
        await supabase.auth.updateUser({
            data: { current_profile_id: profile.id },
        })

        await navigateTo(`/users/customer/${profile.username}`)

    } catch (err) {
        console.error('Ошибка создания профиля:', err.message)
        // Перенаправляем на выбор роли при ошибке
        if (err.message.includes('выберите роль')) {
            await navigateTo('/profile-choose')
        }
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