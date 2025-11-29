// admin/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";



export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // your backend
        changeOrigin: true,
      },
    },
  },
});
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
