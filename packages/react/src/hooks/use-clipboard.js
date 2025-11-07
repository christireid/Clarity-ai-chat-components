import * as React from 'react';
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
    const [value, setValue] = React.useState('');
    const [copied, setCopied] = React.useState(false);
    const timeoutRef = React.useRef();
    const copy = React.useCallback(async (text) => {
        try {
            // Modern clipboard API
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            }
            // Fallback for older browsers
            else {
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
            setValue(text);
            setCopied(true);
            onSuccess?.();
            // Reset after timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, timeout);
        }
        catch (error) {
            const err = error instanceof Error ? error : new Error('Failed to copy');
            onError?.(err);
            throw err;
        }
    }, [timeout, onSuccess, onError]);
    const reset = React.useCallback(() => {
        setCopied(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);
    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return { value, copied, copy, reset };
}
//# sourceMappingURL=use-clipboard.js.map