<template>
    <div class="photo-uploader">
        <!-- <label v-if="label">{{ label }}</label> -->
        <div class="dropzone" @dragenter.prevent="setActive" @dragleave.prevent="setInactive" @dragover.prevent
            @drop.prevent="handleDrop" :class="{ 'active-dropzone': isActive, 'has-error': error }">

            <div class="dropzone-content">
                <span>Перетащите сюда фото (от 4 до 10 файлов)</span>
                <span>ИЛИ</span>
                <label for="fileInput" class="browse-button">Выбрать фото</label>
                <input type="file" id="fileInput" ref="fileInput" @change="handleFileSelect" accept="image/*"
                    multiple />
            </div>

            <div class="preview-grid" v-if="previewUrls.length">
                <div v-for="(url, index) in previewUrls" :key="index" class="preview-item">
                    <img :src="url" class="preview-image">
                    <button @click="removeFile(index)" class="remove-button">
                        &times;
                    </button>
                </div>
            </div>

            <div v-if="error" class="error-message">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    // label: String,
    maxFiles: {
        type: Number,
        default: 10
    },
    initialFiles: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:files'])

const isActive = ref(false)
const error = ref('')
const fileInput = ref(null)
const uploadedFiles = ref<File[]>([]) // Храним File объекты
const previewUrls = ref<string[]>([]) // Храним blob URLs для превью


// Инициализация начальных файлов
if (props.initialFiles.length) {
    previewUrls.value = [...props.initialFiles]
}

const setActive = () => {
    isActive.value = true
}

const setInactive = () => {
    isActive.value = false
}

const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
    e.target.value = '' // Сброс input
}

// проверка и валидация файлов
const processFiles = (files) => {
    if (files.length + uploadedFiles.value.length > props.maxFiles) {
        error.value = `Максимум ${props.maxFiles} файлов`
        return
    }

    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            error.value = 'Только изображения (JPEG, PNG)'
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            error.value = 'Файл слишком большой (макс. 5MB)'
            return
        }

        previewUrls.value.push(URL.createObjectURL(file))
        uploadedFiles.value.push(file)
    })

    emitFilesUpdate()
    console.log('[PhotoUploader] Текущие файлы:', uploadedFiles.value.map(f => f.name));
    error.value = ''
}


const removeFile = (index) => {
    console.log('[PhotoUploader] Удаление файла:', previewUrls.value[index]);
    URL.revokeObjectURL(previewUrls.value[index]);
    previewUrls.value.splice(index, 1);
    uploadedFiles.value.splice(index, 1);
    emitFilesUpdate();
    console.log('[PhotoUploader] Оставшиеся файлы:', uploadedFiles.value.map(f => f.name));
}

const emitFilesUpdate = () => {
    emit('update:files', [...uploadedFiles.value])
}

onBeforeUnmount(() => {
    previewUrls.value.forEach(url => URL.revokeObjectURL(url))
})
</script>

<style scoped lang="scss">
.photo-uploader {
    width: 100%;
    margin-bottom: 1rem;
}

.dropzone {
    width: 100%;
    min-height: 200px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    border: 2px dashed $red;
    background-color: #f8fafc;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.active-dropzone {
    border-color: #1d4ed8;
    background-color: #dbeafe;
}

.has-error {
    border-color: #ef4444;
}

.dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.browse-button {
    padding: 8px 16px;
    color: white;
    background-color: #3b82f6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.browse-button:hover {
    background-color: #2563eb;
}

input[type="file"] {
    display: none;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    width: 100%;
    margin-top: 15px;
}

.preview-item {
    position: relative;
    aspect-ratio: 1;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
}

.remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 20px;
    height: 20px;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
}

.error-message {
    color: #ef4444;
    margin-top: 10px;
    font-size: 14px;
}
</style>