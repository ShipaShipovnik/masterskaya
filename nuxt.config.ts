// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.scss'],
  // debug: true,
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-svgo',
    '@nuxtjs/supabase',
  ],
  app: {
    head: {
      title: 'MASTERSKAYA'
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_variables.scss" as *;',
        },
      },
    },
  },
  supabase: {
    redirect: false,
  }
})