import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React development
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,  // Frontend runs on port 3000
    open: true,  // Automatically open browser
  },
})

