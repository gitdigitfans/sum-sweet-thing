import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Mount the Express API onto the Vite dev server so /api/* works in the preview.
function expressApiPlugin() {
  return {
    name: 'express-api-middleware',
    configureServer(server) {
      const apiApp = require('./api/server.js');
      server.middlewares.use(apiApp);
    },
  };
}

export default defineConfig({
  server: { port: 8080, host: true },
  plugins: [expressApiPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        faq: resolve(__dirname, 'faq.html'),
        gold: resolve(__dirname, 'gold-challenge.html'),
        checkout: resolve(__dirname, 'checkout.html'),
      },
    },
  },
});
