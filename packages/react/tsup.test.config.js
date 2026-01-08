import { defineConfig } from 'tsup';
export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    sourcemap: false,
    minify: false,
    splitting: false,
    treeshake: false,
    clean: true,
    outDir: 'dist',
});
//# sourceMappingURL=tsup.test.config.js.map