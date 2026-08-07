import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://images.unsplash.com' },
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
      ],
    },
  },

  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'https://api.sewantara.id',
    apiToken: process.env.NUXT_API_TOKEN || '',
    apiEndpoints: {
      tenant: process.env.NUXT_API_TENANT_ENDPOINT || '/v1/public/tenant',
      home: process.env.NUXT_API_HOME_ENDPOINT || '/v1/public/home',
      catalog: process.env.NUXT_API_CATALOG_ENDPOINT || '/v1/public/catalog',
      quote: process.env.NUXT_API_QUOTE_ENDPOINT || '/v1/public/bookings/quote',
      bookings: process.env.NUXT_API_BOOKINGS_ENDPOINT || '/v1/public/bookings',
      tracking: process.env.NUXT_API_TRACKING_ENDPOINT || '/v1/public/bookings',
      blog: process.env.NUXT_API_BLOG_ENDPOINT || '/v1/public/blog',
    },
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Sewantara',
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://sewantara.id',
      baseDomain: process.env.NUXT_PUBLIC_BASE_DOMAIN || 'sewantara.id',
      cdn: process.env.NUXT_PUBLIC_CDN || '',
      demoMode: process.env.NUXT_PUBLIC_DEMO_MODE !== 'false',
      demoTenant: process.env.NUXT_PUBLIC_DEMO_TENANT || 'kamerajember',
    },
  },

  image: {
    domains: ['images.unsplash.com'],
    format: ['webp'],
    quality: 82,
  },

  nitro: {
    compressPublicAssets: true,
  },

  routeRules: {
    '/api/booking/**': { cache: false },
    '/api/public/availability/**': { cache: false },
    '/api/public/tracking/**': { cache: false },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
