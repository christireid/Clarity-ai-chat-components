'use client';
import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react';
/**
 * Custom hook for managing submit button state
 *
 * @example
 * ```tsx
 * const { buttonState, handleSubmit } = useSubmitButtonState({
 *   onSubmit: async (value) => {
 *     await sendMessage(value)
 *   },
 *   value: inputValue,
 *   disabled: isLoading,
 *   isOverLimit: counter.isOverLimit
 * })
 * ```
 */
export function useSubmitButtonState({ onSubmit, value, disabled = false, isOverLimit = false, }) {
    const [buttonState, setButtonState] = React.useState('idle');
    const timeoutRef = React.useRef(undefined);
    const resetState = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setButtonState('idle');
    }, []);
    const handleSubmit = React.useCallback(async () => {
        if (!value.trim() || isOverLimit || disabled || buttonState === 'loading')
            return;
        setButtonState('loading');
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        try {
            await onSubmit(value);
            setButtonState('success');
            // Auto-reset after showing success
            timeoutRef.current = setTimeout(() => {
                setButtonState('idle');
            }, 1000);
        }
        catch (error) {
            setButtonState('error');
            logger.error('[ChatInput] Submit error:', error);
            // Auto-reset after showing error
            timeoutRef.current = setTimeout(() => {
                setButtonState('idle');
            }, 2000);
        }
    }, [value, isOverLimit, disabled, buttonState, onSubmit]);
    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return {
        buttonState,
        handleSubmit,
        resetState,
    };
}
//# sourceMappingURL=use-submit-button-state.js.map