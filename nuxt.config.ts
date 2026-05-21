export default defineNuxtConfig({
  compatibilityDate: '2026-04-29',

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  devtools: {
    enabled: true
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  nitro: {
    preset: 'node-server'
  },
  
  
})