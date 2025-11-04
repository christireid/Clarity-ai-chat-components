/**
 * Plugin Manager
 *
 * Manage and orchestrate plugins for extensibility.
 */
export class PluginManager {
    constructor(config) {
        this.plugins = new Map();
        this.sharedState = {};
        this.eventHandlers = new Map();
        this.config = {
            autoInitialize: config?.autoInitialize ?? true,
            sharedContext: config?.sharedContext ?? {},
        };
        this.sharedState = { ...this.config.sharedContext };
    }
    /**
     * Register a plugin
     */
    async register(pluginConfig) {
        const plugin = pluginConfig.plugin;
        // Check dependencies
        if (plugin.dependencies) {
            for (const dep of plugin.dependencies) {
                if (!this.plugins.has(dep)) {
                    throw new Error(`Plugin ${plugin.name} requires ${dep} which is not registered`);
                }
            }
        }
        // Register plugin
        this.plugins.set(plugin.name, {
            ...pluginConfig,
            enabled: pluginConfig.enabled ?? true,
            priority: pluginConfig.priority ?? 100,
        });
        // Initialize if auto-initialize is enabled
        if (this.config.autoInitialize && pluginConfig.enabled !== false) {
            await this.initializePlugin(plugin, pluginConfig.config);
        }
    }
    /**
     * Unregister a plugin
     */
    async unregister(name) {
        const config = this.plugins.get(name);
        if (!config)
            return;
        // Cleanup
        if (config.plugin.cleanup) {
            await config.plugin.cleanup();
        }
        this.plugins.delete(name);
    }
    /**
     * Get plugin by name
     */
    getPlugin(name) {
        return this.plugins.get(name)?.plugin;
    }
    /**
     * Get all plugins
     */
    getAllPlugins() {
        return Array.from(this.plugins.values())
            .sort((a, b) => (a.priority || 100) - (b.priority || 100))
            .map((c) => c.plugin);
    }
    /**
     * Enable a plugin
     */
    async enable(name) {
        const config = this.plugins.get(name);
        if (!config)
            throw new Error(`Plugin ${name} not found`);
        config.enabled = true;
        await this.initializePlugin(config.plugin, config.config);
    }
    /**
     * Disable a plugin
     */
    async disable(name) {
        const config = this.plugins.get(name);
        if (!config)
            throw new Error(`Plugin ${name} not found`);
        config.enabled = false;
        if (config.plugin.cleanup) {
            await config.plugin.cleanup();
        }
    }
    /**
     * Call a hook across all enabled plugins
     */
    async callHook(hookName, ...args) {
        const results = [];
        const configs = Array.from(this.plugins.values());
        for (const config of configs) {
            if (!config.enabled)
                continue;
            const hook = config.plugin.hooks?.[hookName];
            if (hook) {
                try {
                    const result = await hook(...args);
                    if (result !== undefined) {
                        results.push(result);
                    }
                }
                catch (error) {
                    console.error(`Plugin ${config.plugin.name} hook ${hookName} failed:`, error);
                }
            }
        }
        return results;
    }
    /**
     * Emit an event to plugins
     */
    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach((handler) => {
                try {
                    handler(data);
                }
                catch (error) {
                    console.error(`Event handler for ${event} failed:`, error);
                }
            });
        }
    }
    /**
     * Listen to plugin events
     */
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event).add(handler);
        // Return unsubscribe function
        return () => {
            this.eventHandlers.get(event)?.delete(handler);
        };
    }
    /**
     * Get shared state
     */
    getState() {
        return { ...this.sharedState };
    }
    /**
     * Set shared state
     */
    setState(key, value) {
        this.sharedState[key] = value;
    }
    async initializePlugin(plugin, config) {
        if (!plugin.initialize)
            return;
        const context = {
            manager: this,
            config: config || {},
            state: this.sharedState,
            emit: (event, data) => this.emit(event, data),
            log: (message, level = 'info') => {
                console.log(`[Plugin:${plugin.name}] [${level}]`, message);
            },
        };
        await plugin.initialize(context);
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }
}
//# sourceMappingURL=plugin-manager.js.map