/**
 * Chat Configuration Builder
 *
 * Implements the Builder Pattern for Configuration as specified in the blueprint.
 * Allows fluent, type-safe configuration of chat components.
 *
 * @example
 * ```tsx
 * const config = new ChatConfigBuilder()
 *   .withStreaming({
 *     provider: 'openai',
 *     endpoint: '/api/chat',
 *     retryPolicy: 'exponential'
 *   })
 *   .withAccessibility({
 *     screenReader: true,
 *     keyboardShortcuts: true
 *   })
 *   .withPersistence({
 *     storage: 'indexeddb',
 *     maxHistory: 1000
 *   })
 *   .build()
 * ```
 */
/**
 * Chat Configuration Builder
 *
 * Fluent builder API for creating chat configurations
 */
export class ChatConfigBuilder {
    config = {};
    /**
     * Configure streaming behavior
     */
    withStreaming(config) {
        this.config.streaming = {
            maxRetries: 3,
            initialDelay: 1000,
            maxDelay: 30000,
            timeout: 60000,
            ...config,
        };
        return this;
    }
    /**
     * Configure accessibility features
     */
    withAccessibility(config) {
        this.config.accessibility = {
            focusManagement: true,
            ariaLabels: true,
            ...config,
        };
        return this;
    }
    /**
     * Configure persistence/storage
     */
    withPersistence(config) {
        this.config.persistence = {
            autoSave: true,
            saveInterval: 5000,
            encryption: false,
            ...config,
        };
        return this;
    }
    /**
     * Configure markdown rendering
     */
    withMarkdown(config) {
        this.config.markdown = {
            enableSyntaxHighlight: true,
            codeTheme: 'dark',
            ...config,
        };
        return this;
    }
    /**
     * Configure search functionality
     */
    withSearch(config) {
        this.config.search = {
            enableFuzzySearch: false,
            enableAdvancedFilters: true,
            maxResults: 100,
            ...config,
        };
        return this;
    }
    /**
     * Configure export functionality
     */
    withExport(config) {
        this.config.export = {
            defaultFormat: 'markdown',
            includeMetadata: true,
            includeImages: true,
            ...config,
        };
        return this;
    }
    /**
     * Build the final configuration
     */
    build() {
        return { ...this.config };
    }
    /**
     * Reset the builder
     */
    reset() {
        this.config = {};
        return this;
    }
    /**
     * Merge with another configuration
     */
    merge(other) {
        this.config = {
            ...this.config,
            ...other,
            streaming: { ...this.config.streaming, ...other.streaming },
            accessibility: { ...this.config.accessibility, ...other.accessibility },
            persistence: { ...this.config.persistence, ...other.persistence },
            markdown: { ...this.config.markdown, ...other.markdown },
            search: { ...this.config.search, ...other.search },
            export: { ...this.config.export, ...other.export },
        };
        return this;
    }
}
/**
 * Create a new ChatConfigBuilder instance
 */
export function createChatConfig() {
    return new ChatConfigBuilder();
}
/**
 * Default configuration factory
 */
export function getDefaultChatConfig() {
    return new ChatConfigBuilder()
        .withStreaming({
        provider: 'openai',
        endpoint: '/api/chat',
        retryPolicy: 'exponential',
    })
        .withAccessibility({
        screenReader: true,
        highContrast: false,
        keyboardShortcuts: true,
    })
        .withPersistence({
        storage: 'localstorage',
        maxHistory: 100,
    })
        .withMarkdown({
        enableSyntaxHighlight: true,
        codeTheme: 'dark',
    })
        .build();
}
/**
 * Create configuration from JSON
 */
export function fromJSON(json) {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    return parsed;
}
/**
 * Validate configuration
 */
export function validateConfig(config) {
    const errors = [];
    if (config.streaming) {
        if (!config.streaming.endpoint) {
            errors.push('Streaming endpoint is required');
        }
        if (config.streaming.maxRetries && config.streaming.maxRetries < 0) {
            errors.push('Max retries must be non-negative');
        }
    }
    if (config.persistence) {
        if (config.persistence.maxHistory < 0) {
            errors.push('Max history must be non-negative');
        }
        if (config.persistence.saveInterval && config.persistence.saveInterval < 0) {
            errors.push('Save interval must be non-negative');
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
//# sourceMappingURL=chat-config-builder.js.map