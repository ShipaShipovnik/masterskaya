<template>
    <div class="search-page">
        <div class="search-page__container">
            <!-- Боковая панель фильтров -->
            <aside class="search-filters">
                <div class="search-filters__header">
                    <h2 class="search-filters__title">Фильтры</h2>
                    <button class="search-filters__reset" @click="resetFilters">Сбросить все</button>
                </div>

                <div class="search-filters__content">
                    <!-- Фильтр по цене -->
                    <div class="search-filter">
                        <label class="search-filter__label">Цена, ₽</label>
                        <div class="price-range">
                            <input v-model.number="filters.priceRange.min" type="number"
                                class="input default-input input_price input_price_min" placeholder="От" min="0">
                            <span class="price-range__separator">—</span>
                            <input v-model.number="filters.priceRange.max" type="number"
                                class="input default-input input_price input_price_max" placeholder="До" min="0">
                        </div>
                    </div>

                    <!-- Фильтр по категории -->
                    <div class="search-filter">
                        <label class="search-filter__label">Категория</label>
                        <select v-model.number="filters.categoryId" class="input default-input">
                            <option :value="null">Все категории</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.title }}
                            </option>
                        </select>
                    </div>

                    <!-- Фильтр по сроку -->
                    <div class="search-filter">
                        <label class="search-filter__label">Срок выполнения</label>
                        <div class="deadline-filter">
                            <input v-model.number="filters.maxDeadline" type="number" class="input default-input"
                                placeholder="Максимум" min="1">
                            <span class="days-label">дней</span>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Основное содержимое -->
            <main class="search-results">
                <div class="search-results__header">
                    <div class="search-results__search-bar">
                        <input type="text" class="input-search default-input" placeholder="Поиск по названию услуги..."
                            v-model="filters.query" @input="performSearch">
                        <button class="btn-red btn button-search">Найти</button>
                    </div>
                    <h1 class="search-results__title">Результаты поиска</h1>

                </div>

                <!-- Карточки услуг -->
                <div>
                    <div v-if="loading">Loading...</div>
                    <div v-else class="search-results__cards">
                        <ServiceCard v-for="service in services" :key="service.id" :serviceTitle="service.title"
                            :serviceMinPrice="service.min_price" :serviceDeadline="service.deadline" />
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const services = ref([])
const loading = ref(false)
const categories = ref([])

// Параметры фильтрации
const filters = reactive({
    query: '',
    priceRange: {
        min: null,
        max: null
    },
    categoryId: null,
    maxDeadline: null
})

// Получаем категории при загрузке
onMounted(async () => {
    const { data } = await supabase.from('categories').select('id, title')
    categories.value = data
    fetchServices() // Первоначальная загрузка услуг
})

// Функция поиска с фильтрами
const fetchServices = async () => {
    try {
        loading.value = true
        services.value = []

        let query = supabase
            .from('services')
            .select('*, master_profiles(*), categories(*)')
            .eq('is_available', true)

        // Фильтр по текстовому запросу
        if (filters.query) {
            query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
        }

        // Фильтр по категории
        if (filters.categoryId) {
            query = query.eq('category_id', filters.categoryId)
        }

        // Фильтр по цене
        if (filters.priceRange.min) {
            query = query.gte('min_price', filters.priceRange.min)
        }
        if (filters.priceRange.max) {
            query = query.lte('max_price', filters.priceRange.max)
        }

        // Фильтр по сроку выполнения
        if (filters.maxDeadline) {
            query = query.lte('deadline', filters.maxDeadline)
        }

        const { data, error } = await query

        if (error) throw error
        services.value = data
    } catch (e) {
        console.error('Ошибка загрузки услуг:', e)
    } finally {
        loading.value = false
    }
}

// Сброс фильтров
const resetFilters = () => {
    filters.query = ''
    filters.priceRange = { min: null, max: null }
    filters.categoryId = null
    filters.maxDeadline = null
    fetchServices()
}

// Отслеживание изменений фильтров с debounce
watch(
    filters,
    () => {
        fetchServices()
    },
    { deep: true }
)
</script>

<style lang="scss" scoped>
.search-page {
    &__container {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        column-gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
        margin-top: 40px;
    }

    .search-filters {
        grid-column: 1 / 4;
        background: white;
        padding: 10px;

        &__content {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        &__header {
            display: flex;
            justify-content: space-between;


        }

        &__reset {
            color: $red;
        }

        .search-filter {
            &__label {
                font-weight: 500;
            }

            .price-range {
                display: flex;
                justify-content: space-between;
            }
        }
    }
}

.input {

    &_price {
        width: 100px;

    }
}

.search-results {
    grid-column: 4 / 13;
    background: $white;
    padding: 10px;

    .search-results__search-bar {
        width: 100%;
        margin-bottom: 15px;

        .input-search {
            width: 80%;
            border-radius: 3px 0 0 3px;
            border-right: none;
        }

        .button-search {
            width: 20%;
            border-radius: 0px 3px 3px 0;

            border-left: none;
            padding: 5px 14px;

        }

    }

    &__cards {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;

        row-gap: 20px;

    }

}
</style>