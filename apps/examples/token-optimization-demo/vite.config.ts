import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      root: '../../..',
      projects: ['./tsconfig.json', '../../../packages/react/tsconfig.json'],
    }),
  ],
  resolve: {
    // Let Vite preserve symlinks for pnpm workspaces
    preserveSymlinks: false,
  },
})