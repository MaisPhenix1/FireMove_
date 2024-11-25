import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
=======
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
>>>>>>> a11e5b7e1ab49f05e67cc399be2ff3ba592d64d7
});
