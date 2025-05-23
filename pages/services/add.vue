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

            <button type="submit"
                class="btn btn-red bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors">
                Создать услугу
            </button>
        </form>
    </div>
</template>
<script setup>
definePageMeta({
    layout: 'default',
    middleware: 'auth',
})
const client = useSupabaseClient()
const categories = ref([])
const errorMsg = ref("")


const profileStore = useProfileStore()


async function getCategories() {
  const { data, error } = await client.from('categories').select()
  if (error) {
    console.error('Error fetching categories:', error)
    errorMsg.value = 'Ошибка загрузки категорий'
    return
  }
  categories.value = data || []
}


const form = ref({
    title: '',
    description: '',
    terms: '',
    deadline: null,
    min_price: 1,
    max_price: null,
    amount: 1,
    category_id: null,
})

async function createService() {
  try {
    if (!profileStore.activeProfile?.id) {
      throw new Error('Профиль мастера не загружен')
    }

    const {error } = await client
      .from('services')
      .insert({
        ...form.value,
        master_id: profileStore.activeProfile.id
      })

    if (error) throw error

    console.log("[CREATE SERVICE] Удача: ")
    
    await navigateTo(`/users/profile/${profileStore.activeProfile.username}`)
  } catch (err) {
    console.error("[CREATE SERVICE] Ошибка:", err)
    errorMsg.value = err.message || 'Ошибка создания услуги'
  }
}


onMounted(() => {
    getCategories()
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