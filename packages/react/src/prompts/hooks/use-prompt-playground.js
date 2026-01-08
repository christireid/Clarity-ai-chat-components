/**
 * usePromptPlayground Hook
 *
 * Interactive prompt testing and experimentation hook.
 * Provides real-time rendering, token estimation, and cost calculation.
 *
 * @packageDocumentation
 */
'use client';
import * as React from 'react';
import { PromptTemplateEngine } from '../template';
/**
 * Common model pricing presets
 */
export const MODEL_PRICING = {
    'gpt-4o': {
        id: 'gpt-4o',
        name: 'GPT-4o',
        inputCostPer1k: 0.005,
        outputCostPer1k: 0.015,
        maxTokens: 128000,
    },
    'gpt-4o-mini': {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        inputCostPer1k: 0.00015,
        outputCostPer1k: 0.0006,
        maxTokens: 128000,
    },
    'gpt-4-turbo': {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        inputCostPer1k: 0.01,
        outputCostPer1k: 0.03,
        maxTokens: 128000,
    },
    'gpt-3.5-turbo': {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        inputCostPer1k: 0.0005,
        outputCostPer1k: 0.0015,
        maxTokens: 16385,
    },
    'claude-3-5-sonnet': {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        inputCostPer1k: 0.003,
        outputCostPer1k: 0.015,
        maxTokens: 200000,
    },
    'claude-3-opus': {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        inputCostPer1k: 0.015,
        outputCostPer1k: 0.075,
        maxTokens: 200000,
    },
    'claude-3-haiku': {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        inputCostPer1k: 0.00025,
        outputCostPer1k: 0.00125,
        maxTokens: 200000,
    },
};
/** Maximum template length to prevent DoS */
const MAX_TEMPLATE_LENGTH = 100_000;
/** Maximum variable value length */
const MAX_VARIABLE_VALUE_LENGTH = 50_000;
/**
 * Estimate token count (simple approximation)
 * Real implementation should use tiktoken or similar
 */
function estimateTokens(text) {
    // Rough estimate: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
}
/**
 * Validate and truncate string if necessary
 */
function validateStringLength(value, maxLength) {
    if (value.length <= maxLength) {
        return { value, truncated: false };
    }
    return { value: value.slice(0, maxLength), truncated: true };
}
/**
 * usePromptPlayground Hook
 *
 * Interactive prompt playground for testing and experimentation.
 * Features real-time rendering, token counting, and cost estimation.
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   setTemplate,
 *   setVariable,
 *   render,
 *   getEstimatedCost,
 * } = usePromptPlayground({
 *   initialTemplate: 'Hello {{name}}!',
 *   initialVariables: { name: 'World' },
 *   model: 'gpt-4o',
 *   autoRender: true,
 * })
 *
 * // Rendered output: "Hello World!"
 * console.log(state.output)
 *
 * // Token count: ~4
 * console.log(state.tokenCount)
 *
 * // Estimated cost
 * const cost = getEstimatedCost(100)
 * console.log(`Input: $${cost.input}, Output: $${cost.output}`)
 * ```
 */
export function usePromptPlayground(options = {}) {
    const { initialTemplate = '', initialVariables = {}, model = 'gpt-4o', customPricing, debounceMs = 300, autoRender = true, onRender, onError, } = options;
    const templateEngine = React.useMemo(() => new PromptTemplateEngine(), []);
    // Current model pricing
    const [currentModel, setCurrentModel] = React.useState(model);
    const pricing = React.useMemo(() => customPricing || MODEL_PRICING[currentModel] || MODEL_PRICING['gpt-4o'], [customPricing, currentModel]);
    // State
    const [state, setState] = React.useState(() => {
        const templateStr = typeof initialTemplate === 'string'
            ? initialTemplate
            : initialTemplate.template;
        return {
            template: templateStr,
            variables: initialVariables,
            output: '',
            tokenCount: estimateTokens(templateStr),
            costEstimate: 0,
            errors: [],
            isRendering: false,
        };
    });
    // Debounce timer ref
    const debounceRef = React.useRef();
    // Refs to avoid stale closures in performRender
    const stateRef = React.useRef(state);
    const pricingRef = React.useRef(pricing);
    const callbacksRef = React.useRef({ onRender, onError });
    // Keep refs updated
    React.useEffect(() => {
        stateRef.current = state;
    }, [state]);
    React.useEffect(() => {
        pricingRef.current = pricing;
    }, [pricing]);
    React.useEffect(() => {
        callbacksRef.current = { onRender, onError };
    }, [onRender, onError]);
    // Render function - uses refs to avoid stale closures
    const performRender = React.useCallback(() => {
        const currentState = stateRef.current;
        const currentPricing = pricingRef.current;
        const { onRender: renderCallback, onError: errorCallback } = callbacksRef.current;
        setState((prev) => ({ ...prev, isRendering: true }));
        try {
            const result = templateEngine.render(currentState.template, {
                variables: currentState.variables,
                trim: true,
                validate: true,
            });
            const tokenCount = estimateTokens(result.prompt);
            const costEstimate = (tokenCount / 1000) * currentPricing.inputCostPer1k;
            setState((prev) => ({
                ...prev,
                output: result.prompt,
                tokenCount,
                costEstimate,
                errors: result.errors || [],
                isRendering: false,
            }));
            if (result.errors && result.errors.length > 0) {
                errorCallback?.(result.errors);
            }
            else {
                renderCallback?.(result);
            }
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setState((prev) => ({
                ...prev,
                errors: [errorMessage],
                isRendering: false,
            }));
            errorCallback?.([errorMessage]);
            return {
                prompt: '',
                usedVariables: [],
                errors: [errorMessage],
                success: false,
            };
        }
    }, [templateEngine]);
    // Auto-render with debounce
    React.useEffect(() => {
        if (!autoRender)
            return;
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            performRender();
        }, debounceMs);
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [state.template, state.variables, autoRender, debounceMs, performRender]);
    // Set template with length validation
    const setTemplate = React.useCallback((template) => {
        const { value: validatedTemplate, truncated } = validateStringLength(template, MAX_TEMPLATE_LENGTH);
        setState((prev) => ({
            ...prev,
            template: validatedTemplate,
            tokenCount: estimateTokens(validatedTemplate),
            errors: truncated
                ? [
                    ...prev.errors.filter((e) => !e.includes('truncated')),
                    'Template was truncated to maximum length',
                ]
                : prev.errors.filter((e) => !e.includes('truncated')),
        }));
    }, []);
    // Validate variable value (truncate strings if too long)
    const validateVariableValue = React.useCallback((value) => {
        if (typeof value === 'string') {
            const { value: validated } = validateStringLength(value, MAX_VARIABLE_VALUE_LENGTH);
            return validated;
        }
        return value;
    }, []);
    // Set single variable with validation
    const setVariable = React.useCallback((name, value) => {
        // Validate variable name (alphanumeric, dots for nested paths)
        if (!/^[\w.]+$/.test(name) || name.length > 128) {
            return; // Silently reject invalid variable names
        }
        const validatedValue = validateVariableValue(value);
        setState((prev) => ({
            ...prev,
            variables: { ...prev.variables, [name]: validatedValue },
        }));
    }, [validateVariableValue]);
    // Set multiple variables with validation
    const setVariables = React.useCallback((variables) => {
        // Filter and validate each variable
        const validatedVars = {};
        for (const [name, value] of Object.entries(variables)) {
            if (/^[\w.]+$/.test(name) && name.length <= 128) {
                validatedVars[name] = validateVariableValue(value);
            }
        }
        setState((prev) => ({
            ...prev,
            variables: { ...prev.variables, ...validatedVars },
        }));
    }, [validateVariableValue]);
    // Extract variables from template
    const extractVariables = React.useCallback(() => {
        return templateEngine.extractVariables(state.template);
    }, [state.template, templateEngine]);
    // Validate template
    const validate = React.useCallback(() => {
        return templateEngine.validate(state.template);
    }, [state.template, templateEngine]);
    // Reset to initial state
    const reset = React.useCallback(() => {
        const templateStr = typeof initialTemplate === 'string'
            ? initialTemplate
            : initialTemplate.template;
        setState({
            template: templateStr,
            variables: initialVariables,
            output: '',
            tokenCount: estimateTokens(templateStr),
            costEstimate: 0,
            errors: [],
            isRendering: false,
        });
    }, [initialTemplate, initialVariables]);
    // Load a template
    const loadTemplate = React.useCallback((template) => {
        const defaultVars = {};
        template.variables?.forEach((v) => {
            if (v.default !== undefined) {
                defaultVars[v.name] = v.default;
            }
        });
        setState({
            template: template.template,
            variables: defaultVars,
            output: '',
            tokenCount: estimateTokens(template.template),
            costEstimate: 0,
            errors: [],
            isRendering: false,
        });
    }, []);
    // Get estimated cost
    const getEstimatedCost = React.useCallback((estimatedOutputTokens = 500) => {
        const inputCost = (state.tokenCount / 1000) * pricing.inputCostPer1k;
        const outputCost = (estimatedOutputTokens / 1000) * pricing.outputCostPer1k;
        return {
            input: inputCost,
            output: outputCost,
            total: inputCost + outputCost,
        };
    }, [state.tokenCount, pricing]);
    // Set model
    const setModel = React.useCallback((modelId) => {
        setCurrentModel(modelId);
    }, []);
    return {
        state,
        setTemplate,
        setVariable,
        setVariables,
        extractVariables,
        render: performRender,
        validate,
        reset,
        loadTemplate,
        getEstimatedCost,
        pricing,
        setModel,
    };
}
export default usePromptPlayground;
//# sourceMappingURL=use-prompt-playground.js.map