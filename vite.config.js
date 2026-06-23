import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 Ajoutez cette ligne

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Ajoutez ceci dans la liste des plugins
  ],
  server: {
    host: true // Assure le partage sur le réseau local
  }
})