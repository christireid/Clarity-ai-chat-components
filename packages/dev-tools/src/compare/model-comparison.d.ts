/**
 * AI Model Response Comparison Tools
 * Compare responses from different AI models to help developers choose the right model
 */
export interface ModelResponse {
    model: string;
    provider: string;
    content: string;
    metadata: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
        latency: number;
        cost: number;
    };
    timestamp: Date;
}
export interface ComparisonResult {
    prompt: string;
    responses: ModelResponse[];
    analysis: {
        fastest: string;
        cheapest: string;
        mostTokens: string;
        averageLatency: number;
        totalCost: number;
        recommendations: string[];
    };
}
/**
 * Compare responses from multiple models
 */
export declare class ModelComparator {
    private responses;
    /**
     * Add a response for comparison
     */
    addResponse(promptId: string, response: ModelResponse): void;
    /**
     * Compare all responses for a prompt
     */
    compare(promptId: string, prompt: string): ComparisonResult | null;
    /**
     * Generate recommendations based on comparison
     */
    private generateRecommendations;
    /**
     * Export comparison results to JSON
     */
    exportResults(): string;
    /**
     * Clear all stored responses
     */
    clear(): void;
}
/**
 * Side-by-side comparison formatter
 */
export declare function formatSideBySide(result: ComparisonResult): string;
/**
 * Quality scorer for responses
 */
export interface QualityMetrics {
    coherence: number;
    completeness: number;
    relevance: number;
    overall: number;
}
export declare function scoreResponseQuality(prompt: string, response: string, expectedKeywords?: string[]): QualityMetrics;
/**
 * Batch comparison helper
 */
export declare function compareModels(prompt: string, modelConfigs: Array<{
    provider: string;
    model: string;
    apiCall: () => Promise<any>;
}>, options?: {
    calculateCost?: (usage: any) => number;
    expectedKeywords?: string[];
}): Promise<ComparisonResult>;
//# sourceMappingURL=model-comparison.d.ts.map