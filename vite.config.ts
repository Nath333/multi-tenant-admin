import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ant-design': ['antd', '@ant-design/icons', '@ant-design/pro-components'],
          'charts': ['recharts'],
          'state-management': ['zustand'],
          'i18n': ['i18next', 'react-i18next'],
          'utilities': ['dayjs', 'react-grid-layout'],
        },
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable minification (use esbuild for faster builds, or 'terser' for better compression)
    minify: 'esbuild',
    // Source maps for production debugging (can be disabled for smaller builds)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'recharts',
      'zustand',
    ],
  },
})
