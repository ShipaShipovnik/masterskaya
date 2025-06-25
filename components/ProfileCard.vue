<template>
    <div class="profile-card" @click="navigateToProfile">
        <div class="profile-avatar">
            <img :src="profile.avatar_url || defaultAvatar" :alt="profile.username" class="avatar-image" />
        </div>
        <div class="profile-info">
            <h3 class="profile-name">{{ profile.public_name }}</h3>
            <p class="profile-specialization">{{ profile.job }}</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    profile: {
        type: Object,
        required: true,
    }
});
import defaultAvatar from '@/assets/images/default-avatar.png'

const navigateToProfile = () => {
    navigateTo(`users/master/${props.profile.username}`);
};
</script>

<style scoped>
.profile-card {
    border: 1px solid #eaeaea;
    border-radius: 8px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.profile-card:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
}

.profile-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 12px;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-name {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
}

.profile-specialization {
    margin: 4px 0 0;
    font-size: 0.9rem;
    color: #666;
}
</style>