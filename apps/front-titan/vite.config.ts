import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      titan_core: path.resolve(__dirname, "../../packages/titan_core/src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  server: {
    port: 5174,
  },
  build: {
    outDir: "./dist",
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});
