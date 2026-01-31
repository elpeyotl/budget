// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    'nuxt-auth-utils',
    '@vite-pwa/nuxt',
  ],

  experimental: {
    appManifest: false,
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Haushalts-Finanz-App',
      short_name: 'Finanzen',
      description: 'Budget, Vermögen und Sparziele gemeinsam verwalten.',
      theme_color: '#1f2937',
      background_color: '#111827',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'de-CH',
      icons: [
        {
          src: 'pwa-192x192.svg',
          sizes: '192x192',
          type: 'image/svg+xml',
          purpose: 'any',
        },
        {
          src: 'pwa-512x512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'any',
        },
        {
          src: 'pwa-512x512.svg',
          sizes: '512x512',
          type: 'image/svg+xml',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.googleusercontent\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-avatars',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 7 },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
    },
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
