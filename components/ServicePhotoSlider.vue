<template>
    <div class="swiper-container">
        <Swiper 
        :modules="modules" 
        :slides-per-view="1" 
        :space-between="20" 
        :navigation="{
        nextEl: '.custom-next',
        prevEl: '.custom-prev'}"
        :pagination="{
            clickable: true,
            el: '.custom-pagination'}"
        @swiper="onSwiper" 
        loop
        class="service-gallery" >
            <SwiperSlide v-for="(photo, index) in photos" :key="index">
                <img :src="photo" :alt="`Фото услуги ${index + 1}`" class="swiper-slide-img">
            </SwiperSlide>

            <!-- Кастомные элементы управления -->
            <div class="custom-navigation">
                <button class="custom-prev">
                <Icon name="material-symbols:arrow-back-ios" />
                </button>
                <div class="custom-pagination"></div>
                <button class="custom-next">
                <Icon name="material-symbols:arrow-forward-ios" />
                </button>
            </div>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination]

const props = defineProps({
    photos: {
        type: Array,
        required: true
    }
})

const swiperInstance = ref<any>(null)

const onSwiper = (swiper: any) => {
    swiperInstance.value = swiper
}

// Обновляем слайдер при изменении photos
watch(() => props.photos, () => {
    nextTick(() => {
        if (swiperInstance.value) {
            swiperInstance.value.update()
        }
    })
})

</script>

<style lang="scss" scoped>

.swiper-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.service-gallery {
  width: 100%;
  height: 100%;
}

.swiper-slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.custom-navigation {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  z-index: 10;
}

.custom-prev,
.custom-next {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-prev:hover,
.custom-next:hover {
  background: rgba(0, 0, 0, 0.8);
}

:deep(.custom-pagination) {
  display: flex;
  justify-content: center;
  gap: 8px;
}

:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background: white;
  opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: var(--primary-color);
}

</style>