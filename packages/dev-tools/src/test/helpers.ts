/**
 * Test helper utilities
 * 
 * Provides utilities for testing AI chat applications:
 * - Assertion helpers
 * - Response validation
 * - Token usage testing
 * - Streaming test helpers
 */

/**
 * Assert that a value is truthy
 */
export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed')
  }
}

/**
 * Assert equality
 */
export function assertEqual<T>(actual: T, expected: T, message?: string): void {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    )
  }
}

/**
 * Assert deep equality
 */
export function assertDeepEqual<T>(actual: T, expected: T, message?: string): void {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  
  if (actualStr !== expectedStr) {
    throw new Error(
      message || `Expected ${expectedStr}, got ${actualStr}`
    )
  }
}

/**
 * Assert that a function throws an error
 */
export async function assertThrows(
  fn: () => any | Promise<any>,
  errorType?: new (...args: any[]) => Error,
  message?: string
): Promise<void> {
  let thrown = false
  
  try {
    await fn()
  } catch (error) {
    thrown = true
    
    if (errorType && !(error instanceof errorType)) {
      throw new Error(
        `Expected error of type ${errorType.name}, got ${(error as Error).constructor.name}`
      )
    }
  }
  
  if (!thrown) {
    throw new Error(message || 'Expected function to throw an error')
  }
}

/**
 * Assert that a value matches a pattern
 */
export function assertMatches(actual: string, pattern: RegExp, message?: string): void {
  if (!pattern.test(actual)) {
    throw new Error(
      message || `Expected "${actual}" to match ${pattern}`
    )
  }
}

/**
 * Assert that an array contains a value
 */
export function assertIncludes<T>(array: T[], value: T, message?: string): void {
  if (!array.includes(value)) {
    throw new Error(
      message || `Expected array to include ${JSON.stringify(value)}`
    )
  }
}

/**
 * Validate chat response structure
 */
export function validateChatResponse(response: any): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check required fields
  if (!response) {
    errors.push('Response is null or undefined')
    return { valid: false, errors }
  }

  if (typeof response !== 'object') {
    errors.push('Response must be an object')
    return { valid: false, errors }
  }

  // Check content
  if (!response.content && !response.choices?.[0]?.message?.content) {
    errors.push('Response must have content field')
  }

  // Check model
  if (!response.model) {
    errors.push('Response must have model field')
  }

  // Check usage (if present)
  if (response.usage) {
    if (typeof response.usage.total_tokens !== 'number') {
      errors.push('Response usage.total_tokens must be a number')
    }
    if (typeof response.usage.prompt_tokens !== 'number') {
      errors.push('Response usage.prompt_tokens must be a number')
    }
    if (typeof response.usage.completion_tokens !== 'number') {
      errors.push('Response usage.completion_tokens must be a number')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate streaming chunk structure
 */
export function validateStreamChunk(chunk: any): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!chunk) {
    errors.push('Chunk is null or undefined')
    return { valid: false, errors }
  }

  if (typeof chunk !== 'object') {
    errors.push('Chunk must be an object')
    return { valid: false, errors }
  }

  // OpenAI format
  if (chunk.choices) {
    if (!Array.isArray(chunk.choices)) {
      errors.push('Chunk.choices must be an array')
    } else if (chunk.choices.length === 0) {
      errors.push('Chunk.choices must not be empty')
    }
  }
  // Anthropic format
  else if (chunk.type) {
    const validTypes = ['message_start', 'content_block_start', 'content_block_delta', 'content_block_stop', 'message_delta', 'message_stop']
    if (!validTypes.includes(chunk.type)) {
      errors.push(`Invalid chunk type: ${chunk.type}`)
    }
  }
  // Google format
  else if (!chunk.text && !chunk.candidates) {
    errors.push('Chunk must have either text() method or candidates field')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Collect streaming response
 */
export async function collectStream(
  stream: AsyncIterable<any>,
  extractor?: (chunk: any) => string | null
): Promise<{
  content: string
  chunks: any[]
  duration: number
}> {
  const startTime = performance.now()
  const chunks: any[] = []
  let content = ''

  for await (const chunk of stream) {
    chunks.push(chunk)
    
    const text = extractor ? extractor(chunk) : chunk.content || chunk.text?.() || ''
    if (text) {
      content += text
    }
  }

  const duration = performance.now() - startTime

  return { content, chunks, duration }
}

/**
 * Measure response time
 */
export async function measureResponseTime<T>(
  fn: () => Promise<T>
): Promise<{
  result: T
  duration: number
}> {
  const startTime = performance.now()
  const result = await fn()
  const duration = performance.now() - startTime

  return { result, duration }
}

/**
 * Test token counting accuracy
 */
export function validateTokenUsage(
  usage: { promptTokens: number; completionTokens: number; totalTokens: number },
  options: {
    minPromptTokens?: number
    maxPromptTokens?: number
    minCompletionTokens?: number
    maxCompletionTokens?: number
  } = {}
): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check sum
  if (usage.totalTokens !== usage.promptTokens + usage.completionTokens) {
    errors.push(
      `Total tokens (${usage.totalTokens}) does not equal sum of prompt (${usage.promptTokens}) and completion (${usage.completionTokens}) tokens`
    )
  }

  // Check ranges
  if (options.minPromptTokens && usage.promptTokens < options.minPromptTokens) {
    errors.push(`Prompt tokens (${usage.promptTokens}) is less than minimum (${options.minPromptTokens})`)
  }

  if (options.maxPromptTokens && usage.promptTokens > options.maxPromptTokens) {
    errors.push(`Prompt tokens (${usage.promptTokens}) exceeds maximum (${options.maxPromptTokens})`)
  }

  if (options.minCompletionTokens && usage.completionTokens < options.minCompletionTokens) {
    errors.push(`Completion tokens (${usage.completionTokens}) is less than minimum (${options.minCompletionTokens})`)
  }

  if (options.maxCompletionTokens && usage.completionTokens > options.maxCompletionTokens) {
    errors.push(`Completion tokens (${usage.completionTokens}) exceeds maximum (${options.maxCompletionTokens})`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Create a test suite
 */
export class TestSuite {
  private tests: Array<{
    name: string
    fn: () => Promise<void> | void
  }> = []
  
  private beforeEachHooks: Array<() => Promise<void> | void> = []
  private afterEachHooks: Array<() => Promise<void> | void> = []
  private beforeAllHooks: Array<() => Promise<void> | void> = []
  private afterAllHooks: Array<() => Promise<void> | void> = []

  constructor(private name: string) {}

  /**
   * Add a test
   */
  test(name: string, fn: () => Promise<void> | void): this {
    this.tests.push({ name, fn })
    return this
  }

  /**
   * Run before each test
   */
  beforeEach(fn: () => Promise<void> | void): this {
    this.beforeEachHooks.push(fn)
    return this
  }

  /**
   * Run after each test
   */
  afterEach(fn: () => Promise<void> | void): this {
    this.afterEachHooks.push(fn)
    return this
  }

  /**
   * Run before all tests
   */
  beforeAll(fn: () => Promise<void> | void): this {
    this.beforeAllHooks.push(fn)
    return this
  }

  /**
   * Run after all tests
   */
  afterAll(fn: () => Promise<void> | void): this {
    this.afterAllHooks.push(fn)
    return this
  }

  /**
   * Run all tests
   */
  async run(): Promise<{
    passed: number
    failed: number
    total: number
    results: Array<{
      name: string
      status: 'passed' | 'failed'
      error?: Error
      duration: number
    }>
  }> {
    console.log(`\n🧪 Running test suite: ${this.name}\n`)

    const results: Array<{
      name: string
      status: 'passed' | 'failed'
      error?: Error
      duration: number
    }> = []

    // Run beforeAll hooks
    for (const hook of this.beforeAllHooks) {
      await hook()
    }

    // Run tests
    for (const test of this.tests) {
      try {
        // Run beforeEach hooks
        for (const hook of this.beforeEachHooks) {
          await hook()
        }

        const startTime = performance.now()
        await test.fn()
        const duration = performance.now() - startTime

        results.push({
          name: test.name,
          status: 'passed',
          duration
        })

        console.log(`  ✅ ${test.name} (${duration.toFixed(2)}ms)`)

        // Run afterEach hooks
        for (const hook of this.afterEachHooks) {
          await hook()
        }
      } catch (error) {
        const duration = performance.now()
        
        results.push({
          name: test.name,
          status: 'failed',
          error: error as Error,
          duration
        })

        console.log(`  ❌ ${test.name}`)
        console.log(`     ${(error as Error).message}`)

        // Still run afterEach hooks
        for (const hook of this.afterEachHooks) {
          try {
            await hook()
          } catch (hookError) {
            console.error('Error in afterEach hook:', hookError)
          }
        }
      }
    }

    // Run afterAll hooks
    for (const hook of this.afterAllHooks) {
      await hook()
    }

    const passed = results.filter(r => r.status === 'passed').length
    const failed = results.filter(r => r.status === 'failed').length

    console.log(`\n${passed} passed, ${failed} failed (${this.tests.length} total)\n`)

    return {
      passed,
      failed,
      total: this.tests.length,
      results
    }
  }
}

/**
 * Create a test suite
 */
export function createTestSuite(name: string): TestSuite {
  return new TestSuite(name)
}
