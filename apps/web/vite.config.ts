import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  build: {
    target: 'es2023',
  },
  plugins: [react(), tsconfigPaths({ root: './' }), cloudflare()],
});
