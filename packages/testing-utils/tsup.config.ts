import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@clarity-chat/primitives',
    '@clarity-chat/react'
  ],
})
