import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

dotenv.config();

export default defineConfig({
  define: { 'import.meta.vitest': false },
  plugins: [tsconfigPaths()],
  test: {
    env: { DATABASE_URL: process.env.TEST_DATABASE_URL ?? '' },
    setupFiles: ['tests/setup.ts'],
    includeSource: ['**/*.ts'],
    // include: ['**/index.test.ts'],
    poolOptions: { threads: { singleThread: true } },
    hookTimeout: 100000,
    testTimeout: 10000,
    coverage: {
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
      include: ['api/**/{controller,hooks,validators}.ts', 'domain/**'],
      exclude: ['domain/**/model/*Entity.ts'],
    },
  },
});
