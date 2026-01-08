/**
 * Plugin Registry System for Clarity Chat MCP Server
 *
 * Allows users to register and use any MCP server/plugin with this library,
 * making it highly extensible and customizable.
 *
 * @module plugins
 */
import { Tool, Resource, Prompt } from '@modelcontextprotocol/sdk/types.js';
import { logger } from '../utils/logger.js';
import { ValidationError } from '../utils/errors.js';
import { EventEmitter } from '../utils/events.js';
import { z } from 'zod';
// =============================================================================
// Plugin Lifecycle Timeout Configuration
// =============================================================================
/** Timeout for plugin lifecycle hooks (in ms) */
const LIFECYCLE_HOOK_TIMEOUT_MS = parseInt(process.env.MCP_PLUGIN_HOOK_TIMEOUT || '5000', 10);
/**
 * Execute a lifecycle hook with timeout protection
 */
async function withLifecycleTimeout(hook, hookName, pluginId) {
    if (!hook)
        return;
    try {
        await Promise.race([
            Promise.resolve(hook()),
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Plugin ${hookName} hook timed out after ${LIFECYCLE_HOOK_TIMEOUT_MS}ms`)), LIFECYCLE_HOOK_TIMEOUT_MS)),
        ]);
    }
    catch (error) {
        logger.error(`Plugin ${hookName} hook failed: ${pluginId}`, error instanceof Error ? error : undefined);
        // Don't re-throw - log and continue for lifecycle hooks
    }
}
// =============================================================================
// Plugin Validation Schemas
// =============================================================================
const PluginMetadataSchema = z.object({
    id: z
        .string()
        .min(1)
        .max(100)
        .regex(/^[a-z0-9-]+$/, 'Plugin ID must be lowercase alphanumeric with hyphens'),
    name: z.string().min(1).max(200),
    version: z.string().regex(/^\d+\.\d+\.\d+/, 'Version must be semver format'),
    description: z.string().min(1).max(1000),
    author: z.string().max(200).optional(),
    homepage: z.string().url().optional(),
    repository: z.string().url().optional(),
    license: z.string().max(50).optional(),
    keywords: z.array(z.string().max(50)).max(20).optional(),
    minServerVersion: z.string().optional(),
    icon: z.string().max(200).optional(),
});
// =============================================================================
// Plugin Registry Configuration
// =============================================================================
const PLUGIN_LIMITS = {
    /** Maximum number of plugins that can be registered */
    maxPlugins: 50,
    /** Maximum number of tools per plugin */
    maxToolsPerPlugin: 20,
    /** Maximum number of resources per plugin */
    maxResourcesPerPlugin: 20,
    /** Maximum number of prompts per plugin */
    maxPromptsPerPlugin: 20,
    /** Maximum length for tool/resource/prompt names */
    maxNameLength: 100,
    /** Reserved name prefixes (cannot be used by plugins) */
    reservedPrefixes: ['clarity_', 'mcp_', 'system_', 'internal_'],
};
/**
 * Sanitize a string to prevent injection attacks
 */
function sanitizeName(name) {
    // Remove control characters and limit length
    return name
        .replace(/[\x00-\x1F\x7F]/g, '') // eslint-disable-line no-control-regex
        .slice(0, PLUGIN_LIMITS.maxNameLength)
        .trim();
}
/**
 * Validate a tool/resource/prompt name
 */
function validateItemName(name, type) {
    const sanitized = sanitizeName(name);
    if (!sanitized || sanitized.length === 0) {
        throw new ValidationError(`${type} name cannot be empty`);
    }
    if (sanitized.length > PLUGIN_LIMITS.maxNameLength) {
        throw new ValidationError(`${type} name exceeds maximum length of ${PLUGIN_LIMITS.maxNameLength}`);
    }
    // Check for reserved prefixes
    for (const prefix of PLUGIN_LIMITS.reservedPrefixes) {
        if (sanitized.toLowerCase().startsWith(prefix)) {
            throw new ValidationError(`${type} name cannot start with reserved prefix "${prefix}"`);
        }
    }
}
// =============================================================================
// Plugin Registry
// =============================================================================
/**
 * Plugin Registry - Manages all registered plugins
 */
class PluginRegistry {
    plugins = new Map();
    toolHandlers = new Map();
    resourceHandlers = new Map();
    promptHandlers = new Map();
    events = new EventEmitter();
    registrationQueue = Promise.resolve();
    /**
     * Register a new plugin
     */
    async register(plugin, config) {
        // Chain registrations to prevent race conditions
        const previousRegistration = this.registrationQueue;
        let resolveRegistration = () => { };
        this.registrationQueue = new Promise((resolve) => {
            resolveRegistration = resolve;
        });
        // Wait for any previous registration to complete
        await previousRegistration;
        try {
            // Check plugin limit
            if (this.plugins.size >= PLUGIN_LIMITS.maxPlugins) {
                throw new ValidationError(`Maximum number of plugins (${PLUGIN_LIMITS.maxPlugins}) reached`, { currentCount: this.plugins.size });
            }
            // Validate metadata
            const metadataResult = PluginMetadataSchema.safeParse(plugin.metadata);
            if (!metadataResult.success) {
                throw new ValidationError(`Invalid plugin metadata: ${metadataResult.error.errors.map((e) => e.message).join(', ')}`, { pluginId: plugin.metadata.id });
            }
            const pluginId = sanitizeName(plugin.metadata.id);
            // Check for duplicate registration
            if (this.plugins.has(pluginId)) {
                throw new ValidationError(`Plugin already registered: ${pluginId}`, {
                    pluginId,
                });
            }
            // Validate tool/resource/prompt counts
            if (plugin.tools &&
                plugin.tools.length > PLUGIN_LIMITS.maxToolsPerPlugin) {
                throw new ValidationError(`Plugin exceeds maximum tools limit (${PLUGIN_LIMITS.maxToolsPerPlugin})`, { toolCount: plugin.tools.length });
            }
            if (plugin.resources &&
                plugin.resources.length > PLUGIN_LIMITS.maxResourcesPerPlugin) {
                throw new ValidationError(`Plugin exceeds maximum resources limit (${PLUGIN_LIMITS.maxResourcesPerPlugin})`, { resourceCount: plugin.resources.length });
            }
            if (plugin.prompts &&
                plugin.prompts.length > PLUGIN_LIMITS.maxPromptsPerPlugin) {
                throw new ValidationError(`Plugin exceeds maximum prompts limit (${PLUGIN_LIMITS.maxPromptsPerPlugin})`, { promptCount: plugin.prompts.length });
            }
            // Validate all tool names
            for (const tool of plugin.tools || []) {
                validateItemName(tool.definition.name, 'Tool');
            }
            // Validate all resource URIs
            for (const resource of plugin.resources || []) {
                validateItemName(resource.definition.uri, 'Resource');
            }
            // Validate all prompt names
            for (const prompt of plugin.prompts || []) {
                validateItemName(prompt.definition.name, 'Prompt');
            }
            // Merge configuration
            const finalConfig = {
                enabled: true,
                priority: 0,
                ...plugin.defaultConfig,
                ...config,
            };
            // Create registered plugin entry
            const registered = {
                plugin,
                config: finalConfig,
                state: 'registered',
                registeredAt: new Date(),
            };
            // Store plugin
            this.plugins.set(pluginId, registered);
            // Call lifecycle hook with timeout protection
            await withLifecycleTimeout(plugin.lifecycle?.onRegister, 'onRegister', pluginId);
            // Auto-enable if configured
            if (finalConfig.enabled) {
                await this.enable(pluginId);
            }
            logger.info(`Plugin registered: ${plugin.metadata.name}`, {
                pluginId,
                version: plugin.metadata.version,
            });
            this.events.emit('plugin:registered', { pluginId, plugin });
        }
        finally {
            resolveRegistration();
        }
    }
    /**
     * Enable a registered plugin
     */
    async enable(pluginId) {
        const registered = this.plugins.get(pluginId);
        if (!registered) {
            throw new ValidationError(`Plugin not found: ${pluginId}`, { pluginId });
        }
        if (registered.state === 'enabled') {
            return; // Already enabled
        }
        const { plugin } = registered;
        try {
            // Register tools
            for (const tool of plugin.tools || []) {
                const toolName = tool.definition.name;
                if (this.toolHandlers.has(toolName)) {
                    logger.warn(`Tool name collision: ${toolName}`, {
                        pluginId,
                        existingPlugin: this.toolHandlers.get(toolName)?.pluginId,
                    });
                }
                this.toolHandlers.set(toolName, { pluginId, handler: tool.handler });
            }
            // Register resources
            for (const resource of plugin.resources || []) {
                const uri = resource.definition.uri;
                if (this.resourceHandlers.has(uri)) {
                    logger.warn(`Resource URI collision: ${uri}`, {
                        pluginId,
                        existingPlugin: this.resourceHandlers.get(uri)?.pluginId,
                    });
                }
                this.resourceHandlers.set(uri, { pluginId, handler: resource.handler });
            }
            // Register prompts
            for (const prompt of plugin.prompts || []) {
                const promptName = prompt.definition.name;
                if (this.promptHandlers.has(promptName)) {
                    logger.warn(`Prompt name collision: ${promptName}`, {
                        pluginId,
                        existingPlugin: this.promptHandlers.get(promptName)?.pluginId,
                    });
                }
                this.promptHandlers.set(promptName, {
                    pluginId,
                    handler: prompt.handler,
                });
            }
            // Call lifecycle hook with timeout protection
            await withLifecycleTimeout(plugin.lifecycle?.onEnable, 'onEnable', pluginId);
            registered.state = 'enabled';
            registered.enabledAt = new Date();
            logger.info(`Plugin enabled: ${plugin.metadata.name}`, { pluginId });
            this.events.emit('plugin:enabled', { pluginId, plugin });
        }
        catch (error) {
            registered.state = 'error';
            registered.error =
                error instanceof Error ? error : new Error(String(error));
            throw error;
        }
    }
    /**
     * Disable a plugin
     */
    async disable(pluginId) {
        const registered = this.plugins.get(pluginId);
        if (!registered) {
            throw new ValidationError(`Plugin not found: ${pluginId}`, { pluginId });
        }
        if (registered.state !== 'enabled') {
            return; // Already disabled
        }
        const { plugin } = registered;
        // Unregister tools
        for (const tool of plugin.tools || []) {
            this.toolHandlers.delete(tool.definition.name);
        }
        // Unregister resources
        for (const resource of plugin.resources || []) {
            this.resourceHandlers.delete(resource.definition.uri);
        }
        // Unregister prompts
        for (const prompt of plugin.prompts || []) {
            this.promptHandlers.delete(prompt.definition.name);
        }
        // Call lifecycle hook with timeout protection
        await withLifecycleTimeout(plugin.lifecycle?.onDisable, 'onDisable', pluginId);
        registered.state = 'disabled';
        logger.info(`Plugin disabled: ${plugin.metadata.name}`, { pluginId });
        this.events.emit('plugin:disabled', { pluginId, plugin });
    }
    /**
     * Unregister a plugin completely
     */
    async unregister(pluginId) {
        const registered = this.plugins.get(pluginId);
        if (!registered) {
            return; // Not registered
        }
        // Disable first if enabled
        if (registered.state === 'enabled') {
            await this.disable(pluginId);
        }
        // Call lifecycle hook with timeout protection
        await withLifecycleTimeout(registered.plugin.lifecycle?.onUnregister, 'onUnregister', pluginId);
        this.plugins.delete(pluginId);
        logger.info(`Plugin unregistered: ${registered.plugin.metadata.name}`, {
            pluginId,
        });
        this.events.emit('plugin:unregistered', {
            pluginId,
            plugin: registered.plugin,
        });
    }
    /**
     * Get all registered tools (including from plugins)
     */
    getAllTools() {
        const tools = [];
        for (const [, registered] of this.plugins) {
            if (registered.state === 'enabled' && registered.plugin.tools) {
                tools.push(...registered.plugin.tools.map((t) => t.definition));
            }
        }
        return tools;
    }
    /**
     * Get all registered resources (including from plugins)
     */
    getAllResources() {
        const resources = [];
        for (const [, registered] of this.plugins) {
            if (registered.state === 'enabled' && registered.plugin.resources) {
                resources.push(...registered.plugin.resources.map((r) => r.definition));
            }
        }
        return resources;
    }
    /**
     * Get all registered prompts (including from plugins)
     */
    getAllPrompts() {
        const prompts = [];
        for (const [, registered] of this.plugins) {
            if (registered.state === 'enabled' && registered.plugin.prompts) {
                prompts.push(...registered.plugin.prompts.map((p) => p.definition));
            }
        }
        return prompts;
    }
    /**
     * Get a tool handler by name
     */
    getToolHandler(name) {
        return this.toolHandlers.get(name)?.handler;
    }
    /**
     * Get a resource handler by URI
     */
    getResourceHandler(uri) {
        return this.resourceHandlers.get(uri)?.handler;
    }
    /**
     * Get a prompt handler by name
     */
    getPromptHandler(name) {
        return this.promptHandlers.get(name)?.handler;
    }
    /**
     * Check if a tool exists (in core or plugins)
     */
    hasToolHandler(name) {
        return this.toolHandlers.has(name);
    }
    /**
     * Get plugin by ID
     */
    getPlugin(pluginId) {
        return this.plugins.get(pluginId);
    }
    /**
     * Get all registered plugins
     */
    getAllPlugins() {
        return Array.from(this.plugins.values());
    }
    /**
     * Get enabled plugins
     */
    getEnabledPlugins() {
        return Array.from(this.plugins.values()).filter((p) => p.state === 'enabled');
    }
    /**
     * Search plugins by keyword
     */
    searchPlugins(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.plugins.values()).filter((registered) => {
            const { metadata } = registered.plugin;
            return (metadata.name.toLowerCase().includes(lowerQuery) ||
                metadata.description.toLowerCase().includes(lowerQuery) ||
                metadata.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)));
        });
    }
    /**
     * Get plugin statistics
     */
    getStats() {
        const plugins = Array.from(this.plugins.values());
        return {
            total: plugins.length,
            enabled: plugins.filter((p) => p.state === 'enabled').length,
            disabled: plugins.filter((p) => p.state === 'disabled').length,
            error: plugins.filter((p) => p.state === 'error').length,
            tools: this.toolHandlers.size,
            resources: this.resourceHandlers.size,
            prompts: this.promptHandlers.size,
        };
    }
    /**
     * Subscribe to plugin events
     */
    on(event, handler) {
        return this.events.on(event, handler);
    }
    /**
     * Execute before-tool-call hooks for all enabled plugins
     */
    async executeBeforeToolCallHooks(toolName, args) {
        let currentArgs = { ...args };
        for (const registered of this.getEnabledPlugins()) {
            if (registered.plugin.lifecycle?.beforeToolCall) {
                try {
                    currentArgs = await registered.plugin.lifecycle.beforeToolCall(toolName, currentArgs);
                }
                catch (error) {
                    logger.error(`Plugin beforeToolCall hook failed: ${registered.plugin.metadata.id}`, error instanceof Error ? error : undefined);
                }
            }
        }
        return currentArgs;
    }
    /**
     * Execute after-tool-call hooks for all enabled plugins
     */
    async executeAfterToolCallHooks(toolName, result) {
        let currentResult = result;
        for (const registered of this.getEnabledPlugins()) {
            if (registered.plugin.lifecycle?.afterToolCall) {
                try {
                    currentResult = await registered.plugin.lifecycle.afterToolCall(toolName, currentResult);
                }
                catch (error) {
                    logger.error(`Plugin afterToolCall hook failed: ${registered.plugin.metadata.id}`, error instanceof Error ? error : undefined);
                }
            }
        }
        return currentResult;
    }
    /**
     * Clear all plugins (for testing)
     */
    clear() {
        this.plugins.clear();
        this.toolHandlers.clear();
        this.resourceHandlers.clear();
        this.promptHandlers.clear();
    }
}
// =============================================================================
// Singleton Instance
// =============================================================================
export const pluginRegistry = new PluginRegistry();
// =============================================================================
// Plugin Builder Helper
// =============================================================================
/**
 * Helper class for building plugins with a fluent API
 */
export class PluginBuilder {
    plugin = {
        tools: [],
        resources: [],
        prompts: [],
    };
    /**
     * Set plugin metadata
     */
    metadata(metadata) {
        this.plugin.metadata = metadata;
        return this;
    }
    /**
     * Add a tool to the plugin
     */
    tool(definition, handler) {
        this.plugin.tools = this.plugin.tools || [];
        this.plugin.tools.push({ definition, handler });
        return this;
    }
    /**
     * Add a resource to the plugin
     */
    resource(definition, handler) {
        this.plugin.resources = this.plugin.resources || [];
        this.plugin.resources.push({ definition, handler });
        return this;
    }
    /**
     * Add a prompt to the plugin
     */
    prompt(definition, handler) {
        this.plugin.prompts = this.plugin.prompts || [];
        this.plugin.prompts.push({ definition, handler });
        return this;
    }
    /**
     * Set lifecycle hooks
     */
    lifecycle(hooks) {
        this.plugin.lifecycle = hooks;
        return this;
    }
    /**
     * Set default configuration
     */
    defaultConfig(config) {
        this.plugin.defaultConfig = config;
        return this;
    }
    /**
     * Build the plugin
     */
    build() {
        if (!this.plugin.metadata) {
            throw new ValidationError('Plugin metadata is required');
        }
        return this.plugin;
    }
}
/**
 * Create a new plugin builder
 */
export function createPlugin() {
    return new PluginBuilder();
}
// =============================================================================
// Pre-built Plugin Templates
// =============================================================================
/**
 * Create a simple tool plugin
 */
export function createToolPlugin(id, name, description, tools) {
    return {
        metadata: {
            id,
            name,
            version: '1.0.0',
            description,
        },
        tools,
    };
}
/**
 * Create a simple resource plugin
 */
export function createResourcePlugin(id, name, description, resources) {
    return {
        metadata: {
            id,
            name,
            version: '1.0.0',
            description,
        },
        resources,
    };
}
//# sourceMappingURL=index.js.map