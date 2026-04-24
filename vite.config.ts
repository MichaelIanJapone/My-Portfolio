import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const API_PORT = Number(process.env.API_PORT ?? 4000)

const contactApiProxy = {
  '/api': {
    target: `http://127.0.0.1:${API_PORT}`,
    changeOrigin: true,
  },
} as const

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: contactApiProxy,
  },
  // `vite preview` does not inherit dev proxy unless configured here.
  preview: {
    proxy: contactApiProxy,
  },
})
