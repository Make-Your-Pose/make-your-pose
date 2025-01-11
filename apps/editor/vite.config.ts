import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: 'es2023',
  },
  plugins: [tsconfigPaths({ root: './' }), react()],
});
