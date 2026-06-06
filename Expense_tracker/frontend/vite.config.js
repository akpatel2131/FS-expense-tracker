import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Vite config: dev server runs on 5173 and proxies /api to the backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://fs-expense-tracker.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
