// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Backend API target – Directus (or your service) on LAN
const target = 'http://goatedcodoer:8091/'

const makeProxy = () => ({
  target,
  changeOrigin: true,
  secure: false,
  ws: false,
  rewrite: p => p, // keep path as-is
})

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5555,
    proxy: {
      // Directus REST
      '/items': makeProxy(),
      // Custom/compat REST endpoints used by api.js fallbacks
      '/api': makeProxy(),
      '/attendance': makeProxy(),
    }
  },
  preview: {
    host: true,
    port: 5000,
    proxy: {
      '/items': makeProxy(),
      '/api': makeProxy(),
      '/attendance': makeProxy(),
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
