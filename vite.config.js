import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    minify: 'esbuild',  // Use esbuild instead of terser (faster and built-in)
    sourcemap: false,  // Don't ship source maps to production
    rollupOptions: {
      output: {
        // Code splitting strategy for better caching
        manualChunks: {
          // Vendor libraries in their own chunk
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom'
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
})
