import { defineConfig } from 'vite';

export default defineConfig({
  define: { 'import.meta.vitest': false },
  test: {
    includeSource: ['src/**/*.{ts,tsx}'],
    exclude: ['node_modules', 'server', 'out'],
  },
});
