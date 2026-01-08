/**
 * Plugin Registry System for Clarity Chat MCP Server
 *
 * Allows users to register and use any MCP server/plugin with this library,
 * making it highly extensible and customizable.
 *
 * @module plugins
 */
import { Tool, Resource, Prompt } from '@modelcontextprotocol/sdk/types.js';
/**
 * Plugin metadata for identification and display
 */
export interface PluginMetadata {
    /** Unique identifier for the plugin */
    id: string;
    /** Display name */
    name: string;
    /** Version string (semver) */
    version: string;
    /** Plugin description */
    description: string;
    /** Plugin author */
    author?: string;
    /** Homepage or documentation URL */
    homepage?: string;
    /** Repository URL */
    repository?: string;
    /** License identifier */
    license?: string;
    /** Keywords for search/discovery */
    keywords?: string[];
    /** Minimum MCP server version required */
    minServerVersion?: string;
    /** Plugin icon (emoji or URL) */
    icon?: string;
}
/**
 * Plugin lifecycle hooks
 */
export interface PluginLifecycle {
    /** Called when plugin is registered */
    onRegister?: () => void | Promise<void>;
    /** Called when plugin is enabled */
    onEnable?: () => void | Promise<void>;
    /** Called when plugin is disabled */
    onDisable?: () => void | Promise<void>;
    /** Called when plugin is unregistered */
    onUnregister?: () => void | Promise<void>;
    /** Called before a tool is executed */
    beforeToolCall?: (toolName: string, args: Record<string, unknown>) => Record<string, unknown> | Promise<Record<string, unknown>>;
    /** Called after a tool is executed */
    afterToolCall?: (toolName: string, result: unknown) => unknown | Promise<unknown>;
    /** Called when an error occurs */
    onError?: (error: Error, context: ErrorContext) => void | Promise<void>;
}
/**
 * Error context for plugin error handlers
 */
export interface ErrorContext {
    type: 'tool' | 'resource' | 'prompt' | 'lifecycle';
    name?: string;
    args?: Record<string, unknown>;
}
/**
 * Tool handler function type
 */
export type ToolHandler = (args: Record<string, unknown>) => Promise<unknown> | unknown;
/**
 * Resource handler function type
 */
export type ResourceHandler = () => Promise<string> | string;
/**
 * Prompt handler function type
 */
export type PromptHandler = (args: Record<string, string>) => Promise<string> | string;
/**
 * Plugin configuration options
 */
export interface PluginConfig {
    /** Enable/disable the plugin */
    enabled?: boolean;
    /** Plugin-specific configuration */
    settings?: Record<string, unknown>;
    /** Priority for tool/resource resolution (higher = first) */
    priority?: number;
}
/**
 * Complete plugin definition
 */
export interface Plugin {
    /** Plugin metadata */
    metadata: PluginMetadata;
    /** Tools provided by the plugin */
    tools?: Array<{
        definition: Tool;
        handler: ToolHandler;
    }>;
    /** Resources provided by the plugin */
    resources?: Array<{
        definition: Resource;
        handler: ResourceHandler;
    }>;
    /** Prompts provided by the plugin */
    prompts?: Array<{
        definition: Prompt;
        handler: PromptHandler;
    }>;
    /** Lifecycle hooks */
    lifecycle?: PluginLifecycle;
    /** Default configuration */
    defaultConfig?: PluginConfig;
}
/**
 * Registered plugin with runtime state
 */
interface RegisteredPlugin {
    plugin: Plugin;
    config: PluginConfig;
    state: 'registered' | 'enabled' | 'disabled' | 'error';
    registeredAt: Date;
    enabledAt?: Date;
    error?: Error;
}
/**
 * Plugin Registry - Manages all registered plugins
 */
declare class PluginRegistry {
    private plugins;
    private toolHandlers;
    private resourceHandlers;
    private promptHandlers;
    private events;
    private registrationQueue;
    /**
     * Register a new plugin
     */
    register(plugin: Plugin, config?: Partial<PluginConfig>): Promise<void>;
    /**
     * Enable a registered plugin
     */
    enable(pluginId: string): Promise<void>;
    /**
     * Disable a plugin
     */
    disable(pluginId: string): Promise<void>;
    /**
     * Unregister a plugin completely
     */
    unregister(pluginId: string): Promise<void>;
    /**
     * Get all registered tools (including from plugins)
     */
    getAllTools(): Tool[];
    /**
     * Get all registered resources (including from plugins)
     */
    getAllResources(): Resource[];
    /**
     * Get all registered prompts (including from plugins)
     */
    getAllPrompts(): Prompt[];
    /**
     * Get a tool handler by name
     */
    getToolHandler(name: string): ToolHandler | undefined;
    /**
     * Get a resource handler by URI
     */
    getResourceHandler(uri: string): ResourceHandler | undefined;
    /**
     * Get a prompt handler by name
     */
    getPromptHandler(name: string): PromptHandler | undefined;
    /**
     * Check if a tool exists (in core or plugins)
     */
    hasToolHandler(name: string): boolean;
    /**
     * Get plugin by ID
     */
    getPlugin(pluginId: string): RegisteredPlugin | undefined;
    /**
     * Get all registered plugins
     */
    getAllPlugins(): RegisteredPlugin[];
    /**
     * Get enabled plugins
     */
    getEnabledPlugins(): RegisteredPlugin[];
    /**
     * Search plugins by keyword
     */
    searchPlugins(query: string): RegisteredPlugin[];
    /**
     * Get plugin statistics
     */
    getStats(): {
        total: number;
        enabled: number;
        disabled: number;
        error: number;
        tools: number;
        resources: number;
        prompts: number;
    };
    /**
     * Subscribe to plugin events
     */
    on(event: 'plugin:registered' | 'plugin:enabled' | 'plugin:disabled' | 'plugin:unregistered', handler: (data: {
        pluginId: string;
        plugin: Plugin;
    }) => void): () => void;
    /**
     * Execute before-tool-call hooks for all enabled plugins
     */
    executeBeforeToolCallHooks(toolName: string, args: Record<string, unknown>): Promise<Record<string, unknown>>;
    /**
     * Execute after-tool-call hooks for all enabled plugins
     */
    executeAfterToolCallHooks(toolName: string, result: unknown): Promise<unknown>;
    /**
     * Clear all plugins (for testing)
     */
    clear(): void;
}
export declare const pluginRegistry: PluginRegistry;
/**
 * Helper class for building plugins with a fluent API
 */
export declare class PluginBuilder {
    private plugin;
    /**
     * Set plugin metadata
     */
    metadata(metadata: PluginMetadata): this;
    /**
     * Add a tool to the plugin
     */
    tool(definition: Tool, handler: ToolHandler): this;
    /**
     * Add a resource to the plugin
     */
    resource(definition: Resource, handler: ResourceHandler): this;
    /**
     * Add a prompt to the plugin
     */
    prompt(definition: Prompt, handler: PromptHandler): this;
    /**
     * Set lifecycle hooks
     */
    lifecycle(hooks: PluginLifecycle): this;
    /**
     * Set default configuration
     */
    defaultConfig(config: PluginConfig): this;
    /**
     * Build the plugin
     */
    build(): Plugin;
}
/**
 * Create a new plugin builder
 */
export declare function createPlugin(): PluginBuilder;
/**
 * Create a simple tool plugin
 */
export declare function createToolPlugin(id: string, name: string, description: string, tools: Array<{
    definition: Tool;
    handler: ToolHandler;
}>): Plugin;
/**
 * Create a simple resource plugin
 */
export declare function createResourcePlugin(id: string, name: string, description: string, resources: Array<{
    definition: Resource;
    handler: ResourceHandler;
}>): Plugin;
export {};
//# sourceMappingURL=index.d.ts.map