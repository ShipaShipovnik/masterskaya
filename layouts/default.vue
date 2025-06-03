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

// Только логирование (без инициализации)
watchEffect(() => {
    if (process.client) { // Только на клиенте
        console.log('[Layout] Current state:', {
            isAuth: profileStore.isAuthenticated,
            role: profileStore.activeRole,
            profile: profileStore.activeProfile
        })
    }
})
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