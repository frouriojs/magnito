import { defineConfig } from 'vite';

export default defineConfig({
  define: { 'import.meta.vitest': false },
  test: {
    exclude: ['node_modules', 'server', 'out'],
  },
});
