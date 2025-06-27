import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'serviceworker.js',
      //injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/*.png'],
      manifestFilename: 'manifest.json',
      workbox: {
        runtimeCaching: [],
        globPatterns: []
      },
      manifest: {
        "name": "허미버스",
        "short_name": "허미버스",
        "description": "매일 새로운 상식을 배워보세요",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#ffffff",
        "orientation": "portrait",
        "icons": [
          {
            "src": "/icons/icon-72.png",
            "sizes": "72x72",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/icons/icon-96.png",
            "sizes": "96x96",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/icons/icon-128.png",
            "sizes": "128x128",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/icons/icon-144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/icons/icon-152.png",
            "sizes": "152x152",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
          },
          {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
          }
        ]
      }
    })
  ]
})