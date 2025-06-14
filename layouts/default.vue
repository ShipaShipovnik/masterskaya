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
const profileStore = useProfileStore()
console.log('current_profile:', profileStore.current_profile)
console.log('current_role:', profileStore.current_role)
</script>

<style lang="scss" scoped>
$red: $red;
$yellow: #ffe89c;

.wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main {
    flex: 1;
}
</style>