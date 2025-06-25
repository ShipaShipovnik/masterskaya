<template>
    <div class="layout-container bg-white p-4 rounded-lg shadow-sm">
        <h1 class="text-2xl font-bold mb-6">Добавление услуги</h1>
        <form @submit.prevent="createService" class="service-create__form__form space-y-6">
            <!-- Название услуги -->
            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Название:</label>
                <input type="text" class="default-input w-full p-2 border rounded" v-model="form.title" required>
            </div>

            <!-- Дедлайн -->
            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Дедлайн:</label>
                <p class="service-create__form__input-subtext text-gray-500 text-xs">
                    Срок выполнения в днях
                </p>
                <input type="number" class="default-input w-full p-2 border rounded" v-model="form.deadline" required
                    min="1">
            </div>

            <!-- Диапазон цены -->
            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Диапазон цены:</label>
                <p class="service-create__form__input-subtext text-gray-500 text-xs">
                    Цена за услугу.
                </p>
                <div class="flex items-center gap-2">
                    <input type="number" class="default-input w-1/3 p-2 border rounded" v-model="form.min_price"
                        min="1">
                    <span class="mx-2">-</span>
                    <input type="number" class="default-input w-1/3 p-2 border rounded" v-model="form.max_price"
                        min="1">
                    <span class="ml-1">р.</span>
                </div>
            </div>

            <!-- Категория -->
            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Категория:</label>
                <select v-model="form.category_id" class="default-input w-full p-2 border rounded" required>
                    <option value="" disabled selected>Выберите категорию</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.title }}
                    </option>
                </select>
            </div>

            <!-- Описание услуги -->
            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Описание услуги:</label>
                <p class="service-create__form__input-subtext text-gray-500 text-xs">
                    Опишите что предоставляет услуга.
                </p>
                <textarea v-model="form.description" class="default-textarea w-full p-2 border rounded h-32"></textarea>
            </div>

            <!-- Условия работы -->
            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Условия работы:</label>
                <p class="service-create__form__input-subtext text-gray-500 text-xs">
                    Опишите условия работы, например материалы которые вам потребуются от заказчика для работы.
                </p>
                <textarea v-model="form.terms" class="default-textarea w-full p-2 border rounded h-32"></textarea>
            </div>

            <!-- Количество слотов -->
            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Доступные слоты:</label>
                <p class="service-create__form__input-subtext text-gray-500 text-xs">
                    Сколько свободных слотов осталось? Указывайте если готовы выполнять эту услугу несколько раз, или
                    оставьте 1 если она единоразовая.
                </p>
                <input type="number" class="default-input w-1/3 p-2 border rounded" v-model="form.amount" min="1">
            </div>

            <div class="service-create__form__input-group space-y-2">
                <label class="block font-medium">Доступные слоты:</label>
                <p class="service-create__form__input-subtext text-gray-500 text-xs">
                    Сколько свободных слотов осталось? Указывайте если готовы выполнять эту услугу несколько раз, или
                    оставьте 1 если она единоразовая.
                </p>
                <ServicePhotosUploader :initialFiles="form.photos" @update:files="photos = $event" :maxFiles="10" />
            </div>

            <button type="submit"
                class="btn btn-red bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">
                {{ isLoading ? 'Создание...' : 'Создать услугу' }}
            </button>
        </form>
    </div>
</template>
<script setup>
definePageMeta({
    layout: 'default',
    middleware: 'auth',
})
const supabase = useSupabaseClient()
const categories = ref([])
const errorMsg = ref("")
const isLoading = ref(false)

const profileStore = useProfileStore()
const activeRole = computed(() => profileStore.current_role)
const username = computed(() => profileStore.current_profile?.username)
const master_id = computed(() => profileStore.current_profile?.id || 'Гость')

async function getCategories() {
    const { data, error } = await supabase.from('categories').select()
    if (error) {
        console.error('Ошибка фетча категорий:', error)
        errorMsg.value = 'Ошибка загрузки категорий'
        return
    }
    categories.value = data || []
}

const photos = ref([]) // Массив File объектов
const form = useState('serviceForm', () => ({
    title: '',
    description: '',
    terms: '',
    deadline: null,
    min_price: 1,
    max_price: null,
    amount: 1,
    category_id: null,
    photos: [] //urls фоток
}))

async function createService() {
    try {
        console.log('[createService] Начало формирования услуги');
        isLoading.value = true;
        errorMsg.value = '';

        let uploadedPhotoUrls = [];
        let uploadFailed = false;

        // Загружаем фотографии если они есть
        if (photos.value && photos.value.length) {
            console.log('[createService] Начало загрузки фотографий...');

            for (const [index, file] of photos.value.entries()) {
                try {
                    // 1. Валидация файла перед загрузкой
                    console.group(`Файл ${index + 1}/${photos.value.length}: ${file.name}`);
                    console.log('Размер:', (file.size / 1024 / 1024).toFixed(2), 'MB');
                    console.log('Тип:', file.type);

                    // Проверка формата и размера
                    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
                    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

                    if (!ALLOWED_TYPES.includes(file.type)) {
                        throw new Error(`Недопустимый формат. Разрешены только: ${ALLOWED_TYPES.join(', ')}`);
                    }

                    if (file.size > MAX_SIZE) {
                        throw new Error(`Файл слишком большой (${(file.size / 1024 / 1024).toFixed(2)} MB). Максимум 5MB`);
                    }

                    // 2. Подготовка к загрузке
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${master_id.value}_${Date.now()}_${index}.${fileExt}`;
                    const filePath = `service-photos/${master_id.value}/${fileName}`;

                    console.log('Пытаюсь загрузить в:', filePath);

                    // 3. Загрузка с подробным логированием
                    const uploadStartTime = Date.now();
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('service-photos')
                        .upload(filePath, file, {
                            cacheControl: '3600',
                            contentType: file.type,
                            upsert: false
                        });

                    console.log('Ответ от Supabase:', { uploadData, uploadError });
                    console.log('Время загрузки:', (Date.now() - uploadStartTime) / 1000, 'сек');

                    if (uploadError) {
                        console.error('Ошибка загрузки:', uploadError);
                        throw uploadError;
                    }

                    // 4. Получение публичного URL
                    const { data: urlData } = supabase.storage
                        .from('service-photos')
                        .getPublicUrl(filePath);

                    console.log('Публичный URL:', urlData.publicUrl);
                    uploadedPhotoUrls.push(urlData.publicUrl);
                    console.groupEnd();

                } catch (fileError) {
                    console.groupEnd();
                    console.error(`Ошибка при загрузке файла ${file.name}:`, fileError);
                    uploadFailed = true;

                    // Сохраняем информацию об ошибке для пользователя
                    errorMsg.value = `Ошибка при загрузке ${file.name}: ${fileError.message || 'неизвестная ошибка'
                        }. Проверьте формат и размер файла (макс. 5MB, только JPG/PNG/WebP)`;

                    // Удаляем уже загруженные файлы
                    if (uploadedPhotoUrls.length > 0) {
                        console.log('Удаление загруженных файлов из-за ошибки...');
                        await deleteUploadedFiles(uploadedPhotoUrls);
                    }

                    break; // Прерываем цикл при ошибке
                }
            }

            if (uploadFailed) {
                return; // Не продолжаем если были ошибки загрузки
            }

            form.value.photos = uploadedPhotoUrls;
            console.log('[createService] Все фото успешно загружены:', uploadedPhotoUrls);
        }

        // 5. Отправка основной формы
        console.log('Отправка данных услуги...');
        const { data: serviceData, error: serviceError } = await supabase
            .from('services')
            .insert({
                ...form.value,
                master_id: master_id.value
            })
            .select(); // Добавляем .select() чтобы получить ответ

        console.log('Ответ от Supabase (создание услуги):', { serviceData, serviceError });

        if (serviceError) {
            // Удаляем фото если не удалось сохранить услугу
            if (form.value.photos.length > 0) {
                await deleteUploadedFiles(form.value.photos);
            }
            throw serviceError;
        }

        // 6. Успешное завершение
        console.log("[CREATE SERVICE] Успешно создана услуга:", serviceData);
        localStorage.removeItem('serviceForm');
        await navigateTo(`/users/master/${username.value}`);

    } catch (err) {
        console.error("[CREATE SERVICE] Критическая ошибка:", err);
        errorMsg.value = err.message || 'Ошибка создания услуги. Проверьте данные и попробуйте снова.';
    } finally {
        isLoading.value = false;
    }
}

// Функция для удаления загруженных файлов
async function deleteUploadedFiles(urls) {
    try {
        console.log('Начало удаления загруженных файлов...');
        const filesToDelete = urls.map(url => url.split('service-photos/')[1]);

        const { data, error } = await supabase.storage
            .from('service-photos')
            .remove(filesToDelete);

        console.log('Результат удаления файлов:', { data, error });
    } catch (deleteError) {
        console.error('Ошибка при удалении файлов:', deleteError);
    }
}

onMounted(() => {
    getCategories()

    const savedForm = localStorage.getItem('serviceForm')
    if (savedForm) {
        form.value = JSON.parse(savedForm)
    }

})
</script>

<style lang="scss" scoped>
.layout-container {
    background-color: white;
    padding: 15px;
}

.service-create__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    background-color: white;
    padding: 15px;
}

.service-create__form__input-subtext {
    color: rgb(0, 0, 0, 50%);
    font-size: 12px;
}
</style>