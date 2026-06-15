import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Laravel API runs on http://127.0.0.1:8000 (php artisan serve).
// Proxying /api through Vite keeps requests same-origin in dev, so there
// are no CORS concerns and the TMDB token never leaves the backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
