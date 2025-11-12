/**
 * Token Counter Component
 * Real-time token usage display with cost estimation
 */
interface TokenCounterProps {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number;
    className?: string;
}
export declare function TokenCounter({ promptTokens, completionTokens, totalTokens, estimatedCost, className, }: TokenCounterProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TokenCounter.d.ts.map