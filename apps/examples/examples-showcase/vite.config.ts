import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'fs': path.resolve(__dirname, './src/stubs/fs.ts'),
      'fs/promises': path.resolve(__dirname, './src/stubs/fs-promises.ts'),
    },
  },
  // Stub out Node.js modules for browser
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  optimizeDeps: {
    include: [
      '@clarity-chat/react',
      '@clarity-chat/primitives',
      '@clarity-chat/token-optimization',
      '@clarity-chat/types',
      'flowtoken',
      'framer-motion',
      'lucide-react',
      'react',
      'react-dom',
      'zod',
    ],
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          clarity: ['@clarity-chat/react', '@clarity-chat/primitives'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})
