import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'format/index': 'src/format/index.ts',
    'cache/index': 'src/cache/index.ts',
    'logger/index': 'src/logger/index.ts',
    'progress/index': 'src/progress/index.ts',
    'errors/index': 'src/errors/index.ts',
    'errors/base': 'src/errors/base.ts',
    'errors/api': 'src/errors/api.ts',
    'errors/config': 'src/errors/config.ts',
    'errors/validation': 'src/errors/validation.ts',
    'errors/cli': 'src/errors/cli.ts',
    'errors/utils': 'src/errors/utils.ts',
    'async/index': 'src/async/index.ts',
    'validation/index': 'src/validation/index.ts',
    'math/index': 'src/math/index.ts',
    'env/index': 'src/env/index.ts',
    // fs: 'src/fs.ts', // Removed - uses Node.js APIs not available in browser
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false, // Keep readable for debugging
})
