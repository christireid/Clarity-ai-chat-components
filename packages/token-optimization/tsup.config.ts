import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react.ts',
    compression: 'src/compression/index.ts',
    cache: 'src/cache/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    '@dqbd/tiktoken',
    '@tensorflow/tfjs',
    'events', // Node.js built-in - consumers should polyfill for browser
  ],
  noExternal: ['@clarity-chat/types'],
  target: 'es2020',
  platform: 'neutral',
  esbuildOptions: (_options) => {
    // _options.drop = ['console', 'debugger']
  },
  banner: {
    js: `/**
 * Clarity Chat Token Optimization
 * Advanced token counting, compression, and optimization
 * @version ${process.env.npm_package_version || '1.0.0'}
 * @license MIT
 */`,
  },
})
