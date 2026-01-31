// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
  ],

  experimental: {
    appManifest: false,
  },

  runtimeConfig: {
    turso: {
      databaseUrl: '',
      authToken: '',
    },
    session: {
      secret: '',
    },
    oauth: {
      google: {
        clientId: '',
        clientSecret: '',
      },
    },
  },
})
