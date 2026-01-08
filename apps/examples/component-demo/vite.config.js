import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Stub out Node.js modules for browser builds
            'fs/promises': path.resolve(__dirname, './src/stubs/empty.ts'),
            fs: path.resolve(__dirname, './src/stubs/empty.ts'),
            crypto: path.resolve(__dirname, './src/stubs/empty.ts'),
        },
    },
    server: {
        port: 5173,
        open: true,
    },
    build: {
        rollupOptions: {
            // Externalize Node.js built-in modules
            external: ['node:process', 'node:fs', 'node:crypto', 'node:path'],
        },
    },
    optimizeDeps: {
        // Exclude packages that have Node.js dependencies
        exclude: ['ora', 'cli-cursor', 'stdin-discarder', 'restore-cursor'],
    },
});
//# sourceMappingURL=vite.config.js.map