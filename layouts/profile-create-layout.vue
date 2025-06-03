<template>
    <div class="wrapper">

        <Header />
        <main class="main">
            <p>Теперь давайте создадим вам профиль для взаимодействия с сайтом.</p>
            <p>На данной версии проекта доступно только создание профиля Мастера.</p>
            <slot />
        </main>

        <Footer />
    </div>
</template>

<script>

</script>
<style lang="scss" scoped>
.profile-create__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    background-color: white;
    padding: 15px;
}

.profile-create__input-subtext {
    color: rgb(0, 0, 0, 50%);
    font-size: 12px;
}
</style>