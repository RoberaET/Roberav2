import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Cache all built assets (JS, CSS chunks)
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2,ttf,mp3,m4a,mp4,webm}'],
        maximumFileSizeToCacheInBytes: 5000000, // 5MB limit to allow precaching honorable.m4a

        // Cache-first: serve from cache instantly, update in background
        runtimeCaching: [
          {
            // Google Fonts stylesheets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts webfonts
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Images and media from same origin
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|mp3|m4a|mp4|webm)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-media',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // All other same-origin requests (API, pages)
            urlPattern: ({ sameOrigin }) => sameOrigin,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'same-origin-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],

        // Skip waiting so the new SW activates immediately on next load
        skipWaiting: true,
        clientsClaim: true,
      },

      manifest: {
        name: 'Robera Mekonnen | Network Engineer',
        short_name: 'RoberaET',
        description: 'Portfolio of Robera Mekonnen - Enterprise Network Engineer',
        theme_color: '#0f1419',
        background_color: '#050a12',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/preview.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  build: {
    // Split vendor chunks for better cache reuse across updates
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          gsap: ['gsap', '@gsap/react'],
        },
      },
    },
    // Enable asset hashing for long-term caching
    assetsInlineLimit: 4096,
  },
})
