'use client';
import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
/**
 * Copy text to clipboard with success tracking
 *
 * @example
 * ```tsx
 * const { copy, copied } = useClipboard({ timeout: 3000 })
 *
 * return (
 *   <button onClick={() => copy('Hello world')}>
 *     {copied ? 'Copied!' : 'Copy'}
 *   </button>
 * )
 * ```
 */
export function useClipboard(options = {}) {
    const { timeout = 2000, onSuccess, onError } = options;
    const [value, setValue] = useState('');
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef(undefined);
    // Store callbacks in refs to avoid recreating copy function
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    useLayoutEffect(() => {
        onSuccessRef.current = onSuccess;
        onErrorRef.current = onError;
    }, [onSuccess, onError]);
    const copy = useCallback(async (text) => {
        try {
            // Modern clipboard API
            if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            }
            // Fallback for older browsers or non-secure contexts
            else if (typeof document !== 'undefined') {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                }
                finally {
                    textArea.remove();
                }
            }
            else {
                throw new Error('Clipboard API not available');
            }
            setValue(text);
            setCopied(true);
            onSuccessRef.current?.();
            // Reset after timeout
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setCopied(false);
                timeoutRef.current = undefined;
            }, timeout);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Failed to copy');
            onErrorRef.current?.(err);
            throw err;
        }
    }, [timeout] // Callbacks accessed via refs
    );
    const reset = useCallback(() => {
        setCopied(false);
        if (timeoutRef.current !== undefined) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
    }, []);
    useEffect(() => {
        return () => {
            if (timeoutRef.current !== undefined) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return { value, copied, copy, reset };
}
//# sourceMappingURL=use-clipboard.js.map