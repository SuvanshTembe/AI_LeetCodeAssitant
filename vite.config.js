import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  build: {
    outDir: './server/public',
    emptyOutDir: true
  },
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
})
