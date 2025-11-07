/**
 * Tracer
 *
 * Track AI interactions and create traces for observability.
 */
import type { Trace, TraceSpan, ObservabilityConfig, ObservabilityBackend } from './types';
export declare class Tracer {
    private config;
    private currentTrace?;
    private spanStack;
    constructor(config?: ObservabilityConfig);
    /**
     * Start a new trace
     */
    startTrace(name: string, metadata?: Record<string, any>): Trace;
    /**
     * Start a span within current trace
     */
    startSpan(name: string, type?: TraceSpan['type'], metadata?: Record<string, any>): TraceSpan;
    /**
     * End current span
     */
    endSpan(output?: any, error?: string): void;
    /**
     * End current trace
     */
    endTrace(): Promise<Trace | undefined>;
    /**
     * Wrap a function with automatic tracing
     */
    trace<T>(name: string, type?: TraceSpan['type']): (fn: () => Promise<T> | T) => Promise<T>;
    /**
     * Get current trace
     */
    getCurrentTrace(): Trace | undefined;
    /**
     * Get current span
     */
    getCurrentSpan(): TraceSpan | undefined;
    /**
     * Add metadata to current span
     */
    addMetadata(metadata: Record<string, any>): void;
    /**
     * Add tags to current span
     */
    addTags(tags: string[]): void;
    private shouldTrace;
    private generateId;
    private createDummyTrace;
}
/**
 * Console Backend (for development)
 */
export declare class ConsoleBackend implements ObservabilityBackend {
    name: string;
    sendTrace(trace: Trace): Promise<void>;
    sendSpan(span: TraceSpan): Promise<void>;
    sendEvaluation(evaluation: any): Promise<void>;
}
/**
 * Get or create global tracer
 */
export declare function getTracer(config?: ObservabilityConfig): Tracer;
/**
 * Set global tracer
 */
export declare function setTracer(tracer: Tracer): void;
//# sourceMappingURL=tracer.d.ts.map