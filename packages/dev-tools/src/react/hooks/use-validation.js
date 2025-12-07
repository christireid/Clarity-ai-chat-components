/**
 * React 19 Hook for Validation
 * Uses useState and useCallback for form validation (client-side)
 * Note: Server Actions require Next.js or Remix - using client-side validation here
 */
'use client';
import { useState, useCallback } from 'react';
import { validateEnv, validateAPIKey, validateChatConfig, validateMessages } from '../../validate';
/**
 * Hook for environment validation
 */
export function useEnvValidation() {
    const [result, setResult] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const validate = useCallback(async () => {
        setIsPending(true);
        try {
            // Simulate async for consistency with server actions pattern
            const validationResult = await Promise.resolve(validateEnv());
            setResult(validationResult);
        }
        catch (error) {
            setResult({
                valid: false,
                errors: [{ field: 'validation', message: error.message, severity: 'error' }],
                warnings: [],
            });
        }
        finally {
            setIsPending(false);
        }
    }, []);
    return {
        result,
        isValid: result?.valid ?? false,
        errors: result?.errors ?? [],
        warnings: result?.warnings ?? [],
        isPending,
        validate,
    };
}
/**
 * Hook for API key validation
 */
export function useAPIKeyValidation() {
    const [result, setResult] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const validate = useCallback(async (provider, apiKey) => {
        setIsPending(true);
        try {
            const validationResult = await Promise.resolve(validateAPIKey(provider, apiKey));
            setResult(validationResult);
        }
        catch (error) {
            setResult({
                valid: false,
                errors: [{ field: 'validation', message: error.message, severity: 'error' }],
                warnings: [],
            });
        }
        finally {
            setIsPending(false);
        }
    }, []);
    return {
        result,
        isValid: result?.valid ?? false,
        errors: result?.errors ?? [],
        warnings: result?.warnings ?? [],
        isPending,
        validate,
    };
}
/**
 * Hook for chat config validation
 */
export function useChatConfigValidation() {
    const [result, setResult] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const validate = useCallback(async (config) => {
        setIsPending(true);
        try {
            const validationResult = await Promise.resolve(validateChatConfig(config));
            setResult(validationResult);
        }
        catch (error) {
            setResult({
                valid: false,
                errors: [{ field: 'validation', message: error.message, severity: 'error' }],
                warnings: [],
            });
        }
        finally {
            setIsPending(false);
        }
    }, []);
    return {
        result,
        isValid: result?.valid ?? false,
        errors: result?.errors ?? [],
        warnings: result?.warnings ?? [],
        isPending,
        validate,
    };
}
/**
 * Hook for message validation
 */
export function useMessageValidation() {
    const validate = useCallback((messages) => {
        return validateMessages(messages);
    }, []);
    return {
        validate,
    };
}
//# sourceMappingURL=use-validation.js.map