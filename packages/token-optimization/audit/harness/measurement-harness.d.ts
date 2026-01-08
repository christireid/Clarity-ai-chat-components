/**
 * Token Measurement Harness
 *
 * Captures before/after optimization payloads and compares
 * estimated vs actual provider-billed tokens.
 */
import type { TokenMeasurement, PayloadSnapshot, OptimizationApplied, ProviderTokenUsage, MeasurementRunConfig, RunStatistics } from './types';
/**
 * Configuration for the measurement harness
 */
export interface HarnessConfig {
    /** Output directory for logs */
    outputDir: string;
    /** Whether to log to console */
    verbose: boolean;
    /** Model to use for estimation */
    model: string;
    /** Provider being tested */
    provider: string;
}
/**
 * Measurement context for a single request
 */
export interface MeasurementContext {
    /** Measurement ID */
    id: string;
    /** Scenario ID */
    scenarioId: string;
    /** Turn number */
    turn: number;
    /** Start timestamp */
    startTime: number;
    /** Payload before optimization */
    payloadBefore?: PayloadSnapshot;
    /** Payload after optimization */
    payloadAfter?: PayloadSnapshot;
    /** Optimization details */
    optimization?: OptimizationApplied;
    /** Request parameters */
    requestParams?: {
        temperature?: number;
        maxTokens?: number;
        topP?: number;
        stopSequences?: string[];
        stream?: boolean;
    };
}
/**
 * Token Measurement Harness
 */
export declare class TokenMeasurementHarness {
    private config;
    private measurements;
    private activeMeasurements;
    private logStream;
    private runConfig;
    constructor(config: HarnessConfig);
    /**
     * Start a new measurement run
     */
    startRun(config: MeasurementRunConfig): void;
    /**
     * End the current measurement run and return statistics
     */
    endRun(): RunStatistics;
    /**
     * Begin measuring a request
     */
    beginMeasurement(scenarioId: string, turn: number, messagesBefore: Array<{
        role: string;
        content: string | unknown;
    }>, tools?: unknown[]): string;
    /**
     * Record the payload after optimization
     */
    recordOptimizedPayload(measurementId: string, messagesAfter: Array<{
        role: string;
        content: string | unknown;
    }>, optimization: OptimizationApplied, tools?: unknown[], requestParams?: MeasurementContext['requestParams']): void;
    /**
     * Complete a measurement with provider response
     */
    completeMeasurement(measurementId: string, providerUsage: ProviderTokenUsage | null, response: {
        success: boolean;
        error?: string;
        responseChars?: number;
        finishReason?: string;
    }): TokenMeasurement | null;
    /**
     * Log a measurement to JSONL file
     */
    private logMeasurement;
    /**
     * Calculate statistics for the current run
     */
    private calculateRunStatistics;
    /**
     * Get all measurements for current run
     */
    getMeasurements(): TokenMeasurement[];
    /**
     * Export measurements to CSV
     */
    exportToCSV(outputPath: string): void;
}
/**
 * Create a measurement harness instance
 */
export declare function createMeasurementHarness(config?: Partial<HarnessConfig>): TokenMeasurementHarness;
/**
 * Parse provider response to extract usage
 */
export declare function parseProviderUsage(response: unknown, provider: string): ProviderTokenUsage | null;
//# sourceMappingURL=measurement-harness.d.ts.map