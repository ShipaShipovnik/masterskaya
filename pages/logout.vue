<template>
    <div class="layout-container">
        <form class="auth-form" @submit.prevent="logout">
            <h2 class="auth-form__title">Вы хотите выйти из аккаунта? :(</h2>

            <button type="submit" class="auth-form__btn btn" :disabled="isLoading">
                {{ isLoading ? 'Загрузка...' : 'Да' }}
            </button>
            <p class="auth-form__subtext text-muted">
                <NuxtLink to="/" no-prefetch class="auth-form__link ">
                   Нет не хочу.
                </NuxtLink>
            </p>

            <!-- Сообщения об ошибках/успехе -->
            <div class="auth-messages">
                <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
                <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
            </div>


        </form>
    </div>
</template>

<script setup>
const client = useSupabaseClient();

// сообщения
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function logout() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        successMsg.value = "Вы вышли"
        closeMenu()
        await navigateTo('/', { replace: true })
    } catch (error) {
        console.error('Ошибка выхода:', error)
    }
}
</script>

<style lang="scss" scoped>
.layout-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    padding-top: 80px;
}

.auth-messages {
    color: black;
}
</style>