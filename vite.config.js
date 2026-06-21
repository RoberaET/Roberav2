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
