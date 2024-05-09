import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  define: { 'import.meta.vitest': false },
  plugins: [tsconfigPaths()],
  test: {
    exclude: ['node_modules', 'server', 'out'],
  },
});
