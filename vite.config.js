import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: { port: 8080, host: true },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        faq: resolve(__dirname, 'faq.html'),
        gold: resolve(__dirname, 'gold-challenge.html'),
      },
    },
  },
});
