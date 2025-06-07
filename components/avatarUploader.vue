<template>
    <div class="avatar-upload" @click="triggerFileInput">
        <img :src="tempPreviewUrl || initialAvatar || defaultAvatar" alt="Аватар профиля"
            class="avatar-image" />
        <div class="upload-overlay">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                <path d="M12 4v5h5l-6 6-6-6h5V4h2zm7 15H5v-2h14v2z" />
            </svg>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="handleFileChange" />
    </div>
</template>

<script setup>
import defaultAvatar from '~/assets/images/default-avatar.png'
const props = defineProps({
    initialAvatar: String // Только для существующих аватаров
})

const emit = defineEmits(['file-selected'])

const fileInput = ref(null)
const tempPreviewUrl = ref('') // Только для превью перед загрузкой
const previewUrl = ref(props.currentAvatar)

const triggerFileInput = () => fileInput.value.click()

const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    tempPreviewUrl.value = URL.createObjectURL(file)
    emit('file-selected', file)
}

// Очистка blob-ссылки
onBeforeUnmount(() => {
    if (tempPreviewUrl.value) {
        URL.revokeObjectURL(tempPreviewUrl.value)
    }
})
</script>

<style scoped>
.avatar-upload {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #e0e0e0;
    transition: all 0.3s ease;
}

.avatar-upload:hover {
    border-color: #3b82f6;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #f5f5f5;
}

.upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.avatar-upload:hover .upload-overlay {
    opacity: 1;
}

.upload-overlay svg {
    width: 32px;
    height: 32px;
}

.file-input {
    display: none;
}
</style>