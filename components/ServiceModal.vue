<template>
    <transition name="service-modal">
        <div class="service-modal">
            <div class="service-modal-backdrop" @click="handleClose">
                <div class="service-modal-container">
                    <div v-if="isLoading">
                        <h1>ЗАГРУЗКА.......</h1>
                    </div>
                    <div v-else-if="errorMsg">
                        <h1>{{ errorMsg }}</h1>
                    </div>

                    <div class="service-modal-content" @click.stop v-else-if="serviceData">
                        <header class="service-modal-header">
                            <h5 class="text-muted service-modal__small-h">Подробная информация об услуге: </h5>
                            <button type="button" @click="handleClose">
                                <Icon name="material-symbols:close" style="color: black" class="" />

                            </button>
                        </header>
                        <section class="service-modal-gallery">
                            <div class="swiper service-gallery">
                                <div class="swiper-wrapper">
                                    <div v-for="(image, index) in images" :key="index" class="swiper-slide">
                                        <img :src="image" :alt="`Услуга ${index + 1}`">
                                    </div>
                                </div>

                                <button class="gallery-arrow-btn swiper-button-prev">
                                    <Icon name="material-symbols:arrow-back-ios" style="color: black" />
                                </button>
                                <button class="gallery-arrow-btn swiper-button-next">
                                    <Icon name="material-symbols:arrow-forward-ios" style="color: black" />
                                </button>
                            </div>
                        </section>
                        <section class="service-modal-info">
                            <div class="service-modal-info__top">
                                <h3 class="service-title info-li">{{ serviceData.title }}</h3>
                                <p class="info-li">
                                    <span class="text-muted">Категория:</span>
                                    {{ serviceData.categories.title }}
                                </p>
                                <p class="info-li">
                                    <span class="text-muted">Cрок выполнения:</span>
                                    до {{ serviceData.deadline }} дней
                                </p>
                                <p class="info-li">
                                    <span class="text-muted">Кол-во слотов:</span>
                                    {{ serviceData.amount }}
                                </p>
                            </div>
                            <div class="service-modal-info__bottom">
                                <h3 class="info-li service-price"><span class="text-muted">Цена:</span> от {{
                                    serviceData.min_price }} ₽</h3>
                                <button class="btn btn-red order-btn">Написать мастеру</button>
                            </div>
                        </section>
                        <section class="service-modal-bottom">
                            <div class="service-modal__description">
                                <h5 class="text-muted service-modal__small-h">
                                    ОПИСАНИЕ:
                                </h5>
                                <p>
                                    {{ serviceData.description }}
                                </p>
                            </div>
                            <div class="service-modal__description">
                                <h5 class="text-muted service-modal__small-h">
                                    УСЛОВИЯ РАБОТЫ:
                                </h5>
                                <p>
                                    {{ serviceData.terms }}
                                </p>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>
<script setup>
import Swiper from 'swiper'
import 'swiper/css'

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
        required: true,
    },
    serviceId: {
        type: [String, Number],
        required: true,
    }
}
)
const emit = defineEmits(['close'])
const serviceData = ref()
const supabase = useSupabaseClient()
const isLoading = ref(false);
const errorMsg = ref(false);
const images = ref([''])


async function fetchService() {
    try {
        isLoading.value = true
        errorMsg.value = null

        const { data, error } = await supabase
            .from('services')
            .select(`
        *,
        categories (
          title
        )
      `)
            .eq('id', props.serviceId)
            .single()

        if (error) throw error

        serviceData.value = data
        console.log('Загруженные данные:', data) // Для отладки

    } catch (error) {
        errorMsg.value = 'Ошибка загрузки данных'
        console.error('[ServiceModal] Ошибка:', error)
    } finally {
        isLoading.value = false
    }
}

const handleClose = () => {
    emit('close')
}


watch(() => props.show, (val) => {
    if (val) fetchService()
})

// Инициализация при монтировании, если модалка уже открыта
onMounted(() => {
    if (props.show) fetchService()
})
</script>
<style lang="scss">
.service-modal-enter,
.service-modal-leave-to {
    opacity: 0;
}

.service-modal-enter-active,
.service-modal-leave-active {
    transition: opacity 0.2s ease;
}

.service-modal {

    .service-modal__small-h {
        font-size: 16px;

    }

    &-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        transition: opacity 0.3s ease;
        z-index: 9999;
    }

    &-container {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: auto;
        margin: 16px;
    }

    &-content {
        display: grid;
        outline: 1px red solid;
        grid-template-columns: repeat(12, 1fr);
        column-gap: 30px;
        max-width: 1200px;


        margin: 1.75rem auto;
        padding: 20px 30px;
        border-radius: 5px;
        color: #000;
        background-color: #fff;
        transform: translate(0, 0);
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    &-header {
        padding-bottom: 16px;
        font-size: 25px;
        display: flex;
        justify-content: space-between;
        grid-column: 1 / 13;
    }

    &-gallery {
        grid-column: 1 / 7;
        min-height: 500px;
    }

    &-info {
        grid-column: 9 / 13;
        display: flex;
        flex-direction: column;

        .info-li {
            margin-bottom: 8px;
        }

        &__top {
            flex-grow: 1;

            .service-title {
                font-weight: 600;
                font-size: 26px;
            }

        }

        &__bottom {
            text-align: center;

            .service-price {
                font-weight: 600;
                font-size: 26px;
            }
        }

        .order-btn {
            width: 100%;
        }
    }

    &-bottom {
        grid-column: 1 / 13;
    }
}
</style>
