<template>
    <footer class="footer">
        <div class="layout-container">
            <div class="footer__block">
                <p class="footer__copyright">(с) MASTERSKAYA, 2025 <br>
                    Все права защищены</p>
            </div>
            <div class="footer__block">
                <div class="footer__socials">
                    <NuxtLink to="/">
                        <SvgoOkIcon class="footer__icon" />
                    </NuxtLink>
                    <NuxtLink to="/">
                        <SvgoVkIcon class="footer__icon" />
                    </NuxtLink>
                    <NuxtLink to="/">
                        <SvgoTgIcon class="footer__icon" />
                    </NuxtLink>
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
    color: $white;
    position: relative;
    z-index: 3;
    height: 150px;
    padding: 70px 0 30px 0;

    .layout-container {
        display: grid;
        grid-template-columns: repeat(3, 4fr);
        height: 100%;
        align-items: end;
    }

    .footer__socials {
        display: flex;
        gap: 10px;

        .footer__icon {
            font-size: 40px;
        }
    }

    .footer__socials:nth-child(1) {
        justify-content: center;
    }
}
</style>