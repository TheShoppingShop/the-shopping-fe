// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'The Shopping – Watch, Discover & Shop Trending Amazon Products',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        // Basic SEO
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Discover trending Amazon products through engaging short videos. Watch reviews, see real-life demos, and shop instantly with our affiliate links – tailored for US shoppers.'
        },
        {
          name: 'keywords',
          content:
            'amazon trending products, amazon deals, amazon finds, video reviews, online shopping USA, best amazon products, amazon gadgets, product unboxing, affiliate marketing, product discovery'
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'The Shopping' },

        { 'http-equiv': 'Content-Language', content: 'en_US' },
        { name: 'geo.region', content: 'US' },
        { name: 'geo.placename', content: 'United States' },
        { name: 'geo.position', content: '37.0902;-95.7129' },
        { name: 'ICBM', content: '37.0902, -95.7129' },

        // Open Graph / Facebook
        { property: 'og:title', content: 'The Shopping – Watch, Discover & Shop Trending Amazon Products' },
        {
          property: 'og:description',
          content:
            'Watch short videos of trending Amazon products, discover reviews, and shop directly – perfect for US customers.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://theshopping.shop' },
        { property: 'og:image', content: 'https://theshopping.shop/og-image.png' },
        { property: 'og:site_name', content: 'The Shopping' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'The Shopping – Watch, Discover & Shop Trending Amazon Products' },
        {
          name: 'twitter:description',
          content:
            'Discover and shop trending Amazon products through short, engaging videos. Perfect for US online shoppers.'
        },
        { name: 'twitter:image', content: 'https://theshopping.shop/og-image.png' },
        { name: 'twitter:site', content: '@TheShopping' },

        // Additional SEO
        { name: 'theme-color', content: '#ffffff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
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
