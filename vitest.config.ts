import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: ['**/*.config.*', '**/*.d.ts'],
    },
    include: ['tests/**/*.{test,spec}.{js,ts}'],
  },
});
