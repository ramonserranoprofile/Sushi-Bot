import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                   // global functions test(), expect()
    environment: 'jsdom',             // Configuration to test Browser environment
    setupFiles: './tests/setup.ts' // configuration files (optional)
  },
});


