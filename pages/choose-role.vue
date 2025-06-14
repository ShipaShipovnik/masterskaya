<template>
  <div class="page-grid-layout">
    <!-- Колонка Мастера -->
    <div class="left column">
      <h1>Профиль Мастера</h1>
      <ul>
        <li>Размещать услуги</li>
        <li>Заполнять портфолио работами</li>
        <li>Удобный менеджмент заказов</li>
        <li>Связываться с заказчиком</li>
      </ul>

      <button class="btn btn-red" @click="handleRoleSelect('master')" :disabled="profileStore.isLoading">
        {{ profileStore.isLoading ? 'Загрузка...' : 'Продолжить как Мастер' }}
      </button>
    </div>

    <!-- Колонка Заказчика -->
    <div class="right column">
      <h1>Профиль Заказчика</h1>
      <ul>
        <li>Заказывать услуги</li>
        <li>Связываться с мастером</li>
        <li>Конфиденциальность заказов</li>
        <li>Для физлиц и компаний</li>
      </ul>

      <button class="btn btn-red" @click="handleRoleSelect('customer')" :disabled="profileStore.isLoading">
        {{ profileStore.isLoading ? 'Загрузка...' : 'Продолжить как Заказчик' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const supabase = useSupabaseClient()
const profileStore = useProfileStore()
const router = useRouter()

const handleRoleSelect = async (role: 'master' | 'customer') => {
  try {
    console.log(`[handleRoleSelect] Выбор роли: ${role}`);

    // 1. Обновляем роль в JWT claims
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        current_role: role,
      }
    });
    
    if (updateError) throw updateError;

    // 2. Проверяем наличие профиля
    const profileExists = await profileStore.checkProfile(role);
    console.log(`[handleRoleSelect] Профиль существует:`, profileExists);

    if (profileExists) {
      // 3. Если профиль есть - загружаем его
      await profileStore.loadProfile();
      await navigateTo('/');
    } else {
      // 4. Если нет - переходим к созданию
      await navigateTo(`/users/profile-create-${role}`);
    }

  } catch (error) {
    console.error('[handleRoleSelect] Ошибка:', error);
  }
};
</script>

<style lang="scss" scoped>
.page-grid-layout {
  margin-top: 100px;
}

.column {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 15px;
  padding: 30px 30px;

  border-radius: 5px;
  background: white;

  ul {
    text-align: left;
    // margin-bottom: 15px;
    flex-grow: 1;
    padding-left: 15px;
    margin-bottom: 20px;
  }

  li {
    list-style-type: disc;
  }

  // outline: grey 1px solid;

  transition: all 0.3s ease,
  box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);

  }
}



.left {
  text-align: center;
  grid-column: 2 / 7;
  // border-right: 1px grey solid;
}

.right {
  grid-column: 7 / 12;
}
</style>