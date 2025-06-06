<template>
    <form @submit.prevent="createProfile" class="profile-create__form">
        <div class="profile-create__input-group">
            <label>Аватар:</label>
            <p class="profile-create__input-subtext">Не больше мб.</p>
            <input type="file" class="default-input" id="">
        </div>
        <!-- публичное имя -->
        <div class="profile-create__input-group">
            <label>Публичное имя:</label>
            <p class="profile-create__input-subtext">Данное имя будет отображаться в вашем профиле.</p>
            <input type="text" class="default-input" v-model="form.public_name">
        </div>
        <div class="profile-create__input-group">
            <label>Юзернейм:</label>
            <p class="profile-create__input-subtext">Данное имя будет служить в качестве ссылки на ваш профиль.
            </p>
            <input type="text" class="default-input" v-model="form.username" required>
        </div>
        <div class="profile-create__input-group">
            <label>Спелизация:</label>
            <p class="profile-create__input-subtext">Опишите в чем вы специализируетесь.
            </p>
            <input type="text" class="default-input" v-model="form.job" required>
        </div>
        <div class="profile-create__input-group">
            <label>Описание профиля:</label>
            <p class="profile-create__input-subtext">Кратко опишите себя и чем вы занимаетесь.</p>
            <textarea v-model="form.description" class="default-textarea"></textarea>
        </div>

        <!-- контакты -->
        <div class="input-group">
            <label>Контакты профиля:</label>
            <p class="profile-create__input-subtext">Будут отображаться в вкладке "Обо мне" в вашем профиле.</p>

            <div class="input-group">
                <label>Telegram:</label>
                <input type="text" class="default-input" v-model="form.contacts.telegram">
            </div>
            <div class="input-group">
                <label>ВКонтакте:</label>
                <input type="text" class="default-input" v-model="form.contacts.vkontakte">
            </div>
            <div class="input-group">
                <label>Одноклассники:</label>
                <input type="text" class="default-input" v-model="form.contacts.odnoklassniki">
            </div>
        </div>

        <button class="btn btn-red">Создать профиль Мастера</button>
    </form>
</template>
<!-- TODO: реактивная проверка на никнейм в реальном времени времени -->
<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
});

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const profileStore = useProfileStore()
const router = useRouter()

const errorMsg = ref("")
const isLoading = ref(false)

// Форма профиля
const form = ref({
    public_name: '',
    username: '',
    description: '',
    job: '',
    contacts: {
        telegram: '',
        vkontakte: '',
        odnoklassniki: ''
    }
})

// Создание профиля
const createProfile = async () => {
  try {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    
    // Проверяем роль в JWT
    const currentRole = user.value?.user_metadata?.current_role
    if (currentRole !== 'master') {
      throw new Error('в jwt user_metadata роль не мастер')
    }

    //Создаем профиль
    const { data: profile, error } = await supabase
      .from('master_profiles')
      .insert({
        user_id: user.value.id,
        ...form.value
      })
      .select()
      .single()

    if (error) throw error

    //Обновляем JWT с ID профиля
    await supabase.auth.updateUser({
      data: { current_profile_id: profile.id }
    })

    await navigateTo(`/users/master/${profile.username}`)

  } catch (err) {
    console.error('Ошибка создания профиля:', err.message)
    // Перенаправляем на выбор роли при ошибке
    if (err.message.includes('выберите роль')) {
      await navigateTo('/profile-choose')
    }
  }
}
</script>


<style lang="scss" scoped>
.profile-create__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    background-color: white;
    padding: 15px;
}

.profile-create__input-subtext {
    color: rgb(0, 0, 0, 50%);
    font-size: 12px;
}
</style>