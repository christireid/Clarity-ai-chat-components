/**
 * Plugin Manager
 *
 * Manage and orchestrate plugins for extensibility.
 */
import type { Plugin, PluginConfig, PluginManagerConfig } from './types';
export declare class PluginManager {
    private plugins;
    private config;
    private sharedState;
    private eventHandlers;
    constructor(config?: PluginManagerConfig);
    /**
     * Register a plugin
     */
    register(pluginConfig: PluginConfig): Promise<void>;
    /**
     * Unregister a plugin
     */
    unregister(name: string): Promise<void>;
    /**
     * Get plugin by name
     */
    getPlugin(name: string): Plugin | undefined;
    /**
     * Get all plugins
     */
    getAllPlugins(): Plugin[];
    /**
     * Enable a plugin
     */
    enable(name: string): Promise<void>;
    /**
     * Disable a plugin
     */
    disable(name: string): Promise<void>;
    /**
     * Call a hook across all enabled plugins
     */
    callHook<T = any>(hookName: string, ...args: any[]): Promise<T[]>;
    /**
     * Emit an event to plugins
     */
    emit(event: string, data: any): void;
    /**
     * Listen to plugin events
     */
    on(event: string, handler: (data: any) => void): () => void;
    /**
     * Get shared state
     */
    getState(): Record<string, any>;
    /**
     * Set shared state
     */
    setState(key: string, value: any): void;
    private initializePlugin;
    private generateId;
}
//# sourceMappingURL=plugin-manager.d.ts.map