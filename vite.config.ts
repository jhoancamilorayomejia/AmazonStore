import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // acceso desde otras PCs
    port: 3000       // 🚀 cambia a otro puerto que no sea 8080
  }
})
