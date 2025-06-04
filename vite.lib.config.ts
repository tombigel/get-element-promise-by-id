import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist/types',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GetElementPromiseById',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'es/index.js' : 'cjs/index.js',
    },
    outDir: 'dist',
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into your library
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
});
