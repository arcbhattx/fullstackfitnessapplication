import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Enable fallback for SPA routing
  },
});