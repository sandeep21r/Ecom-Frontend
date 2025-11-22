import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    tailwindcss(),
  ],
  server: {
    // Vite does not use `historyApiFallback`; SPA fallback is handled by the dev server automatically.
  }
})
