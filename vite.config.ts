import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window'
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://zaferuni.liara.run',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    sourcemap: true
  }
})
