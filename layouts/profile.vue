<template>
    <div class="wrapper">
        <Header />

        <div class="background-banner">

        </div>

        <main class="main">
            <slot />
        </main>

        <Footer />
    </div>
</template>

<script setup>
const profileStore = useProfileStore()

watchEffect(() => {
    console.log('[Layout] Auth state changed:', profileStore.isAuthenticated)
    console.log('[Layout] Active profile:', profileStore.activeProfile)
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

.background-banner {
    height: 300px;
    // background-color: yellow;
    position: relative;
    z-index: 1;
}

.main {
    position: relative;
    z-index: 2;
    margin-top: -150px;
    /* Насколько контент заезжает на баннер */
    flex: 1;
}
</style>