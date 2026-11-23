// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Backend API target – Directus (or your service) on LAN
  const target = env.VITE_API_BASE_URL || 'http://goatedcodoer:8090/'
  const devPort = Number(env.VITE_DEV_PORT || 5555)
  const previewPort = Number(env.VITE_PREVIEW_PORT || env.PORT || 5000)

  const makeProxy = () => ({
    target,
    changeOrigin: true,
    secure: false,
    ws: false,
    rewrite: p => p, // keep path as-is
  })

  return {
    plugins: [vue()],
    server: {
      host: true,
      port: devPort,
      // Allows traffic from both the full Tailscale domain and the short 'vtc' hostname
      allowedHosts: ['vtc.tail054015.ts.net', 'vtc'],
      proxy: {
        // Directus REST
        '/items': makeProxy(),
      },
    },
    preview: {
      host: true,
      port: previewPort,
      // Allows traffic from both hostnames for preview builds
      allowedHosts: ['vtc.tail054015.ts.net', 'vtc'],
      proxy: {
        '/items': makeProxy(),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})
