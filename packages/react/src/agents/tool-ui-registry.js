/**
 * Tool UI Registry
 *
 * Registry pattern for mapping tool names to React components that render
 * tool results in a user-friendly way.
 *
 * @example
 * ```tsx
 * const registry = createToolUIRegistry({
 *   weather: WeatherResult,
 *   search: SearchResults,
 * })
 *
 * <ClarityToolResult
 *   registry={registry}
 *   toolCall={toolCall}
 *   result={result}
 *   messages={messages}
 * />
 * ```
 */
/**
 * Create a type-safe tool UI registry
 *
 * @param registry - Object mapping tool names to components
 * @returns The registry (for type inference)
 */
export function createToolUIRegistry(registry) {
    return registry;
}
/**
 * Get component for a tool from registry
 */
export function getToolComponent(registry, toolName) {
    return registry[toolName];
}
/**
 * Check if a tool has a registered component
 */
export function hasToolComponent(registry, toolName) {
    return toolName in registry && registry[toolName] !== undefined;
}
/**
 * Validate registry components at runtime
 * Checks that all registered components are valid React components
 *
 * @param registry - Tool component registry to validate
 * @returns Validation result with any errors found
 */
export function validateToolRegistry(registry) {
    const errors = [];
    const warnings = [];
    for (const [toolName, Component] of Object.entries(registry)) {
        if (!Component) {
            errors.push({
                toolName,
                error: 'Component is null or undefined',
            });
            continue;
        }
        if (typeof Component !== 'function' && typeof Component !== 'object') {
            errors.push({
                toolName,
                error: `Component is not a valid React component (got ${typeof Component})`,
            });
            continue;
        }
        // Check if it's a valid React component type
        if (typeof Component === 'function') {
            const componentName = Component.displayName || Component.name || toolName;
            if (!componentName || componentName === 'Anonymous') {
                warnings.push({
                    toolName,
                    warning: 'Component has no display name (consider adding displayName)',
                });
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Get registry statistics
 *
 * @param registry - Tool component registry
 * @returns Statistics about the registry
 */
export function getRegistryStats(registry) {
    const toolNames = Object.keys(registry);
    return {
        totalTools: toolNames.length,
        toolNames,
        hasComponents: toolNames.length > 0,
    };
}
//# sourceMappingURL=tool-ui-registry.js.map