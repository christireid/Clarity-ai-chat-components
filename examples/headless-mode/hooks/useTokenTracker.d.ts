/**
 * Pricing per 1K tokens (as of Dec 2024)
 */
declare const MODEL_PRICING: {
    readonly 'gpt-4-turbo': {
        readonly input: 0.01;
        readonly output: 0.03;
    };
    readonly 'gpt-4o': {
        readonly input: 0.0025;
        readonly output: 0.01;
    };
    readonly 'gpt-3.5-turbo': {
        readonly input: 0.0005;
        readonly output: 0.0015;
    };
    readonly claude: {
        readonly input: 0.008;
        readonly output: 0.024;
    };
};
export type ModelKey = keyof typeof MODEL_PRICING;
/**
 * Simple token estimation based on character count.
 * For production, use a proper tokenizer like tiktoken.
 */
export declare function estimateTokens(text: string): number;
/**
 * Custom hook for tracking token usage and estimating costs.
 *
 * @example
 * ```tsx
 * const { totalTokens, estimatedCost, trackTokens } = useTokenTracker('gpt-4-turbo')
 *
 * // Track user message
 * const userTokens = estimateTokens(input)
 * trackTokens(userTokens, 'input')
 *
 * // Track AI response
 * const responseTokens = estimateTokens(response)
 * trackTokens(responseTokens, 'output')
 * ```
 */
export declare function useTokenTracker(model?: ModelKey): {
    totalTokens: any;
    estimatedCost: number;
    trackTokens: any;
    resetTokens: any;
    total: any;
};
export {};
//# sourceMappingURL=useTokenTracker.d.ts.map