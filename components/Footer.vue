<template>
    <footer class="footer">
        <div class="layout-container">
            <div class="footer__block">
                <p class="footer__copyright"></p>
            </div>
            <div class="footer__block">
                <div class="footer__socials">
                </div>
            </div>
            <div class="footer__block">
                <p class="footer__contacts"><span class="">+ 7 999 999 99 99 </span> - 11:00 - 18:00 ПН-ПТ</p>
                <p class="footer__contacts">masterskaya.support@yandex.ru</p>
            </div>
        </div>

    </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.footer {
    background-color: #2A2A2A;
    color: white;
    position: relative;
    z-index: 3;

    height: 150px;
    
    .layout-container {
        display: grid;
        height: 100%;
    }
}
</style>