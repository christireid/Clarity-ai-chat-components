/**
 * TypeScript Type Definitions for Common Tool Results
 *
 * Provides type-safe interfaces for common tool result shapes.
 * Use these types when creating tool UI components.
 */
/**
 * Type guard to check if result matches a specific tool result type
 */
export function isWeatherToolResult(result) {
    return (typeof result === 'object' &&
        result !== null &&
        typeof result.location === 'string' &&
        typeof result.temperature === 'number' &&
        typeof result.condition === 'string');
}
export function isSearchToolResult(result) {
    return (typeof result === 'object' &&
        result !== null &&
        typeof result.query === 'string' &&
        Array.isArray(result.results));
}
export function isCalculatorToolResult(result) {
    return (typeof result === 'object' &&
        result !== null &&
        typeof result.expression === 'string' &&
        typeof result.result === 'number');
}
/**
 * Extract tool name from tool call
 */
export function getToolName(toolCall) {
    return toolCall.function.name;
}
/**
 * Parse tool arguments safely
 */
export function parseToolArguments(toolCall) {
    try {
        const parsed = JSON.parse(toolCall.function.arguments);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
            ? parsed
            : {};
    }
    catch {
        return {};
    }
}
/**
 * Validate tool result structure
 */
export function validateToolResult(result, requiredFields) {
    if (typeof result !== 'object' || result === null) {
        return { valid: false, missingFields: requiredFields };
    }
    const missingFields = requiredFields.filter((field) => !(field in result));
    return {
        valid: missingFields.length === 0,
        missingFields: missingFields.length > 0 ? missingFields : undefined,
    };
}
//# sourceMappingURL=tool-result-types.js.map