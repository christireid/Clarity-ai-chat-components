/**
 * Token Measurement Harness
 *
 * Captures before/after optimization payloads and compares
 * estimated vs actual provider-billed tokens.
 */
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { estimateTokens, createPayloadSnapshot, calculateSavings, } from './token-estimator';
/**
 * Token Measurement Harness
 */
export class TokenMeasurementHarness {
    config;
    measurements = [];
    activeMeasurements = new Map();
    logStream = null;
    runConfig = null;
    constructor(config) {
        this.config = config;
        // Ensure output directory exists
        if (!fs.existsSync(config.outputDir)) {
            fs.mkdirSync(config.outputDir, { recursive: true });
        }
    }
    /**
     * Start a new measurement run
     */
    startRun(config) {
        this.runConfig = config;
        this.measurements = [];
        // Create log file for this run
        const logPath = path.join(this.config.outputDir, `run_${config.runId}_${config.mode}_${Date.now()}.jsonl`);
        this.logStream = fs.createWriteStream(logPath, { flags: 'a' });
        if (this.config.verbose) {
            console.log(`[TokenHarness] Starting ${config.mode} run: ${config.runId}`);
            console.log(`[TokenHarness] Logging to: ${logPath}`);
        }
    }
    /**
     * End the current measurement run and return statistics
     */
    endRun() {
        if (this.logStream) {
            this.logStream.end();
            this.logStream = null;
        }
        const stats = this.calculateRunStatistics();
        if (this.config.verbose) {
            console.log(`[TokenHarness] Run complete. ${this.measurements.length} measurements.`);
            console.log(`[TokenHarness] Mean estimated input: ${stats.tokens.meanEstimatedInput.toFixed(1)}`);
            if (stats.tokens.meanActualInput !== undefined) {
                console.log(`[TokenHarness] Mean actual input: ${stats.tokens.meanActualInput.toFixed(1)}`);
                console.log(`[TokenHarness] Estimation error: ${stats.tokens.estimationErrorPercent?.toFixed(1)}%`);
            }
        }
        return stats;
    }
    /**
     * Begin measuring a request
     */
    beginMeasurement(scenarioId, turn, messagesBefore, tools) {
        const id = randomUUID();
        const context = {
            id,
            scenarioId,
            turn,
            startTime: Date.now(),
            payloadBefore: createPayloadSnapshot(messagesBefore, this.config.model, tools),
        };
        this.activeMeasurements.set(id, context);
        if (this.config.verbose) {
            console.log(`[TokenHarness] Begin measurement ${id} - Scenario: ${scenarioId}, Turn: ${turn}`);
            console.log(`[TokenHarness] Before: ${context.payloadBefore?.totalEstimatedTokens} estimated tokens`);
        }
        return id;
    }
    /**
     * Record the payload after optimization
     */
    recordOptimizedPayload(measurementId, messagesAfter, optimization, tools, requestParams) {
        const context = this.activeMeasurements.get(measurementId);
        if (!context) {
            console.warn(`[TokenHarness] Unknown measurement ID: ${measurementId}`);
            return;
        }
        context.payloadAfter = createPayloadSnapshot(messagesAfter, this.config.model, tools);
        context.optimization = optimization;
        context.requestParams = requestParams;
        if (this.config.verbose) {
            const savings = calculateSavings(context.payloadBefore, context.payloadAfter);
            console.log(`[TokenHarness] After: ${context.payloadAfter.totalEstimatedTokens} estimated tokens`);
            console.log(`[TokenHarness] Estimated savings: ${savings.tokensSaved} tokens (${savings.percentSaved.toFixed(1)}%)`);
        }
    }
    /**
     * Complete a measurement with provider response
     */
    completeMeasurement(measurementId, providerUsage, response) {
        const context = this.activeMeasurements.get(measurementId);
        if (!context) {
            console.warn(`[TokenHarness] Unknown measurement ID: ${measurementId}`);
            return null;
        }
        this.activeMeasurements.delete(measurementId);
        const endTime = Date.now();
        const totalMs = endTime - context.startTime;
        // Calculate estimated tokens
        const estimated = {
            promptTokens: context.payloadAfter?.totalEstimatedTokens || 0,
            completionTokens: response.responseChars
                ? estimateTokens(String(response.responseChars), this.config.model)
                    .tokens
                : 0,
            totalTokens: 0,
            method: 'char-ratio', // Will be updated based on actual method
        };
        estimated.totalTokens = estimated.promptTokens + estimated.completionTokens;
        // Calculate deltas
        const beforeTokens = context.payloadBefore?.totalEstimatedTokens || 0;
        const afterTokens = context.payloadAfter?.totalEstimatedTokens || 0;
        const optimizationSavingsEstimated = beforeTokens - afterTokens;
        const delta = {
            inputEstimateError: providerUsage
                ? estimated.promptTokens - providerUsage.promptTokens
                : undefined,
            optimizationSavingsEstimated,
            optimizationSavingsActual: providerUsage
                ? beforeTokens - providerUsage.promptTokens
                : undefined,
            optimizationEffective: providerUsage
                ? providerUsage.promptTokens < beforeTokens
                : undefined,
        };
        const measurement = {
            id: measurementId,
            timestamp: new Date().toISOString(),
            scenarioId: context.scenarioId,
            turn: context.turn,
            model: this.config.model,
            provider: this.config.provider,
            request: context.requestParams || {},
            payloadBefore: context.payloadBefore,
            payloadAfter: context.payloadAfter,
            optimization: context.optimization || {
                enabled: false,
                techniques: [],
                estimatedTotalSaved: 0,
            },
            estimated,
            actual: providerUsage || undefined,
            timing: {
                totalMs,
                optimizationMs: 0, // Would need to instrument optimization timing
            },
            response,
            delta,
        };
        // Store and log
        this.measurements.push(measurement);
        this.logMeasurement(measurement);
        if (this.config.verbose) {
            if (providerUsage) {
                console.log(`[TokenHarness] Actual provider tokens: ${providerUsage.promptTokens} input, ${providerUsage.completionTokens} output`);
                console.log(`[TokenHarness] Estimation error: ${delta.inputEstimateError} tokens (${(((delta.inputEstimateError || 0) / providerUsage.promptTokens) * 100).toFixed(1)}%)`);
                console.log(`[TokenHarness] Optimization effective: ${delta.optimizationEffective ? 'YES' : 'NO'}`);
            }
            else {
                console.log(`[TokenHarness] No provider usage data available`);
            }
        }
        return measurement;
    }
    /**
     * Log a measurement to JSONL file
     */
    logMeasurement(measurement) {
        if (this.logStream) {
            this.logStream.write(JSON.stringify(measurement) + '\n');
        }
    }
    /**
     * Calculate statistics for the current run
     */
    calculateRunStatistics() {
        if (!this.runConfig) {
            throw new Error('No run in progress');
        }
        const successful = this.measurements.filter((m) => m.response.success);
        // Token stats
        const estimatedInputs = successful.map((m) => m.estimated.promptTokens);
        const actualInputs = successful
            .filter((m) => m.actual)
            .map((m) => m.actual.promptTokens);
        // Timing stats
        const latencies = successful.map((m) => m.timing.totalMs);
        const optimizationTimes = successful.map((m) => m.timing.optimizationMs);
        // Errors
        const errors = this.measurements
            .filter((m) => !m.response.success)
            .map((m) => ({
            scenarioId: m.scenarioId,
            turn: m.turn,
            error: m.response.error || 'Unknown error',
        }));
        // Calculate optimization savings
        const estimatedSavings = successful.reduce((sum, m) => sum + m.delta.optimizationSavingsEstimated, 0);
        const actualSavings = successful
            .filter((m) => m.delta.optimizationSavingsActual !== undefined)
            .reduce((sum, m) => sum + m.delta.optimizationSavingsActual, 0);
        const beforeTokens = successful.reduce((sum, m) => sum + m.payloadBefore.totalEstimatedTokens, 0);
        return {
            config: this.runConfig,
            totalMeasurements: this.measurements.length,
            successfulMeasurements: successful.length,
            tokens: {
                meanEstimatedInput: mean(estimatedInputs),
                medianEstimatedInput: median(estimatedInputs),
                p90EstimatedInput: percentile(estimatedInputs, 90),
                p99EstimatedInput: percentile(estimatedInputs, 99),
                meanActualInput: actualInputs.length > 0 ? mean(actualInputs) : undefined,
                medianActualInput: actualInputs.length > 0 ? median(actualInputs) : undefined,
                p90ActualInput: actualInputs.length > 0 ? percentile(actualInputs, 90) : undefined,
                estimationErrorPercent: actualInputs.length > 0
                    ? (Math.abs(mean(estimatedInputs) - mean(actualInputs)) /
                        mean(actualInputs)) *
                        100
                    : undefined,
            },
            optimization: {
                totalEstimatedSaved: estimatedSavings,
                totalActualSaved: actualSavings || undefined,
                reductionPercentEstimated: beforeTokens > 0 ? (estimatedSavings / beforeTokens) * 100 : 0,
                reductionPercentActual: beforeTokens > 0 && actualSavings
                    ? (actualSavings / beforeTokens) * 100
                    : undefined,
                wasEffective: actualSavings !== undefined ? actualSavings > 0 : undefined,
            },
            timing: {
                meanLatencyMs: mean(latencies),
                p90LatencyMs: percentile(latencies, 90),
                meanOptimizationMs: mean(optimizationTimes),
            },
            errors,
        };
    }
    /**
     * Get all measurements for current run
     */
    getMeasurements() {
        return [...this.measurements];
    }
    /**
     * Export measurements to CSV
     */
    exportToCSV(outputPath) {
        const headers = [
            'id',
            'timestamp',
            'scenarioId',
            'turn',
            'model',
            'provider',
            'estimatedInputTokens',
            'actualInputTokens',
            'estimatedOutputTokens',
            'actualOutputTokens',
            'optimizationEnabled',
            'techniquesApplied',
            'estimatedSavings',
            'actualSavings',
            'optimizationEffective',
            'latencyMs',
            'success',
            'error',
        ];
        const rows = this.measurements.map((m) => [
            m.id,
            m.timestamp,
            m.scenarioId,
            m.turn,
            m.model,
            m.provider,
            m.estimated.promptTokens,
            m.actual?.promptTokens ?? '',
            m.estimated.completionTokens,
            m.actual?.completionTokens ?? '',
            m.optimization.enabled,
            m.optimization.techniques
                .filter((t) => t.applied)
                .map((t) => t.name)
                .join(';'),
            m.delta.optimizationSavingsEstimated,
            m.delta.optimizationSavingsActual ?? '',
            m.delta.optimizationEffective ?? '',
            m.timing.totalMs,
            m.response.success,
            m.response.error ?? '',
        ]);
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        fs.writeFileSync(outputPath, csv);
        if (this.config.verbose) {
            console.log(`[TokenHarness] Exported ${rows.length} measurements to ${outputPath}`);
        }
    }
}
// Statistical helper functions
function mean(values) {
    if (values.length === 0)
        return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
}
function median(values) {
    if (values.length === 0)
        return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}
function percentile(values, p) {
    if (values.length === 0)
        return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
}
/**
 * Create a measurement harness instance
 */
export function createMeasurementHarness(config = {}) {
    const defaultConfig = {
        outputDir: path.join(process.cwd(), 'packages/token-optimization/audit/output'),
        verbose: true,
        model: 'gpt-4',
        provider: 'openai',
        ...config,
    };
    return new TokenMeasurementHarness(defaultConfig);
}
/**
 * Parse provider response to extract usage
 */
export function parseProviderUsage(response, provider) {
    if (!response || typeof response !== 'object')
        return null;
    const r = response;
    // OpenAI format
    if (provider === 'openai' && r.usage && typeof r.usage === 'object') {
        const usage = r.usage;
        return {
            promptTokens: usage.prompt_tokens || 0,
            completionTokens: usage.completion_tokens || 0,
            totalTokens: usage.total_tokens || 0,
        };
    }
    // Anthropic format
    if (provider === 'anthropic' && r.usage && typeof r.usage === 'object') {
        const usage = r.usage;
        return {
            promptTokens: usage.input_tokens || 0,
            completionTokens: usage.output_tokens || 0,
            totalTokens: (usage.input_tokens || 0) + (usage.output_tokens || 0),
            cachedTokens: usage.cache_read_input_tokens,
        };
    }
    // Google/Gemini format
    if (provider === 'google' &&
        r.usageMetadata &&
        typeof r.usageMetadata === 'object') {
        const usage = r.usageMetadata;
        return {
            promptTokens: usage.promptTokenCount || 0,
            completionTokens: usage.candidatesTokenCount || 0,
            totalTokens: usage.totalTokenCount || 0,
        };
    }
    return null;
}
//# sourceMappingURL=measurement-harness.js.map