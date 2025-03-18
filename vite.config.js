import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  root: 'public',  // Certifique-se de que o root é a raiz
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
});
