export default defineNuxtConfig({
  compatibilityDate: '2026-04-29',
  ssr: true,
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

  
  
})