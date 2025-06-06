<template>
    <div class="layout-container">
        <div class="left column">
            <h1>Профиль Мастера</h1>

            <ul>
                <li>Размещать услуги</li>
                <li>Заполнять портфолио работами</li>
                <li>Удобный менеджмент исполняемых заказов</li>
                <li>Связываться с заказчиком</li>
            </ul>

            <NuxtLink to="/users/profile-create-master">
                <button class="btn btn-red" @click="chooseRole('master')">Создать профиль мастера</button>
            </NuxtLink>
        </div>
        <!-- <div class="divider"></div> -->
        <div class="right column">
            <h1>Профиль Заказчика</h1>

            <ul class="">
                <li>Заказывать услуги</li>
                <li>Связываться с мастером</li>
                <li>Ваши заказы будут видны только вам и мастеру гарантируя анонимность.</li>
                <li>Представлять как физическое лицо так и компанию</li>
            </ul>

            <NuxtLink to="/users/profile-create-customer">
                <button class="btn btn-red" @click="chooseRole('customer')">Создать профиль Заказчика</button>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['auth'] // Защищаем роут для авторизованных
});


const supabase = useSupabaseClient()
const profileStore = useProfileStore()

const chooseRole = async (role: 'master' | 'customer') => {
    try {
        console.log('Начало выбора роли:', role)

        // 1. Обновляем метаданные
        const { data: { user }, error } = await supabase.auth.updateUser({
            data: {
                current_role: role,
                current_profile_id: null
            }
        })

        if (error) throw error

        // 2. Принудительно обновляем сессию
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            await supabase.auth.setSession(session)
        }

        // 3. Проверяем что записалось
        const { data: { user: updatedUser } } = await supabase.auth.getUser()
        console.log('[choose role page] Обновленные метаданные:', updatedUser?.app_metadata)

        // 4. Сохраняем в хранилище
        profileStore.setTempRole(role)

        // 5. Перенаправляем
        await navigateTo(role === 'master'
            ? '/users/profile-create-master'
            : '/users/profile-create-customer'
        )

    } catch (error) {
        console.error('Ошибка выбора роли:', error)
    }
}

</script>

<style lang="scss" scoped>
.layout-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    padding-top: 80px;
}

.column {
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 15px;

    ul {
        text-align: left;
        // margin-bottom: 15px;
    }

    li {
        list-style-type: disc;
    }
}

.left {
    grid-column: 1 / 6;
    border-right: 1px grey solid;
}

.right {
    grid-column: 7 / 13;
}
</style>