import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Note(Mehdi): Need this condition to be able to build
    ...(process.env.NODE_ENV === 'development' ? { global: 'window' } : {}),
    'process.env.NODE_DEBUG': JSON.stringify(''),
  },
  plugins: [react()],
  optimizeDeps: {
    include: [
      './../../packages/titan_core/src',
      './../../packages/titan_core/dist',
    ],
  },
  build: {
    outDir: './dist',
    commonjsOptions: {
      include: [/titan_core/, /node_modules/],
    },
  },
});
