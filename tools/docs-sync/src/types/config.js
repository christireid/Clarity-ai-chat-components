/**
 * Configuration types for docs-sync
 */
/** Default configuration values */
export const DEFAULT_CONFIG = {
    version: 1,
    docsDir: 'apps/docs/content',
    apiDataDir: '.docs-sync/api-data',
    cacheDir: '.docs-sync/cache',
    templatesDir: 'tools/docs-sync/templates',
    baseUrl: '/docs',
    docsRelevantPatterns: [
        'packages/*/src/**/*.ts',
        'packages/*/src/**/*.tsx',
        '!packages/*/src/**/*.test.*',
        '!packages/*/src/**/*.spec.*',
        '!**/internal/**',
        '!**/__mocks__/**',
        '!**/__tests__/**',
    ],
    excludePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.next/**',
        '**/coverage/**',
    ],
    changelog: {
        outputPath: 'apps/docs/content/changelog',
        types: ['feat', 'fix', 'breaking', 'perf', 'refactor'],
        includeBreaking: true,
    },
    ci: {
        botName: 'github-actions[bot]',
        botEmail: 'github-actions[bot]@users.noreply.github.com',
        commitPrefix: 'docs: auto-update documentation',
        createPR: false,
    },
};
//# sourceMappingURL=config.js.map