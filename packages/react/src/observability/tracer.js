/**
 * Tracer
 *
 * Track AI interactions and create traces for observability.
 */
export class Tracer {
    config;
    currentTrace;
    spanStack = [];
    constructor(config) {
        this.config = {
            enabled: config?.enabled ?? true,
            sampleRate: config?.sampleRate ?? 1.0,
            backend: config?.backend || new ConsoleBackend(),
            autoTraceLLM: config?.autoTraceLLM ?? true,
            autoTraceRetrieval: config?.autoTraceRetrieval ?? true,
        };
    }
    /**
     * Start a new trace
     */
    startTrace(name, metadata) {
        if (!this.shouldTrace()) {
            return this.createDummyTrace(name);
        }
        const trace = {
            id: this.generateId('trace'),
            name,
            rootSpan: {
                id: this.generateId('span'),
                traceId: '',
                name,
                type: 'chain',
                startTime: Date.now(),
            },
            spans: [],
            startTime: Date.now(),
            metadata,
        };
        trace.rootSpan.traceId = trace.id;
        this.currentTrace = trace;
        this.spanStack = [trace.rootSpan];
        return trace;
    }
    /**
     * Start a span within current trace
     */
    startSpan(name, type = 'custom', metadata) {
        if (!this.currentTrace) {
            throw new Error('No active trace. Call startTrace() first.');
        }
        const parentSpan = this.spanStack[this.spanStack.length - 1];
        const span = {
            id: this.generateId('span'),
            traceId: this.currentTrace.id,
            parentId: parentSpan?.id,
            name,
            type,
            startTime: Date.now(),
            metadata,
        };
        this.currentTrace.spans.push(span);
        this.spanStack.push(span);
        return span;
    }
    /**
     * End current span
     */
    endSpan(output, error) {
        const span = this.spanStack.pop();
        if (!span)
            return;
        span.endTime = Date.now();
        span.duration = span.endTime - span.startTime;
        span.output = output;
        span.error = error;
        if (this.config.backend) {
            this.config.backend.sendSpan(span).catch(console.error);
        }
    }
    /**
     * End current trace
     */
    async endTrace() {
        if (!this.currentTrace)
            return undefined;
        this.currentTrace.endTime = Date.now();
        this.currentTrace.duration =
            this.currentTrace.endTime - this.currentTrace.startTime;
        // Close root span
        if (this.currentTrace.rootSpan) {
            this.currentTrace.rootSpan.endTime = this.currentTrace.endTime;
            this.currentTrace.rootSpan.duration = this.currentTrace.duration;
        }
        if (this.config.backend) {
            await this.config.backend.sendTrace(this.currentTrace);
        }
        const trace = this.currentTrace;
        this.currentTrace = undefined;
        this.spanStack = [];
        return trace;
    }
    /**
     * Wrap a function with automatic tracing
     */
    trace(name, type = 'custom') {
        return async (fn) => {
            const span = this.startSpan(name, type);
            try {
                const result = await fn();
                this.endSpan(result);
                return result;
            }
            catch (error) {
                this.endSpan(undefined, error.message);
                throw error;
            }
        };
    }
    /**
     * Get current trace
     */
    getCurrentTrace() {
        return this.currentTrace;
    }
    /**
     * Get current span
     */
    getCurrentSpan() {
        return this.spanStack[this.spanStack.length - 1];
    }
    /**
     * Add metadata to current span
     */
    addMetadata(metadata) {
        const span = this.getCurrentSpan();
        if (span) {
            span.metadata = { ...span.metadata, ...metadata };
        }
    }
    /**
     * Add tags to current span
     */
    addTags(tags) {
        const span = this.getCurrentSpan();
        if (span) {
            span.tags = [...(span.tags || []), ...tags];
        }
    }
    shouldTrace() {
        if (!this.config.enabled)
            return false;
        return Math.random() < this.config.sampleRate;
    }
    generateId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }
    createDummyTrace(name) {
        return {
            id: 'dummy',
            name,
            rootSpan: {
                id: 'dummy',
                traceId: 'dummy',
                name,
                type: 'chain',
                startTime: Date.now(),
            },
            spans: [],
            startTime: Date.now(),
        };
    }
}
/**
 * Console Backend (for development)
 */
export class ConsoleBackend {
    name = 'console';
    async sendTrace(trace) {
        console.log('[Trace]', {
            id: trace.id,
            name: trace.name,
            duration: trace.duration,
            spans: trace.spans.length,
        });
    }
    async sendSpan(span) {
        console.log('[Span]', {
            id: span.id,
            name: span.name,
            type: span.type,
            duration: span.duration,
        });
    }
    async sendEvaluation(evaluation) {
        console.log('[Evaluation]', evaluation);
    }
}
/**
 * Global tracer instance
 */
let globalTracer;
/**
 * Get or create global tracer
 */
export function getTracer(config) {
    if (!globalTracer) {
        globalTracer = new Tracer(config);
    }
    return globalTracer;
}
/**
 * Set global tracer
 */
export function setTracer(tracer) {
    globalTracer = tracer;
}
//# sourceMappingURL=tracer.js.map