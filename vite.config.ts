import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

icons: [
  {
    src: "/favicon.svg",
    sizes: "512x512",
    type: "image/svg+xml",
  },
]