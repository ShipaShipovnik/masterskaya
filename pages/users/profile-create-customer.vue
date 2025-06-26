<template>
    <div class="page-grid-layout">
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
    </div>
</template>
<!-- TODO: реактивная проверка на никнейм в реальном времени времени -->
<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
    layout: 'default'
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
    description: '',
    avatar_url: '',
    contacts: {
        telegram: '',
        vkontakte: '',
        odnoklassniki: ''
    }
})

const avatarFile = ref<File | null>(null)

const handleFileSelected = (file) => {
    // получает файл
    console.log('получаем файл ', file.name)
    avatarFile.value = file
}


const createProfile = async () => {
    try {
        console.log('[createProfile] Начало создания профиля');
        isLoading.value = true;

        // 1. Получаем свежие данные пользователя
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('Ошибка получения пользователя');

        // 2. Проверяем роль ТОЛЬКО из user_metadata
        const currentRole = user.user_metadata?.current_role;
        if (currentRole !== 'customer') {
            console.error('[createProfile] Роль в user_metadata:', currentRole);
            throw new Error('Для создания профиля требуется роль мастера');
        }


        let avatarUrl = null;
        if (avatarFile.value) {
            try {
                console.log('[createProfile] Загрузка аватара...');

                // Создаем уникальное имя файла
                const fileExt = avatarFile.value.name.split('.').pop();
                const fileName = `${user.id}_${Date.now()}.${fileExt}`;
                const filePath = `customer_avatars/${fileName}`;

                // Загружаем файл
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile.value, {
                        cacheControl: '3600',
                        contentType: avatarFile.value.type || 'image/jpeg',
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                // Получаем публичный URL
                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                avatarUrl = publicUrl;
                console.log('[createProfile] Аватар загружен:', publicUrl);

            } catch (error) {
                console.error('[createProfile] Ошибка загрузки аватара:', error);
                throw new Error('Не удалось загрузить аватар');
            }
        }

        // 3. Создаём профиль
        const { data: newProfile, error: createError } = await supabase
            .from('customer_profiles')
            .insert({
                user_id: user.id,
                ...form.value,
                ...(avatarUrl && { avatar_url: avatarUrl })
            })
            .select()
            .single();

        if (createError) throw createError;

        // 4. Обновляем профиль в хранилище (без вызова loadProfile)
        profileStore.setProfile({ ...newProfile, role: 'customer' });

        // 5. Перенаправляем
        await navigateTo(`/users/customer/${newProfile.username}`);

    } catch (err) {
        console.error('[createProfile] Ошибка:', err);
        errorMsg.value = err.message;

        // Если проблема с ролью - возвращаем на выбор
        if (err.message.includes('роль')) {
            await navigateTo('/choose-role');
        }
    } finally {
        isLoading.value = false;
        console.log('[createProfile] Завершено');
    }
};
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