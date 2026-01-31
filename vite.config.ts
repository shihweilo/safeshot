import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'safeshot-wasm': path.resolve(__dirname, './src/rust-wasm/pkg/safeshot_wasm.js'),
    },
  },
  worker: {
    format: 'es',
    plugins: () => [wasm()],
  },
  optimizeDeps: {
    exclude: ['safeshot-wasm'],
  },
  build: {
    target: 'esnext',
  },
})
