import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    embeddings: 'src/embeddings/index.ts',
    caching: 'src/caching/index.ts',
    compression: 'src/compression/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    '@huggingface/transformers',
    'edgevec',
    '@mlc-ai/web-llm',
  ],
})
