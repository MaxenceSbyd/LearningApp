import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Base path for GitHub Pages: served at /LearningApp/
export default defineConfig({
  base: '/LearningApp/',
  plugins: [react(), tailwindcss()],
})
