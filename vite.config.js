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
    // Allows traffic from both the full Tailscale domain and the short 'vtc' hostname
    allowedHosts: ['vtc.tail054015.ts.net', 'vtc'], 
    proxy: {
      // Directus REST
      '/items': makeProxy(),
    }
  },
  preview: {
    host: true,
    port: 5000,
    // Allows traffic from both hostnames for preview builds
    allowedHosts: ['vtc.tail054015.ts.net', 'vtc'],
    proxy: {
      '/items': makeProxy(),
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
