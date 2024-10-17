import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react-swc'


/** allow us to keep .js files as .js instead of .jsx */
const treatJsAsJsxPlugin = {
  name: 'treat-js-files-as-jsx',
  async transform(code, id) {
    if (!id.match(/src\/.*\.js$/)) return null;

    // Use the exposed transform from vite, instead of directly transforming with esbuild
    return transformWithEsbuild(code, id, {
      jsx: 'automatic',
      loader: 'jsx',
    });
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    treatJsAsJsxPlugin,
    react(),
  ],
  server: { open: true, port: 3000, }
});
