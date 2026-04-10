/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages: set to '/<repo-name>/' when deploying
  // e.g., '/kids-flashcards/' — update this to match your repo name
  base: process.env.GITHUB_ACTIONS ? '/kids-flashcards/' : '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
