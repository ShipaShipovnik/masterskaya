<template>
    <div class="layout-container">
        <div class="left column">
            <h1>Профиль Мастера</h1>

            <ul>
                <li>Размещать услуги</li>
                <li>Заполнять портфолио работами</li>
                <li>Удобный менеджмент исполняемых заказов</li>
                <li>Связываться с заказчиком</li>
            </ul>

            <NuxtLink to="/users/profile-create-master">
                <button class="btn btn-red">Создать профиль мастера</button>
            </NuxtLink>
        </div>
        <!-- <div class="divider"></div> -->
        <div class="right column">
            <h1>Профиль Заказчика</h1>

            <ul class="">
                <li>Заказывать услуги</li>
                <li>Связываться с мастером</li>
                <li>Ваши заказы будут видны только вам и мастеру гарантируя анонимность.</li>
                <li>Представлять как физическое лицо так и компанию</li>
            </ul>

            <NuxtLink to="/users/profile-create-customer">
                <button class="btn btn-red" disabled>Создать профиль Заказчика</button>
            </NuxtLink>
        </div>
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
.layout-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    padding-top: 80px;
}

.column {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 15px;

    ul {
        text-align: left;
        // margin-bottom: 15px;
    }

    li {
        list-style-type: disc;
    }
}

.left {
    grid-column: 1 / 6;
    border-right: 1px grey solid;
}

.right {
    grid-column: 7 / 13;
}
</style>