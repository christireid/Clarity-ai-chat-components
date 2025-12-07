import { defineConfig } from 'tsup';
export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: false, // Types don't need sourcemaps
    clean: true,
    treeshake: false, // Don't tree-shake types
    minify: false,
    // For types-only packages, we need to ensure proper exports
    esbuildOptions(options) {
        options.keepNames = true;
    },
});
//# sourceMappingURL=tsup.config.js.map