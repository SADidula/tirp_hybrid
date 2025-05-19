import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname }
  },  
  server: {
    port: 5173,
    proxy: {
      "/predict": { target: "http://localhost:8000", changeOrigin: true },
      "/signup":  { target: "http://localhost:8000", changeOrigin: true },  
      "/login":   { target: "http://localhost:8000", changeOrigin: true },
      '/predict': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
})
