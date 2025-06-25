<template>
    <div class="card" @mouseenter="hover = true" @mouseleave="hover = false">
        <div class="card__image-container" @click="openModal">
            <img :src="servicePhoto" alt="service photo" class="card__image">
            <div class="card__category-label">
                {{ service.categories.title }}
            </div>
        </div>

        <div class="card__content">
            <h3 class="card__title" @click="openModal">{{ service.title }}</h3>

            <div class="card__meta">
                <div class="card__deadline">
                    <Icon name="meteor-icons:clock" class="card__deadline-icon" size="1em" />
                    <span class="card__deadline-text">
                        до {{ service.deadline }} дней
                    </span>
                </div>

                <div class="card__price">
                    от {{ service.min_price }} ₽
                </div>
            </div>
            <Transition name="fade">
                <div class="card__actions-btns" v-if="isOwner && hover">
                    <button class="service-edit-btn btn">
                        Редактировать
                    </button>
                    <button class="service-delete-btn btn btn-red" @click="deleteService(service.id)">
                        Удалить
                        <Icon name="material-symbols:delete" size="1em" />
                    </button>
                </div>
            </Transition>
        </div>
    </div>

    <Teleport to="body">
        <ServiceModal v-if="isModalOpen" :serviceId="service.id" @close="closeModal" :show="isModalOpen" />
    </Teleport>
</template>

<script setup>
const hover = ref(false)
const isModalOpen = ref(false)
const supabase = useSupabaseClient()
// const defaultImage = '/images/default-service.jpg'; // Путь к изображению-заглушке
const actionBtnsActive = ref(false)

const emit = defineEmits(['service-deleted']);

const props = defineProps({
    service: {
        type: Object,
        required: true,
        validator: (value) => {
            return 'title' in value && 'categories' in value
        }
    },
    isOwner: {
        type: Boolean,
        default: false,
    }
})

// удаление
const deleteService = async (serviceId) => {
    if (!props.isOwner) {
        alert('У вас нет прав на удаление этой услуги');
        return;
    }

    if (!confirm('Вы действительно хотите удалить карточку услуги?')) {
        return;
    }

    try {
        console.log('Начинаю удаление!', serviceId.value);

        const { data, error } = await supabase
            .from('services')
            .delete()
            .eq('id', serviceId);

        if (error) throw error;

        await refreshNuxtData();

        emit('service-deleted'); // Сообщаем родителю об удалении
        console.log('Успешно удалено!', data);

        // Здесь можно добавить обновление состояния или перенаправление
    } catch (error) {
        console.error('Ошибка при удалении услуги:', error);
    }
};

const openModal = () => {
    isModalOpen.value = true
    document.body.style.overflow = 'hidden'
}

const closeModal = () => {
    isModalOpen.value = false
    document.body.style.overflow = ''
}

const servicePhoto = computed(() => {
    return props.service.photos?.[0];
})

</script>

<style lang="scss" scoped>
.card {
    width: 280px;
    height: 380px;
    background-color: $white;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    position: relative;

    &__actions-btns {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px;
        background: linear-gradient(to top, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 0.8) 100%);
        display: flex;
        gap: 8px;
        z-index: 2;

        .btn {
            flex: 1;
            padding: 8px;
            font-size: 14px;
        }
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);

        .card__image {
            transform: scale(1.05);
        }
    }

    &__link {
        display: block;
        height: 100%;
        text-decoration: none;
        color: inherit;
    }

    &__image-container {
        position: relative;
        width: 100%;
        height: 50%;
        overflow: hidden;
        border-radius: 3px 3px 0 0;
    }

    &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    &__category-label {
        position: absolute;
        top: 12px;
        left: 12px;
        background-color: rgba($red, 0.9);
        color: white;
        padding: 4px 12px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 500;
    }

    &__content {
        height: 50%;
        padding: 18px;
        display: flex;
        flex-direction: column;
    }

    &__title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        flex-grow: 1;
    }

    &__meta {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    &__action-btns {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .service-delete-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 2px;
        font-size: 1rem;
    }

    .service-edit-btn {
        width: 100%;
        padding: 5px 10px;
        background-color: $yellow;
        flex-grow: 2;

    }

    &__deadline {
        display: flex;
        align-items: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;

        &-icon {
            color: rgba(0, 0, 0, 0.4);
            margin-right: 6px;
        }

        &-text {
            font-size: 14px;
        }
    }

    &__price {
        background-color: #ffe89c;
        padding: 6px 14px;
        border-radius: 5px;
        font-weight: 600;
        font-size: 15px;
        transition: transform 0.3s ease, background-color 0.3s ease;

        .card:hover & {
            background-color: #ffdc73;
            transform: scale(1.05);
        }
    }
}
</style>