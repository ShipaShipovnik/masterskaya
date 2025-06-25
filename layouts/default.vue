<template>
    <div class="wrapper">

        <Header />
        <main class="main">
            <!-- <div v-if="profileStore.loading" class="global-loading">
                Загрузка данных...
            </div> -->
            <slot />
        </main>

        <Footer />
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main {
    flex: 1;
}
</style>