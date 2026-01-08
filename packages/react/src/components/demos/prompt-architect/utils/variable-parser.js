/**
 * Variable Parser Utility
 *
 * Extracts and analyzes Handlebars/Mustache-style variables from prompt templates.
 * Supports {{ variable_name }} syntax with intelligent type inference.
 *
 * @packageDocumentation
 */
// =============================================================================
// CONSTANTS
// =============================================================================
/**
 * Regex pattern for matching Handlebars-style variables
 * Matches: {{ variable_name }} with optional whitespace
 * Captures: the variable name (must start with letter/underscore, followed by alphanumeric/underscore)
 */
export const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
/**
 * Regex for detecting potentially unmatched braces
 */
const UNMATCHED_OPEN_BRACE = /\{\{(?![^{}]*\}\})/g;
const UNMATCHED_CLOSE_BRACE = /(?<!\{\{[^{}]*)\}\}/g;
// =============================================================================
// TYPE INFERENCE PATTERNS
// =============================================================================
/**
 * Patterns for inferring number type
 */
const NUMBER_PATTERNS = [
    /count$/i,
    /number$/i,
    /^num_/i,
    /^n_/i,
    /age$/i,
    /quantity$/i,
    /amount$/i,
    /limit$/i,
    /max$/i,
    /min$/i,
    /size$/i,
    /length$/i,
    /index$/i,
    /^total_/i,
    /percent/i,
    /score$/i,
    /rating$/i,
    /price$/i,
    /cost$/i,
    /year$/i,
    /month$/i,
    /day$/i,
    /hour$/i,
    /minute$/i,
    /second$/i,
    /duration$/i,
    /timeout$/i,
    /retry/i,
    /attempts$/i,
    /iterations$/i,
    /depth$/i,
    /width$/i,
    /height$/i,
    /^max_/i,
    /^min_/i,
];
/**
 * Patterns for inferring textarea type (longer content)
 */
const TEXTAREA_PATTERNS = [
    /context$/i,
    /content$/i,
    /description$/i,
    /body$/i,
    /text$/i,
    /message$/i,
    /prompt$/i,
    /instructions?$/i,
    /code$/i,
    /example$/i,
    /snippet$/i,
    /template$/i,
    /query$/i,
    /input$/i,
    /output$/i,
    /response$/i,
    /summary$/i,
    /details$/i,
    /notes$/i,
    /comments?$/i,
    /feedback$/i,
    /review$/i,
    /explanation$/i,
    /reasoning$/i,
    /analysis$/i,
    /report$/i,
    /document$/i,
    /article$/i,
    /essay$/i,
    /paragraph$/i,
    /section$/i,
    /background$/i,
    /history$/i,
    /bio$/i,
    /about$/i,
    /purpose$/i,
    /goals?$/i,
    /requirements?$/i,
    /constraints?$/i,
    /rules?$/i,
    /guidelines?$/i,
    /criteria$/i,
    /specifications?$/i,
    /data$/i,
    /json$/i,
    /xml$/i,
    /html$/i,
    /markdown$/i,
    /script$/i,
    /source$/i,
];
/**
 * Patterns for inferring toggle/boolean type
 */
const TOGGLE_PATTERNS = [
    /^is_/i,
    /^has_/i,
    /^can_/i,
    /^should_/i,
    /^will_/i,
    /^enable_/i,
    /^disable_/i,
    /^allow_/i,
    /^show_/i,
    /^hide_/i,
    /^include_/i,
    /^exclude_/i,
    /^use_/i,
    /^require_/i,
    /^force_/i,
    /^strict_/i,
    /^verbose_/i,
    /_enabled$/i,
    /_disabled$/i,
    /_active$/i,
    /_visible$/i,
    /_hidden$/i,
    /_required$/i,
    /_optional$/i,
    /_flag$/i,
    /^flag_/i,
];
// =============================================================================
// TYPE INFERENCE
// =============================================================================
/**
 * Infer the most appropriate input field type based on variable name patterns
 *
 * @param name - Variable name to analyze
 * @returns Inferred field type
 *
 * @example
 * ```ts
 * inferVariableType('user_name')      // 'text'
 * inferVariableType('retry_count')    // 'number'
 * inferVariableType('user_context')   // 'textarea'
 * inferVariableType('is_verbose')     // 'toggle'
 * ```
 */
export function inferVariableType(name) {
    // Check toggle patterns first (most specific)
    for (const pattern of TOGGLE_PATTERNS) {
        if (pattern.test(name)) {
            return 'toggle';
        }
    }
    // Check number patterns
    for (const pattern of NUMBER_PATTERNS) {
        if (pattern.test(name)) {
            return 'number';
        }
    }
    // Check textarea patterns
    for (const pattern of TEXTAREA_PATTERNS) {
        if (pattern.test(name)) {
            return 'textarea';
        }
    }
    // Default to text
    return 'text';
}
// =============================================================================
// NAME FORMATTING
// =============================================================================
/**
 * Convert a variable name to a human-readable display name
 *
 * @param name - Variable name (e.g., "user_name", "maxRetryCount")
 * @returns Formatted display name (e.g., "User Name", "Max Retry Count")
 *
 * @example
 * ```ts
 * formatDisplayName('user_name')       // 'User Name'
 * formatDisplayName('maxRetryCount')   // 'Max Retry Count'
 * formatDisplayName('API_KEY')         // 'API Key'
 * formatDisplayName('XMLParser')       // 'XML Parser'
 * ```
 */
export function formatDisplayName(name) {
    return (name
        // Insert space before uppercase letters in camelCase
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        // Insert space before sequences of uppercase followed by lowercase (e.g., XMLParser -> XML Parser)
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        // Replace underscores and hyphens with spaces
        .replace(/[_-]+/g, ' ')
        // Capitalize first letter of each word
        .replace(/\b\w/g, (char) => char.toUpperCase())
        // Trim extra spaces
        .trim());
}
// =============================================================================
// VARIABLE EXTRACTION
// =============================================================================
/**
 * Extract all unique variables from a template string
 *
 * @param template - Template string containing {{ variable }} placeholders
 * @returns Extraction result with variables and metadata
 *
 * @example
 * ```ts
 * const result = extractVariables('Hello {{ name }}, your order #{{ order_id }} is ready.')
 * // result.variables = [
 * //   { name: 'name', displayName: 'Name', inferredType: 'text', ... },
 * //   { name: 'order_id', displayName: 'Order Id', inferredType: 'text', ... }
 * // ]
 * ```
 */
export function extractVariables(template) {
    const variables = [];
    const seen = new Map();
    const warnings = [];
    let totalPlaceholders = 0;
    // Reset regex state
    VARIABLE_REGEX.lastIndex = 0;
    // Find all variable matches
    let match;
    while ((match = VARIABLE_REGEX.exec(template)) !== null) {
        totalPlaceholders++;
        const name = match[1];
        const position = match.index;
        if (seen.has(name)) {
            // Increment occurrence count for duplicate
            const existing = seen.get(name);
            existing.occurrenceCount++;
        }
        else {
            // New variable
            const variable = {
                name,
                displayName: formatDisplayName(name),
                inferredType: inferVariableType(name),
                firstOccurrence: position,
                occurrenceCount: 1,
            };
            seen.set(name, variable);
            variables.push(variable);
        }
    }
    // Check for unmatched braces
    const hasUnmatchedOpen = UNMATCHED_OPEN_BRACE.test(template);
    const hasUnmatchedClose = UNMATCHED_CLOSE_BRACE.test(template);
    const hasUnmatchedBraces = hasUnmatchedOpen || hasUnmatchedClose;
    if (hasUnmatchedOpen) {
        warnings.push('Template contains unmatched opening braces "{{"');
    }
    if (hasUnmatchedClose) {
        warnings.push('Template contains unmatched closing braces "}}"');
    }
    // Check for potentially problematic variable names
    for (const v of variables) {
        if (v.name.length === 1) {
            warnings.push(`Variable "${v.name}" has a very short name - consider a more descriptive name`);
        }
        if (v.name.length > 30) {
            warnings.push(`Variable "${v.name}" has a very long name - consider shortening it`);
        }
    }
    // Sort by first occurrence
    variables.sort((a, b) => a.firstOccurrence - b.firstOccurrence);
    return {
        variables,
        totalPlaceholders,
        hasUnmatchedBraces,
        warnings,
    };
}
/**
 * Extract variables from multiple templates and merge results
 *
 * @param templates - Array of template strings
 * @returns Combined extraction result with deduplicated variables
 *
 * @example
 * ```ts
 * const result = extractVariablesFromMultiple([
 *   'System: You are {{ role }}',
 *   'User: Hello {{ name }}, help with {{ task }}'
 * ])
 * ```
 */
export function extractVariablesFromMultiple(templates) {
    const allVariables = new Map();
    const allWarnings = [];
    let totalPlaceholders = 0;
    let hasUnmatchedBraces = false;
    for (const template of templates) {
        const result = extractVariables(template);
        totalPlaceholders += result.totalPlaceholders;
        hasUnmatchedBraces = hasUnmatchedBraces || result.hasUnmatchedBraces;
        allWarnings.push(...result.warnings);
        for (const v of result.variables) {
            if (allVariables.has(v.name)) {
                const existing = allVariables.get(v.name);
                existing.occurrenceCount += v.occurrenceCount;
            }
            else {
                allVariables.set(v.name, { ...v });
            }
        }
    }
    // Sort merged variables by name for consistency
    const variables = Array.from(allVariables.values()).sort((a, b) => a.name.localeCompare(b.name));
    return {
        variables,
        totalPlaceholders,
        hasUnmatchedBraces,
        warnings: [...new Set(allWarnings)], // Deduplicate warnings
    };
}
// =============================================================================
// VALIDATION
// =============================================================================
/**
 * Validate a variable name
 *
 * @param name - Variable name to validate
 * @returns Validation result with success flag and optional error
 */
export function validateVariableName(name) {
    if (!name) {
        return { valid: false, error: 'Variable name cannot be empty' };
    }
    if (!/^[a-zA-Z_]/.test(name)) {
        return {
            valid: false,
            error: 'Variable name must start with a letter or underscore',
        };
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        return {
            valid: false,
            error: 'Variable name can only contain letters, numbers, and underscores',
        };
    }
    if (name.length > 50) {
        return {
            valid: false,
            error: 'Variable name is too long (max 50 characters)',
        };
    }
    return { valid: true };
}
/**
 * Check if a value looks like it contains variable syntax
 * Useful for detecting when user accidentally pastes template content into variable input
 */
export function containsVariableSyntax(value) {
    VARIABLE_REGEX.lastIndex = 0;
    return VARIABLE_REGEX.test(value);
}
// =============================================================================
// HIGHLIGHTING HELPERS
// =============================================================================
/**
 * Split template into segments for syntax highlighting
 *
 * @param template - Template string
 * @returns Array of segments with type and content
 *
 * @example
 * ```ts
 * const segments = getTemplateSegments('Hello {{ name }}!')
 * // [
 * //   { type: 'text', content: 'Hello ' },
 * //   { type: 'variable', content: '{{ name }}', variableName: 'name' },
 * //   { type: 'text', content: '!' }
 * // ]
 * ```
 */
export function getTemplateSegments(template) {
    const segments = [];
    let lastIndex = 0;
    VARIABLE_REGEX.lastIndex = 0;
    let match;
    while ((match = VARIABLE_REGEX.exec(template)) !== null) {
        // Add text segment before this variable
        if (match.index > lastIndex) {
            segments.push({
                type: 'text',
                content: template.slice(lastIndex, match.index),
            });
        }
        // Add variable segment
        segments.push({
            type: 'variable',
            content: match[0],
            variableName: match[1],
        });
        lastIndex = match.index + match[0].length;
    }
    // Add remaining text after last variable
    if (lastIndex < template.length) {
        segments.push({
            type: 'text',
            content: template.slice(lastIndex),
        });
    }
    return segments;
}
/**
 * Get all variable positions for highlighting
 *
 * @param template - Template string
 * @returns Array of position objects with start, end, and variable name
 */
export function getVariablePositions(template) {
    const positions = [];
    VARIABLE_REGEX.lastIndex = 0;
    let match;
    while ((match = VARIABLE_REGEX.exec(template)) !== null) {
        positions.push({
            start: match.index,
            end: match.index + match[0].length,
            variableName: match[1],
        });
    }
    return positions;
}
//# sourceMappingURL=variable-parser.js.map