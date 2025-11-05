export interface UseClipboardOptions {
    /**
     * Timeout in ms before resetting copied state
     * @default 2000
     */
    timeout?: number;
    /**
     * Callback when copy succeeds
     */
    onSuccess?: () => void;
    /**
     * Callback when copy fails
     */
    onError?: (error: Error) => void;
}
export interface UseClipboardReturn {
    /**
     * Current clipboard value
     */
    value: string;
    /**
     * Whether value was recently copied
     */
    copied: boolean;
    /**
     * Copy text to clipboard
     */
    copy: (text: string) => Promise<void>;
    /**
     * Reset copied state
     */
    reset: () => void;
}
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
export declare function useClipboard(options?: UseClipboardOptions): UseClipboardReturn;
//# sourceMappingURL=use-clipboard.d.ts.map