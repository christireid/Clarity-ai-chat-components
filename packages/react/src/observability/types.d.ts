/**
 * Observability Types
 *
 * Track, trace, and evaluate AI interactions.
 * Bring your own backend (LangSmith, Helicone, etc.) or use simple logging.
 */
export interface TraceSpan {
    /** Span ID */
    id: string;
    /** Parent span ID */
    parentId?: string;
    /** Trace ID (groups related spans) */
    traceId: string;
    /** Span name */
    name: string;
    /** Span type */
    type: 'llm' | 'chain' | 'tool' | 'retrieval' | 'custom';
    /** Start time */
    startTime: number;
    /** End time */
    endTime?: number;
    /** Duration in ms */
    duration?: number;
    /** Input data */
    input?: any;
    /** Output data */
    output?: any;
    /** Metadata */
    metadata?: Record<string, any>;
    /** Error if failed */
    error?: string;
    /** Tags */
    tags?: string[];
}
export interface LLMSpan extends TraceSpan {
    type: 'llm';
    /** Model used */
    model: string;
    /** Provider */
    provider: string;
    /** Tokens used */
    tokens?: {
        prompt: number;
        completion: number;
        total: number;
    };
    /** Cost in USD */
    cost?: number;
    /** Temperature */
    temperature?: number;
}
export interface ChainSpan extends TraceSpan {
    type: 'chain';
    /** Steps in the chain */
    steps: TraceSpan[];
}
export interface ToolSpan extends TraceSpan {
    type: 'tool';
    /** Tool name */
    toolName: string;
    /** Tool arguments */
    arguments: Record<string, any>;
    /** Tool result */
    result: any;
}
export interface RetrievalSpan extends TraceSpan {
    type: 'retrieval';
    /** Query */
    query: string;
    /** Number of results */
    resultCount: number;
    /** Retrieved documents */
    documents: Array<{
        id: string;
        score: number;
        content: string;
    }>;
}
export interface Trace {
    /** Trace ID */
    id: string;
    /** Trace name */
    name: string;
    /** Root span */
    rootSpan: TraceSpan;
    /** All spans */
    spans: TraceSpan[];
    /** Start time */
    startTime: number;
    /** End time */
    endTime?: number;
    /** Duration */
    duration?: number;
    /** User ID */
    userId?: string;
    /** Session ID */
    sessionId?: string;
    /** Metadata */
    metadata?: Record<string, any>;
    /** Tags */
    tags?: string[];
}
export interface EvaluationMetric {
    /** Metric name */
    name: string;
    /** Metric value */
    value: number;
    /** Metric type */
    type: 'accuracy' | 'relevance' | 'coherence' | 'toxicity' | 'custom';
    /** Threshold for passing */
    threshold?: number;
    /** Whether metric passed threshold */
    passed?: boolean;
}
export interface EvaluationResult {
    /** Evaluation ID */
    id: string;
    /** Trace ID being evaluated */
    traceId: string;
    /** Metrics */
    metrics: EvaluationMetric[];
    /** Overall score */
    overallScore: number;
    /** Whether evaluation passed */
    passed: boolean;
    /** Feedback */
    feedback?: string;
    /** Timestamp */
    timestamp: number;
}
export interface ObservabilityConfig {
    /** Enable tracing */
    enabled?: boolean;
    /** Sample rate (0-1) */
    sampleRate?: number;
    /** Backend to send traces to */
    backend?: ObservabilityBackend;
    /** Auto-trace LLM calls */
    autoTraceLLM?: boolean;
    /** Auto-trace retrievals */
    autoTraceRetrieval?: boolean;
}
export interface ObservabilityBackend {
    /** Backend name */
    name: string;
    /** Send trace to backend */
    sendTrace(trace: Trace): Promise<void>;
    /** Send span to backend */
    sendSpan(span: TraceSpan): Promise<void>;
    /** Send evaluation */
    sendEvaluation(evaluation: EvaluationResult): Promise<void>;
}
//# sourceMappingURL=types.d.ts.map