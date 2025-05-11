<template>
    <div class="search-container">
        <div class="sidebar">

            <h2>Фильтры</h2>
            <div class="filters">
                <div class="input-group">
                    <label for="">Цена:</label>
                    <input type="number" class="default-input">р. - <input type="number" class="default-input">р.
                </div>
                <label for="">Категория:</label>
                <select name="" id="" class="default-input">
                    <option value="" v-for="category in categories" :key="category.id">{{ category.title }}</option>
                </select>

                <div class="input-group">
                    <label for="">Cрок выполнения:</label>
                    До <input type="text" class="default-input"> дней
                </div>

            </div>
        </div>
        <div class="search-content">
            <h1>РЕЗУЛЬТАТЫ ПОИСКА: </h1>
            <div class="search-header">
                <input type="text" placeholder="Название услуги" class="default-input"> <button type="submit">Искать</button>
            </div>
            <div class="search-content__results">
             
            </div>

        </div>
    </div>
</template>

<script setup>
const client = useSupabaseClient()
const categories = ref([])


async function getCategories() {
    const { data, error } = await client.from('categories').select();

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    if (data) {
        categories.value = data;
    } else {
        console.warn('No categories found.');
    }
}
onMounted(() => {
    getCategories()
})
</script>

<style lang="scss" scoped>
.search-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
    // border: 1px green solid;
    min-height: 1000px;
}

.sidebar {
    padding: 20px;
    grid-column: 1 / 4;
    background-color: white;

    display: flex;
    flex-direction: column;
}

.search-content {
    padding: 20px;
    grid-column: 4 / 13;
    background-color: white;

    .search-header {
        width: 100%;
    }
}
</style>