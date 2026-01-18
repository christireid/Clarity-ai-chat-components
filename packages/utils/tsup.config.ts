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
    fs: 'src/fs.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false, // Disabled to fix re-export issues with main index
  sourcemap: true,
  clean: true,
  treeshake: false, // Disabled to ensure all exports are available
  minify: false, // Keep readable for debugging
  // Bundle internal imports (submodule re-exports) into main index
  bundle: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    }
  },
})
