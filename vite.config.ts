import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// reemplaza `PackingList` por el nombre exacto de tu repo
export default defineConfig({
  plugins: [react()],
  base: '/PackingList/',
})

