import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Note(Mehdi): Need this condition to be able to build
    ...(process.env.NODE_ENV === 'development' ? { global: 'window' } : {}),
    'process.env.NODE_DEBUG': JSON.stringify(''),
  },
  plugins: [react()],
  resolve: {
    alias: {
      titan_core: path.resolve(__dirname, '../../packages/titan_core/src'),
    },
  },
  build: {
    outDir: './dist',
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
