import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: false,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: [
    '@dqbd/tiktoken',
    'crypto-js',
    '@tensorflow/tfjs'
  ],
  noExternal: [
    '@clarity-chat/types'
  ],
  target: 'es2020',
  platform: 'neutral',
  esbuildOptions: (options) => {
    options.drop = ['console', 'debugger']
  },
  banner: {
    js: `/**
 * Clarity Chat Token Optimization
 * Advanced token counting, compression, and optimization
 * @version ${process.env.npm_package_version || '1.0.0'}
 * @license MIT
 */`
  }
})