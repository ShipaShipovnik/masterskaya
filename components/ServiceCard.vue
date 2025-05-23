<template>
    <div class="card">
        <NuxtLink to="" class="card__link">
            <div class="card__image-container">
                <img src="~/assets/images/test_service.jpg" alt="service photo" class="card__image">
                <div class="card__category-label">
                    {{ service.categories.title }}
                </div>
            </div>

            <div class="card__content">
                <h3 class="card__title">{{ service.title }}</h3>

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
            </div>
        </NuxtLink>
    </div>
</template>

<script setup>
const props = defineProps({
    service: {
        type: Object,
        required: true,
        validator: (value) => {
            return 'title' in value && 'categories' in value
        }
    }
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