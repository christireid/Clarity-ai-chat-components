/**
 * Tracer
 *
 * Track AI interactions and create traces for observability.
 */

import type {
  Trace,
  TraceSpan,
  ObservabilityConfig,
  ObservabilityBackend,
} from './types'

export class Tracer {
  private config: Required<ObservabilityConfig>
  private currentTrace?: Trace
  private spanStack: TraceSpan[] = []

  constructor(config?: ObservabilityConfig) {
    this.config = {
      enabled: config?.enabled ?? true,
      sampleRate: config?.sampleRate ?? 1.0,
      backend: config?.backend || new ConsoleBackend(),
      autoTraceLLM: config?.autoTraceLLM ?? true,
      autoTraceRetrieval: config?.autoTraceRetrieval ?? true,
    }
  }

  /**
   * Start a new trace
   */
  startTrace(name: string, metadata?: Record<string, any>): Trace {
    if (!this.shouldTrace()) {
      return this.createDummyTrace(name)
    }

    const trace: Trace = {
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
    }

    trace.rootSpan.traceId = trace.id
    this.currentTrace = trace
    this.spanStack = [trace.rootSpan]

    return trace
  }

  /**
   * Start a span within current trace
   */
  startSpan(
    name: string,
    type: TraceSpan['type'] = 'custom',
    metadata?: Record<string, any>
  ): TraceSpan {
    if (!this.currentTrace) {
      throw new Error('No active trace. Call startTrace() first.')
    }

    const parentSpan = this.spanStack[this.spanStack.length - 1]

    const span: TraceSpan = {
      id: this.generateId('span'),
      traceId: this.currentTrace.id,
      parentId: parentSpan?.id,
      name,
      type,
      startTime: Date.now(),
      metadata,
    }

    this.currentTrace.spans.push(span)
    this.spanStack.push(span)

    return span
  }

  /**
   * End current span
   */
  endSpan(output?: any, error?: string): void {
    const span = this.spanStack.pop()
    if (!span) return

    span.endTime = Date.now()
    span.duration = span.endTime - span.startTime
    span.output = output
    span.error = error

    if (this.config.backend) {
      this.config.backend.sendSpan(span).catch(console.error)
    }
  }

  /**
   * End current trace
   */
  async endTrace(): Promise<Trace | undefined> {
    if (!this.currentTrace) return undefined

    this.currentTrace.endTime = Date.now()
    this.currentTrace.duration =
      this.currentTrace.endTime - this.currentTrace.startTime

    // Close root span
    if (this.currentTrace.rootSpan) {
      this.currentTrace.rootSpan.endTime = this.currentTrace.endTime
      this.currentTrace.rootSpan.duration = this.currentTrace.duration
    }

    if (this.config.backend) {
      await this.config.backend.sendTrace(this.currentTrace)
    }

    const trace = this.currentTrace
    this.currentTrace = undefined
    this.spanStack = []

    return trace
  }

  /**
   * Wrap a function with automatic tracing
   */
  trace<T>(
    name: string,
    type: TraceSpan['type'] = 'custom'
  ): (fn: () => Promise<T> | T) => Promise<T> {
    return async (fn: () => Promise<T> | T) => {
      const span = this.startSpan(name, type)

      try {
        const result = await fn()
        this.endSpan(result)
        return result
      } catch (error: any) {
        this.endSpan(undefined, error.message)
        throw error
      }
    }
  }

  /**
   * Get current trace
   */
  getCurrentTrace(): Trace | undefined {
    return this.currentTrace
  }

  /**
   * Get current span
   */
  getCurrentSpan(): TraceSpan | undefined {
    return this.spanStack[this.spanStack.length - 1]
  }

  /**
   * Add metadata to current span
   */
  addMetadata(metadata: Record<string, any>): void {
    const span = this.getCurrentSpan()
    if (span) {
      span.metadata = { ...span.metadata, ...metadata }
    }
  }

  /**
   * Add tags to current span
   */
  addTags(tags: string[]): void {
    const span = this.getCurrentSpan()
    if (span) {
      span.tags = [...(span.tags || []), ...tags]
    }
  }

  private shouldTrace(): boolean {
    if (!this.config.enabled) return false
    return Math.random() < this.config.sampleRate
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }

  private createDummyTrace(name: string): Trace {
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
    }
  }
}

/**
 * Console Backend (for development)
 */
export class ConsoleBackend implements ObservabilityBackend {
  name = 'console'

  async sendTrace(trace: Trace): Promise<void> {
    logger.debug('[Trace]', {
      id: trace.id,
      name: trace.name,
      duration: trace.duration,
      spans: trace.spans.length,
    })
  }

  async sendSpan(span: TraceSpan): Promise<void> {
    logger.debug('[Span]', {
      id: span.id,
      name: span.name,
      type: span.type,
      duration: span.duration,
    })
  }

  async sendEvaluation(evaluation: any): Promise<void> {
    logger.debug('[Evaluation]', evaluation)
  }
}

/**
 * Global tracer instance
 */
let globalTracer: Tracer | undefined

/**
 * Get or create global tracer
 */
export function getTracer(config?: ObservabilityConfig): Tracer {
  if (!globalTracer) {
    globalTracer = new Tracer(config)
  }
  return globalTracer
}

/**
 * Set global tracer
 */
export function setTracer(tracer: Tracer): void {
  globalTracer = tracer
}
