import { defineConfig } from 'tsup';
export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false, // Keep readable for transparency
    external: ['react'],
    esbuildOptions(options) {
        options.banner = {
            js: '// @clarity-chat/license - License validation for Clarity Chat Pro',
        };
    },
});
//# sourceMappingURL=tsup.config.js.map