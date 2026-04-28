import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/graphql': {
        target: 'https://leetcode.com/graphql',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/graphql/, '')
      },
      '/api/hackerrank': {
        target: 'https://www.hackerrank.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hackerrank/, '')
      },
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
