<template>
    <div class="card">
        <NuxtLink to="">
            <img src="~/assets/images/test_service.jpg" alt="service photo" class="card__img">
            <div class="card__info">
                <p class="card__title">Логотип по образцу в векторе в максимальном качестве Современный модерн дизайн.
                </p>

                <div class="card__bottom">
                    <div class="card__deadline">
                        <Icon name="meteor-icons:clock" style="color: grey" size="1em" /> <span class="">до 2
                            недель</span>
                    </div>

                    <button class="card__price btn hover:scale-110 transition-size duration-300">
                        от 1000р.
                    </button>

                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
$red: #DC3B46;
$salat: #84C318;

.card {
    width: 260px;
    height: 350px;
    background-color: white;
    border: 1px #999999 solid;


    .card__img {
        width: 100%;
        height: 50%;
    }

    .card__info {
        height: 50%;
        padding: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 16px;


        .card__bottom {
            display: flex;
            justify-content: space-between;

            .card__deadline {

                color: rgb(0, 0, 0, 50%);
                display: flex;
                align-items: center;
                font-size: 16px;

                span {
                    margin-left: 5px;
                    font-size: 12px;
                }
            }

            .card__price {
                background-color: $salat;
                padding: 0px 10px;
                height: 30px;
            }
        }
    }


}
</style>