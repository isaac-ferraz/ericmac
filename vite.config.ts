import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  base: './',
  plugins: [react(), imagetools()],
  build: { target: 'es2022', assetsInlineLimit: 0 },
})
