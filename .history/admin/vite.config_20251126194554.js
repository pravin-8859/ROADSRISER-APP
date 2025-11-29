// admin/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],


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
