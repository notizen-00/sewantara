// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  devtools: { enabled: false },
  modules: ['@nuxt/image'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      meta: [
        { name: 'theme-color', content: '#e7194a' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
})
