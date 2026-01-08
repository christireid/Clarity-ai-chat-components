/**
 * Template Compiler Utility
 *
 * Compiles prompt templates by substituting variable placeholders with actual values.
 * Supports Handlebars/Mustache-style {{ variable }} syntax.
 *
 * @packageDocumentation
 */
import { VARIABLE_REGEX } from './variable-parser';
// =============================================================================
// COMPILATION FUNCTIONS
// =============================================================================
/**
 * Compile a template by replacing variables with their values
 *
 * @param template - Template string with {{ variable }} placeholders
 * @param values - Object mapping variable names to values
 * @param options - Compilation options
 * @returns Compiled string
 *
 * @example
 * ```ts
 * const result = compileTemplate(
 *   'Hello {{ name }}, you are {{ age }} years old.',
 *   { name: 'Alice', age: '30' }
 * )
 * // 'Hello Alice, you are 30 years old.'
 * ```
 */
export function compileTemplate(template, values, options = {}) {
    const { keepUnresolved = true, unresolvedFormat = (name) => `{{ ${name} }}`, trim = false, } = options;
    const compiled = template.replace(VARIABLE_REGEX, (match, variableName) => {
        const value = values[variableName];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
        return keepUnresolved ? unresolvedFormat(variableName) : '';
    });
    return trim ? compiled.trim() : compiled;
}
/**
 * Compile a template with detailed result information
 *
 * @param template - Template string with {{ variable }} placeholders
 * @param values - Object mapping variable names to values
 * @param options - Compilation options
 * @returns Detailed compilation result
 *
 * @example
 * ```ts
 * const result = compileTemplateWithResult(
 *   'Hello {{ name }}, {{ greeting }}',
 *   { name: 'Alice' },
 *   { requiredVariables: ['name'] }
 * )
 * // result.compiled = 'Hello Alice, {{ greeting }}'
 * // result.substituted = ['name']
 * // result.unresolved = ['greeting']
 * // result.success = true (name was required and provided)
 * ```
 */
export function compileTemplateWithResult(template, values, options = {}) {
    const { keepUnresolved = true, unresolvedFormat = (name) => `{{ ${name} }}`, strict = false, requiredVariables = [], trim = false, } = options;
    const substituted = [];
    const unresolved = [];
    const seen = new Set();
    const compiled = template.replace(VARIABLE_REGEX, (match, variableName) => {
        // Track unique variables
        if (!seen.has(variableName)) {
            seen.add(variableName);
            const value = values[variableName];
            if (value !== undefined && value !== null && value !== '') {
                substituted.push(variableName);
            }
            else {
                unresolved.push(variableName);
            }
        }
        const value = values[variableName];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
        return keepUnresolved ? unresolvedFormat(variableName) : '';
    });
    // Check for missing required variables
    const missingRequired = requiredVariables.filter((v) => unresolved.includes(v));
    const success = missingRequired.length === 0;
    let error;
    if (strict && !success) {
        error = `Missing required variables: ${missingRequired.join(', ')}`;
    }
    return {
        compiled: trim ? compiled.trim() : compiled,
        substituted,
        unresolved,
        success,
        error,
    };
}
// =============================================================================
// MESSAGE BUILDING
// =============================================================================
/**
 * Instruction text for structured JSON output mode
 */
export const STRUCTURED_OUTPUT_INSTRUCTION = `
IMPORTANT: You MUST respond with valid JSON only. No markdown code blocks, no explanations outside the JSON.

Your response must be a JSON object with this structure:
{
  "thinking": "Your step-by-step reasoning process (optional)",
  "result": "The actual answer or result",
  "confidence": 0.0 to 1.0 confidence score (optional)
}

Respond ONLY with the JSON object, nothing else.
`.trim();
/**
 * Build a messages array for API consumption
 *
 * @param systemPrompt - Compiled system prompt
 * @param userPrompt - Compiled user prompt
 * @param structuredOutputMode - Whether to add JSON output instructions
 * @returns Array of CoreMessage objects
 *
 * @example
 * ```ts
 * const messages = buildMessagesArray(
 *   'You are a helpful assistant.',
 *   'What is 2 + 2?',
 *   false
 * )
 * // [
 * //   { role: 'system', content: 'You are a helpful assistant.' },
 * //   { role: 'user', content: 'What is 2 + 2?' }
 * // ]
 * ```
 */
export function buildMessagesArray(systemPrompt, userPrompt, structuredOutputMode = false) {
    const messages = [];
    // System message
    if (systemPrompt.trim()) {
        let finalSystem = systemPrompt.trim();
        // Append structured output instructions if enabled
        if (structuredOutputMode) {
            finalSystem = `${finalSystem}\n\n${STRUCTURED_OUTPUT_INSTRUCTION}`;
        }
        messages.push({
            role: 'system',
            content: finalSystem,
        });
    }
    else if (structuredOutputMode) {
        // Add structured output instruction as system message if no system prompt
        messages.push({
            role: 'system',
            content: STRUCTURED_OUTPUT_INSTRUCTION,
        });
    }
    // User message
    if (userPrompt.trim()) {
        messages.push({
            role: 'user',
            content: userPrompt.trim(),
        });
    }
    return messages;
}
/**
 * Build messages array from templates and variables
 *
 * @param systemPromptTemplate - System prompt template
 * @param userPromptTemplate - User prompt template
 * @param values - Variable values
 * @param structuredOutputMode - Whether to add JSON output instructions
 * @returns Compiled messages array
 */
export function buildMessagesFromTemplates(systemPromptTemplate, userPromptTemplate, values, structuredOutputMode = false) {
    const compiledSystem = compileTemplate(systemPromptTemplate, values, {
        keepUnresolved: false,
        trim: true,
    });
    const compiledUser = compileTemplate(userPromptTemplate, values, {
        keepUnresolved: false,
        trim: true,
    });
    return buildMessagesArray(compiledSystem, compiledUser, structuredOutputMode);
}
/**
 * Generate diff segments showing template vs compiled
 *
 * @param template - Original template
 * @param values - Variable values
 * @returns Array of diff segments
 *
 * @example
 * ```ts
 * const diff = generateDiff('Hello {{ name }}!', { name: 'Alice' })
 * // [
 * //   { type: 'unchanged', content: 'Hello ' },
 * //   { type: 'value', content: 'Alice', variableName: 'name' },
 * //   { type: 'unchanged', content: '!' }
 * // ]
 * ```
 */
export function generateDiff(template, values) {
    const segments = [];
    let lastIndex = 0;
    // Create a fresh regex instance
    const regex = new RegExp(VARIABLE_REGEX.source, 'g');
    let match;
    while ((match = regex.exec(template)) !== null) {
        // Add unchanged text before variable
        if (match.index > lastIndex) {
            segments.push({
                type: 'unchanged',
                content: template.slice(lastIndex, match.index),
            });
        }
        const variableName = match[1];
        const value = values[variableName];
        if (value !== undefined && value !== null && value !== '') {
            // Variable was substituted
            segments.push({
                type: 'value',
                content: value,
                variableName,
            });
        }
        else {
            // Variable not substituted, show placeholder
            segments.push({
                type: 'variable',
                content: match[0],
                variableName,
            });
        }
        lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < template.length) {
        segments.push({
            type: 'unchanged',
            content: template.slice(lastIndex),
        });
    }
    return segments;
}
/**
 * Format messages array as pretty JSON for debug view
 *
 * @param messages - Messages array
 * @returns Formatted JSON string
 */
export function formatMessagesAsJson(messages) {
    return JSON.stringify(messages, null, 2);
}
/**
 * Format messages array as a readable string for preview
 *
 * @param messages - Messages array
 * @returns Formatted string
 */
export function formatMessagesAsText(messages) {
    return messages
        .map((m) => {
        const roleLabel = m.role.toUpperCase();
        const separator = '─'.repeat(40);
        return `┌${separator}┐\n│ ${roleLabel}\n├${separator}┤\n${m.content}\n└${separator}┘`;
    })
        .join('\n\n');
}
// =============================================================================
// VALIDATION
// =============================================================================
/**
 * Check if all required variables have values
 *
 * @param requiredVariables - List of required variable names
 * @param values - Current variable values
 * @returns Object with valid flag and missing variables
 */
export function validateRequiredVariables(requiredVariables, values) {
    const missing = requiredVariables.filter((name) => {
        const value = values[name];
        return value === undefined || value === null || value.trim() === '';
    });
    return {
        valid: missing.length === 0,
        missing,
    };
}
/**
 * Get list of variables used in template that don't have values
 *
 * @param template - Template string
 * @param values - Variable values
 * @returns List of variable names without values
 */
export function getMissingVariables(template, values) {
    const missing = [];
    const seen = new Set();
    const regex = new RegExp(VARIABLE_REGEX.source, 'g');
    let match;
    while ((match = regex.exec(template)) !== null) {
        const name = match[1];
        if (!seen.has(name)) {
            seen.add(name);
            const value = values[name];
            if (value === undefined || value === null || value.trim() === '') {
                missing.push(name);
            }
        }
    }
    return missing;
}
//# sourceMappingURL=template-compiler.js.map