<template>
    <div class="wrapper">

        <Header />
        <main class="main">
            <slot />
        </main>

        <Footer />
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
$red: #DC3B46;
$salat: #84C318;

.wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main {
    flex: 1;
}
</style>