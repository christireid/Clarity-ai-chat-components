/**
 * Observability & Evaluation
 *
 * Track, trace, and evaluate AI interactions for production monitoring.
 *
 * @example
 * ```tsx
 * import { Tracer, getTracer } from '@clarity-chat/react'
 *
 * // Create tracer
 * const tracer = new Tracer({
 *   enabled: true,
 *   sampleRate: 1.0,
 * })
 *
 * // Trace an operation
 * const trace = tracer.startTrace('chat-completion')
 * const llmSpan = tracer.startSpan('openai-call', 'llm')
 *
 * try {
 *   const response = await openai.chat.completions.create(...)
 *   tracer.endSpan(response)
 * } catch (error) {
 *   tracer.endSpan(undefined, error.message)
 * }
 *
 * await tracer.endTrace()
 *
 * // Or use automatic tracing
 * const result = await tracer.trace('my-operation', 'custom')(
 *   async () => {
 *     return await doSomething()
 *   }
 * )
 * ```
 */
export * from './types';
export * from './tracer';
//# sourceMappingURL=index.d.ts.map