// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxt/image', 'nuxt-svgo'],
  app:{
    head:{
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

})