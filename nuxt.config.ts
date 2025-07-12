// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3011',
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt', 'nuxt-swiper'],
  css: [
    '~/assets/css/app.css',
    '~/assets/css/tailwind.css',
    'swiper/css', 'swiper/css/mousewheel',
  ],
  plugins: ['~/plugins/lucide.ts', '~/plugins/api-fetch.ts'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
