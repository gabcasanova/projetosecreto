import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import musicLibrary from './vite-plugins/music-library.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), musicLibrary()],
})
