<template>
    <div class="wrapper">

        <Header />
        <main class="main">
            <div class="sidebar">
                
            </div>
            <slot />
        </main>

        <Footer />
    </div>
</template>

<script setup>

const supabase = useSupabaseClient()
const user = ref(null)

onMounted(async () => {
    const profileStore = useProfileStore()

    // Если пользователь авторизован, но профиль не загружен
    if (useSupabaseUser().value && !profileStore.current_profile) {
        await profileStore.loadProfile()
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