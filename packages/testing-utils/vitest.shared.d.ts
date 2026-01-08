/**
 * Shared test configuration with memory-optimized settings
 */
export declare const sharedConfig: import("vite").UserConfig & Promise<import("vite").UserConfig> & (import("vitest/config").ViteUserConfigFnObject & (import("vitest/config").ViteUserConfigFnPromise & import("vitest/config").ViteUserConfigExport));
/**
 * Node environment configuration for non-UI packages
 */
export declare const nodeConfig: import("vite").UserConfig;
/**
 * Happy-DOM configuration for React components
 */
export declare const happyDomConfig: import("vite").UserConfig;
export default sharedConfig;
//# sourceMappingURL=vitest.shared.d.ts.map