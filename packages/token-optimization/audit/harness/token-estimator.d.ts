/**
 * Token Estimation for Audit Harness
 *
 * Provides consistent token estimation across the audit framework.
 * Uses gpt-tokenizer for GPT models, heuristics for others.
 */
export interface TokenEstimate {
    /** Estimated token count */
    tokens: number;
    /** Method used */
    method: 'gpt-tokenizer' | 'char-ratio';
    /** Chars per token ratio used (if char-ratio method) */
    charsPerToken?: number;
    /** Confidence level */
    confidence: 'exact' | 'high' | 'approximate';
}
/**
 * Estimate tokens for text using the most accurate method available
 */
export declare function estimateTokens(text: string, model: string): TokenEstimate;
/**
 * Estimate tokens for a message array (includes overhead per message)
 */
export declare function estimateMessagesTokens(messages: Array<{
    role: string;
    content: string | unknown;
}>, model: string): TokenEstimate;
/**
 * Create a PayloadSnapshot from messages
 */
export declare function createPayloadSnapshot(messages: Array<{
    role: string;
    content: string | unknown;
}>, model: string, tools?: unknown[]): {
    messages: Array<{
        role: string;
        content: string | unknown;
        contentString: string;
        charCount: number;
        estimatedTokens: number;
    }>;
    systemPrompt?: string;
    totalChars: number;
    totalEstimatedTokens: number;
    toolsJson?: string;
    toolsEstimatedTokens?: number;
};
/**
 * Calculate token savings between before and after snapshots
 */
export declare function calculateSavings(before: {
    totalEstimatedTokens: number;
    toolsEstimatedTokens?: number;
}, after: {
    totalEstimatedTokens: number;
    toolsEstimatedTokens?: number;
}): {
    tokensSaved: number;
    percentSaved: number;
};
//# sourceMappingURL=token-estimator.d.ts.map