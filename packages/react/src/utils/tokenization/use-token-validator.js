import { useState, useCallback, useMemo } from 'react';
import { InputValidator } from './input-validator';
/**
 * Hook for token validation with React integration
 *
 * Provides convenient validation utilities for token optimization operations
 * with built-in state management and error handling.
 *
 * @example
 * ```typescript
 * const { validateText, validateModel, validateBudget, validationState } = useTokenValidator();
 *
 * // Validate text input
 * const textResult = validateText(userInput, { maxLength: 1000 });
 * if (!textResult.valid) {
 *   setError(textResult.errors.join(', '));
 * }
 *
 * // Validate model selection
 * const modelResult = validateModel(selectedModel);
 * if (!modelResult.valid) {
 *   setModelError(modelResult.errors.join(', '));
 * }
 * ```
 */
export function useTokenValidator() {
    const [validationState, setValidationState] = useState({});
    /**
     * Validate text input with memoized function
     */
    const validateText = useCallback((text, constraints) => {
        const result = InputValidator.validateTextInput(text, constraints);
        setValidationState((prev) => ({ ...prev, text: result }));
        return result;
    }, []);
    /**
     * Validate model name with memoized function
     */
    const validateModel = useCallback((model) => {
        const result = InputValidator.validateModel(model);
        setValidationState((prev) => ({ ...prev, model: result }));
        return result;
    }, []);
    /**
     * Validate budget with memoized function
     */
    const validateBudget = useCallback((budget) => {
        const result = InputValidator.validateBudget(budget);
        setValidationState((prev) => ({ ...prev, budget: result }));
        return result;
    }, []);
    /**
     * Validate optimization configuration
     */
    const validateConfig = useCallback((config) => {
        const result = InputValidator.validateOptimizationConfig(config);
        setValidationState((prev) => ({ ...prev, config: result }));
        return result;
    }, []);
    /**
     * Validate compression ratio
     */
    const validateCompressionRatio = useCallback((ratio) => {
        return InputValidator.validateCompressionRatio(ratio);
    }, []);
    /**
     * Validate quality threshold
     */
    const validateQualityThreshold = useCallback((threshold) => {
        return InputValidator.validateQualityThreshold(threshold);
    }, []);
    /**
     * Clear validation state
     */
    const clearValidation = useCallback(() => {
        setValidationState({});
    }, []);
    /**
     * Check if all validations are passing
     */
    const isValid = useMemo(() => {
        return Object.values(validationState).every((result) => result?.valid !== false);
    }, [validationState]);
    /**
     * Get all validation errors
     */
    const allErrors = useMemo(() => {
        return Object.values(validationState)
            .filter((result) => result?.valid === false)
            .flatMap((result) => result.errors || []);
    }, [validationState]);
    /**
     * Get all validation warnings
     */
    const allWarnings = useMemo(() => {
        return Object.values(validationState)
            .filter((result) => result?.warnings !== undefined)
            .flatMap((result) => result.warnings || []);
    }, [validationState]);
    return {
        // Validation functions
        validateText,
        validateModel,
        validateBudget,
        validateConfig,
        validateCompressionRatio,
        validateQualityThreshold,
        // State management
        validationState,
        clearValidation,
        // Convenience getters
        isValid,
        allErrors,
        allWarnings,
        // Individual validation results
        textValidation: validationState.text,
        modelValidation: validationState.model,
        budgetValidation: validationState.budget,
        configValidation: validationState.config,
    };
}
/**
 * Hook for token validation with automatic re-validation on dependency changes
 *
 * @param dependencies - Values that should trigger re-validation
 */
export function useAutoTokenValidator(dependencies = []) {
    const validator = useTokenValidator();
    // Auto-validate when dependencies change
    // This is a placeholder for more complex auto-validation logic
    // In a real implementation, you might want to validate specific fields
    // based on the dependencies that changed
    return validator;
}
//# sourceMappingURL=use-token-validator.js.map