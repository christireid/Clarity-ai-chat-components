/**
 * Token Optimization Test Runner
 *
 * Executes test scenarios in baseline and optimized modes,
 * captures measurements, and generates comparison reports.
 */
import type { RunStatistics, RunComparison } from './types';
/**
 * Optimization configuration that matches the enhanced hook options
 */
export interface OptimizationConfig {
    /** Enable TOON format optimization */
    enableToon?: boolean;
    /** Enable prompt compression */
    enablePromptCompression?: boolean;
    /** Compression level */
    compressionLevel?: 'conservative' | 'balanced' | 'aggressive';
    /** Enable history limiting */
    enableHistoryLimiting?: boolean;
    /** Max history messages */
    maxHistoryMessages?: number;
    /** Enable semantic caching */
    enableSemanticCaching?: boolean;
    /** Enable model routing */
    enableModelRouting?: boolean;
    /** Enable response prefilling */
    enablePrefilling?: boolean;
    /** Enable prompt restructuring */
    enablePromptStructure?: boolean;
    /** Enable PII redaction */
    enablePIIRedaction?: boolean;
}
/**
 * LLM provider interface for test runner
 */
export interface LLMProvider {
    /**
     * Send a chat completion request
     */
    chat(messages: Array<{
        role: string;
        content: string;
    }>, options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
        tools?: unknown[];
    }): Promise<{
        content: string;
        usage?: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
        };
        finish_reason?: string;
    }>;
}
/**
 * Test Runner class
 */
export declare class TokenOptimizationTestRunner {
    private harness;
    private provider;
    private model;
    private providerName;
    constructor(config?: {
        outputDir?: string;
        verbose?: boolean;
    });
    /**
     * Set the LLM provider for actual API calls
     */
    setProvider(provider: LLMProvider, providerName?: string): void;
    /**
     * Set the model to use
     */
    setModel(model: string): void;
    /**
     * Run baseline measurements (no optimization)
     */
    runBaseline(scenarioIds?: string[], trialsPerScenario?: number): Promise<RunStatistics>;
    /**
     * Run optimized measurements
     */
    runOptimized(optimizationConfig: OptimizationConfig, scenarioIds?: string[], trialsPerScenario?: number): Promise<RunStatistics>;
    /**
     * Run A/B comparison
     */
    runComparison(optimizationConfig: OptimizationConfig, scenarioIds?: string[], trialsPerScenario?: number): Promise<RunComparison>;
    /**
     * Execute a single scenario
     */
    private executeScenario;
    /**
     * Mock LLM response for testing without API calls
     */
    private mockLLMResponse;
    /**
     * Compare baseline and optimized runs
     */
    private compareRuns;
    /**
     * Print comparison report
     */
    private printComparisonReport;
    /**
     * Export measurements to CSV
     */
    exportToCSV(outputPath: string): void;
    /**
     * Get all measurements
     */
    getMeasurements(): import("./types").TokenMeasurement[];
}
/**
 * Create a test runner instance
 */
export declare function createTestRunner(config?: {
    outputDir?: string;
    verbose?: boolean;
}): TokenOptimizationTestRunner;
//# sourceMappingURL=test-runner.d.ts.map