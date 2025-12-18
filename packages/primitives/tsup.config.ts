import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom', '@clarity-chat/utils', '@clarity-chat/utils/logger'],
  clean: true,
  sourcemap: true,
  minify: true,
  splitting: true,
  treeshake: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    }
  },
})
