import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  base: '/get-element-promise-by-id/',
  build: {
    outDir: '../build',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
