import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  define: { 'import.meta.vitest': false },
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ['tests/setup.ts'],
    includeSource: ['**/*.ts'],
    // include: ['**/index.test.ts'],
    threads: false,
    hookTimeout: 100000,
    testTimeout: 10000,
  },
});
