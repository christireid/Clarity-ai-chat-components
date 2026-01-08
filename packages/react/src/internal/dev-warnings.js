/**
 * Development Warnings Utility
 *
 * Provides developer-friendly warnings that help catch common mistakes
 * during development. All warnings are stripped in production builds.
 *
 * @packageDocumentation
 * @internal
 */
const DOCS_BASE = 'https://clarity-chat.dev';
/**
 * Set of warnings that have already been shown (for one-time warnings)
 * Limited to prevent unbounded memory growth in long-running SPAs
 */
const shownWarnings = new Set();
const MAX_SHOWN_WARNINGS = 1000;
/**
 * Add a warning key to the shown set, with size limit
 */
function markWarningShown(key) {
    // If we're at the limit, clear older entries (simple FIFO approach)
    if (shownWarnings.size >= MAX_SHOWN_WARNINGS) {
        const firstKey = shownWarnings.values().next().value;
        if (firstKey)
            shownWarnings.delete(firstKey);
    }
    shownWarnings.add(key);
}
/**
 * Category prefixes for visual distinction
 */
const CATEGORY_PREFIXES = {
    misuse: 'Misuse',
    deprecation: 'Deprecated',
    performance: 'Performance',
    config: 'Configuration',
    accessibility: 'Accessibility',
    security: 'Security',
};
/**
 * Issue a development warning with consistent formatting
 *
 * @param options - Warning configuration
 *
 * @example
 * ```ts
 * warn({
 *   category: 'misuse',
 *   component: 'ChatInput',
 *   message: 'Missing required "onSubmit" prop',
 *   example: '<ChatInput onSubmit={handleSubmit} />',
 *   docsPath: '/components/chat-input',
 * })
 * ```
 */
export function warn(options) {
    if (process.env.NODE_ENV === 'production')
        return;
    const { category, component, message, docsPath, example, once = true, } = options;
    const warningKey = `${component}:${message}`;
    // Only show each warning once per session if once=true
    if (once && shownWarnings.has(warningKey))
        return;
    if (once)
        markWarningShown(warningKey);
    const prefix = CATEGORY_PREFIXES[category];
    let fullMessage = `[Clarity Chat ${prefix}] ${component}\n\n${message}`;
    if (example) {
        fullMessage += `\n\nExample:\n${example}`;
    }
    if (docsPath) {
        fullMessage += `\n\nDocs: ${DOCS_BASE}${docsPath}`;
    }
    console.warn(fullMessage);
}
/**
 * Warn if a condition is true (development only)
 *
 * @param condition - If true, the warning will be shown
 * @param component - Component or hook name
 * @param message - Warning message
 *
 * @example
 * ```ts
 * devWarning(
 *   !onSubmit,
 *   'ChatInput',
 *   'Missing "onSubmit" prop. The submit button will not work.'
 * )
 * ```
 */
export function devWarning(condition, component, message) {
    if (process.env.NODE_ENV === 'production')
        return;
    if (!condition)
        return;
    const warningKey = `${component}:${message}`;
    if (shownWarnings.has(warningKey))
        return;
    markWarningShown(warningKey);
    console.warn(`[Clarity Chat] ${component}: ${message}`);
}
/**
 * Warn about deprecated props with migration path
 *
 * @param props - The props object
 * @param oldProp - The deprecated prop name
 * @param newProp - The new prop name to use instead
 * @param component - Component name
 * @param removeVersion - Version when the prop will be removed
 *
 * @example
 * ```ts
 * deprecatedProp(props, 'isLoading', 'loading', 'MessageBubble', '2.0')
 * ```
 */
export function deprecatedProp(props, oldProp, newProp, component, removeVersion = '2.0') {
    if (process.env.NODE_ENV === 'production')
        return;
    if (!(oldProp in props))
        return;
    warn({
        category: 'deprecation',
        component,
        message: `"${oldProp}" is deprecated and will be removed in v${removeVersion}. ` +
            `Use "${newProp}" instead.`,
        docsPath: `/migration/v1-to-v${removeVersion}#${oldProp}`,
    });
}
/**
 * Warn about deprecated component with migration path
 *
 * @param oldComponent - The deprecated component name
 * @param newComponent - The new component name to use instead
 * @param removeVersion - Version when the component will be removed
 *
 * @example
 * ```ts
 * deprecatedComponent('useChat', 'useClarityChat', '3.0')
 * ```
 */
export function deprecatedComponent(oldComponent, newComponent, removeVersion = '2.0') {
    if (process.env.NODE_ENV === 'production')
        return;
    warn({
        category: 'deprecation',
        component: oldComponent,
        message: `This component is deprecated and will be removed in v${removeVersion}. ` +
            `Please migrate to "${newComponent}".`,
        docsPath: `/migration/v1-to-v${removeVersion}`,
    });
}
/**
 * Warn about missing provider context
 *
 * @param component - Component name that requires the provider
 * @param provider - Provider name that is missing
 *
 * @example
 * ```ts
 * missingProviderWarning('ChatInput', 'ChatProvider')
 * ```
 */
export function missingProviderWarning(component, provider) {
    if (process.env.NODE_ENV === 'production')
        return;
    warn({
        category: 'misuse',
        component,
        message: `${component} must be used within a ${provider}.`,
        example: `<${provider}>\n  <${component} />\n</${provider}>`,
        docsPath: '/getting-started#provider-setup',
    });
}
/**
 * Warn about performance issues
 *
 * @param component - Component name
 * @param issue - Description of the performance issue
 * @param suggestion - How to fix it
 *
 * @example
 * ```ts
 * performanceWarning(
 *   'MessageList',
 *   `Rendering ${messages.length} messages without virtualization`,
 *   'Enable virtualization with <MessageList virtualized />'
 * )
 * ```
 */
export function performanceWarning(component, issue, suggestion) {
    if (process.env.NODE_ENV === 'production')
        return;
    warn({
        category: 'performance',
        component,
        message: `${issue}. ${suggestion}`,
        docsPath: '/performance',
    });
}
/**
 * Warn about inline functions causing unnecessary re-renders
 *
 * @param component - Component name
 * @param propName - The prop with an inline function
 *
 * @example
 * ```ts
 * inlineFunctionWarning('ChatProvider', 'onMessage')
 * ```
 */
export function inlineFunctionWarning(component, propName) {
    if (process.env.NODE_ENV === 'production')
        return;
    warn({
        category: 'performance',
        component,
        message: `Inline function passed to "${propName}". ` +
            `This causes unnecessary re-renders.`,
        example: `// Instead of:\n` +
            `<${component} ${propName}={(val) => handle(val)} />\n\n` +
            `// Do:\n` +
            `const handle${propName.charAt(0).toUpperCase() + propName.slice(1)} = useCallback((val) => handle(val), [])\n` +
            `<${component} ${propName}={handle${propName.charAt(0).toUpperCase() + propName.slice(1)}} />`,
        docsPath: '/performance#memoization',
    });
}
/**
 * Warn about accessibility issues
 *
 * @param component - Component name
 * @param issue - Description of the accessibility issue
 * @param fix - How to fix it
 *
 * @example
 * ```ts
 * accessibilityWarning(
 *   'ChatInput',
 *   'Missing aria-label',
 *   'Add aria-label="Chat message input" prop'
 * )
 * ```
 */
export function accessibilityWarning(component, issue, fix) {
    if (process.env.NODE_ENV === 'production')
        return;
    warn({
        category: 'accessibility',
        component,
        message: `${issue}. ${fix}`,
        docsPath: '/accessibility',
    });
}
/**
 * Validate prop types at runtime (development only)
 *
 * @param condition - If true, validation passes
 * @param component - Component name
 * @param propName - Prop name being validated
 * @param expected - Expected type/value description
 * @param received - Actual received value
 *
 * @example
 * ```ts
 * validateProp(
 *   typeof value === 'string',
 *   'ChatInput',
 *   'value',
 *   'string',
 *   typeof value
 * )
 * ```
 */
export function validateProp(condition, component, propName, expected, received) {
    if (process.env.NODE_ENV === 'production')
        return;
    if (condition)
        return;
    const receivedType = received === null
        ? 'null'
        : received === undefined
            ? 'undefined'
            : typeof received;
    let receivedDetail = '';
    if (typeof received === 'object' && received !== null) {
        try {
            receivedDetail = ` (${JSON.stringify(received)})`;
        }
        catch {
            // Handle circular references
            receivedDetail = ` (${Object.prototype.toString.call(received)})`;
        }
    }
    warn({
        category: 'misuse',
        component,
        message: `Invalid prop "${propName}".\n\n` +
            `Expected: ${expected}\n` +
            `Received: ${receivedType}${receivedDetail}`,
        docsPath: `/components/${component.toLowerCase()}#props`,
    });
}
/**
 * Validate that a required prop is provided
 *
 * @param value - The prop value
 * @param component - Component name
 * @param propName - Prop name
 *
 * @example
 * ```ts
 * requireProp(onSubmit, 'ChatInput', 'onSubmit')
 * ```
 */
export function requireProp(value, component, propName) {
    if (process.env.NODE_ENV === 'production')
        return;
    if (value !== undefined && value !== null)
        return;
    warn({
        category: 'misuse',
        component,
        message: `Required prop "${propName}" is missing.`,
        docsPath: `/components/${component.toLowerCase()}#props`,
    });
}
/**
 * Validate enum prop values
 *
 * @param value - The prop value
 * @param allowedValues - Array of allowed values
 * @param component - Component name
 * @param propName - Prop name
 *
 * @example
 * ```ts
 * validateEnumProp(variant, ['user', 'assistant', 'system'], 'Message', 'variant')
 * ```
 */
export function validateEnumProp(value, allowedValues, component, propName) {
    if (process.env.NODE_ENV === 'production')
        return;
    if (value === undefined)
        return;
    if (allowedValues.includes(value))
        return;
    warn({
        category: 'misuse',
        component,
        message: `Invalid "${propName}" prop value: "${value}".\n\n` +
            `Expected one of: ${allowedValues.map((v) => `"${v}"`).join(' | ')}`,
        example: `<${component} ${propName}="${allowedValues[0]}" />`,
        docsPath: `/components/${component.toLowerCase()}#${propName.toLowerCase()}`,
    });
}
/**
 * Reset shown warnings (useful for testing)
 */
export function resetWarnings() {
    shownWarnings.clear();
}
/**
 * Check if a warning has been shown
 *
 * @param component - Component name
 * @param message - Warning message
 * @returns true if the warning has been shown
 */
export function hasWarned(component, message) {
    return shownWarnings.has(`${component}:${message}`);
}
//# sourceMappingURL=dev-warnings.js.map