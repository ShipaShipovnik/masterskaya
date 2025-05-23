<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const props = defineProps({
    serviceId: {
        type: String,
        required: true
    }
})

const MAX_PHOTOS = 4
const photos = ref([])
const uploadProgress = ref(0)
const isUploading = ref(false)

// Загрузка уже прикрепленных фото
const loadExistingPhotos = async () => {
    const { data } = await supabase
        .storage
        .from('service_photos')
        .list(`${props.serviceId}/`)

    photos.value = data?.map(file => ({
        name: file.name,
        url: getPhotoUrl(file.name)
    })) || []
}

// Получение URL фото
const getPhotoUrl = (filename) => {
    return supabase
        .storage
        .from('service_photos')
        .getPublicUrl(`${props.serviceId}/${filename}`).data.publicUrl
}

// Обработка выбора файлов
const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)

    if (photos.value.length + files.length > MAX_PHOTOS) {
        alert(`Максимум ${MAX_PHOTOS} фото на услугу`)
        return
    }

    isUploading.value = true

    try {
        for (const file of files) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${props.serviceId}/${fileName}`

            const { error } = await supabase
                .storage
                .from('service_photos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type
                })

            if (error) throw error

            photos.value.push({
                name: fileName,
                url: getPhotoUrl(fileName)
            })
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error)
    } finally {
        isUploading.value = false
        uploadProgress.value = 0
    }
}

// Удаление фото
const removePhoto = async (index) => {
    const photo = photos.value[index]

    const { error } = await supabase
        .storage
        .from('service_photos')
        .remove([`${props.serviceId}/${photo.name}`])

    if (!error) {
        photos.value.splice(index, 1)
    }
}

// Инициализация
onMounted(() => {
    if (props.serviceId) {
        loadExistingPhotos()
    }
})
</script>

<template>
    <div class="photo-uploader">
        <div class="photos-grid">
            <div v-for="(photo, index) in photos" :key="photo.name" class="photo-item">
                <img :src="photo.url" alt="Фото услуги" class="photo-preview">
                <button @click="removePhoto(index)" class="remove-btn">×</button>
            </div>

            <label v-if="photos.length < MAX_PHOTOS" class="upload-label">
                <input type="file" accept="image/*" multiple @change="handleFileUpload" style="display: none;">
                <span>+ Добавить фото</span>
                <small>Макс. {{ MAX_PHOTOS - photos.length }} из {{ MAX_PHOTOS }}</small>
            </label>
        </div>

        <div v-if="isUploading" class="upload-progress">
            Загрузка: {{ uploadProgress }}%
        </div>
    </div>
</template>

<style scoped>
.photo-uploader {
    margin: 20px 0;
}

.photos-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.photo-item {
    position: relative;
    aspect-ratio: 1/1;
    border: 1px dashed #ccc;
    border-radius: 8px;
    overflow: hidden;
}

.photo-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #ff4444;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
}

.upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1/1;
    border: 1px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.upload-label:hover {
    border-color: #666;
    background: #f5f5f5;
}

.upload-progress {
    margin-top: 10px;
    color: #666;
}
</style>