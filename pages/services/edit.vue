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
                {{ isLoading? 'Создание...':'Создать услугу'}}
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
const isLoading= ref(false)

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
        isLoading.value = true

        let uploadedPhotoUrls = [];

        // Загружаем фотографии если они есть
        if (photos.value && photos.value.length) {
            console.log('[createService] Начало загрузки фотографий...');

            for (const [index, file] of photos.value.entries()) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${master_id.value}_${Date.now()}_${index}.${fileExt}`;
                    const filePath = `service-photos/${master_id.value}/${fileName}`;

                    console.log(`[createService] Загрузка файла ${index + 1}/${photos.value.length}: ${file.name}`);

                    const { error: uploadError } = await supabase.storage
                        .from('service-photos')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('service-photos')
                        .getPublicUrl(filePath);

                    uploadedPhotoUrls.push(publicUrl);
                    console.log(`[createService] Файл загружен: ${publicUrl}`);

                } catch (fileError) {
                    console.error(`[createService] Ошибка при загрузке файла ${file.name}:`, fileError);
                    // Продолжаем обработку остальных файлов
                    continue;
                }
            }

            form.value.photos = uploadedPhotoUrls;
            console.log('[createService] Все загруженные фото:', uploadedPhotoUrls);
        }

        // отправка услуги вместе с фотками
        const { error } = await supabase
            .from('services')
            .insert({
                ...form.value,
                master_id: master_id.value
            })

        if (error) throw error
        
        console.log("[CREATE SERVICE] Удача: ")
        localStorage.removeItem('serviceForm')

        await navigateTo(`/users/master/${username.value}`)
    } catch (err) {
        console.error("[CREATE SERVICE] Ошибка:", err)
        errorMsg.value = err.message || 'Ошибка создания услуги'
    } finally{
        isLoading.value = false
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



.default-input {
    @apply border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500;
}

.default-textarea {
    @apply border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500;
}

.btn-red {
    @apply bg-red-500 hover:bg-red-600 text-white;
}
</style>