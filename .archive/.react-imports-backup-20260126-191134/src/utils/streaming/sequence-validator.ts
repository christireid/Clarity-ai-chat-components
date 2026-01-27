/**
 * DELIVERY-4: Sequence Number Validation Utility
 *
 * Provides utilities for detecting out-of-order, missing, or duplicate messages
 * in streaming scenarios using sequence numbers.
 *
 * **Use Cases:**
 * - Detecting message reordering (rare in TCP-based protocols but possible with retries)
 * - Identifying gaps in message sequences (lost messages)
 * - Validating sequential integrity for critical streams
 * - Monitoring stream health and reliability
 *
 * @module SequenceValidation
 */

/**
 * Message with sequence number
 */
export interface SequencedMessage<T = unknown> {
  /** Sequence number (0-based or 1-based, must be consistent) */
  seq: number
  /** Message data */
  data: T
}

/**
 * Sequence validation result
 */
export interface SequenceValidationResult {
  /** Whether the sequence is valid (in order, no gaps) */
  valid: boolean
  /** Type of sequence issue detected */
  issue?: 'duplicate' | 'gap' | 'reorder'
  /** Expected sequence number */
  expected: number
  /** Actual sequence number received */
  actual: number
  /** Number of messages missing (for gap issues) */
  gapSize?: number
}

/**
 * Options for sequence validator
 */
export interface SequenceValidatorOptions {
  /**
   * Initial/starting sequence number (default: 0)
   * Use 1 if your sequence numbers are 1-based
   */
  initialSeq?: number

  /**
   * Called when a gap is detected (missing messages)
   */
  onGap?: (result: SequenceValidationResult) => void

  /**
   * Called when a duplicate sequence number is received
   */
  onDuplicate?: (result: SequenceValidationResult) => void

  /**
   * Called when messages arrive out of order
   */
  onReorder?: (result: SequenceValidationResult) => void

  /**
   * Whether to auto-resync after gaps (default: true)
   * If true, validator continues from the received sequence after a gap
   * If false, all subsequent messages will be marked as invalid until reset
   */
  autoResync?: boolean
}

/**
 * Sequence number validator for detecting ordering issues
 *
 * @example
 * ```typescript
 * const validator = new SequenceValidator({
 *   initialSeq: 0,
 *   onGap: (result) => {
 *     console.warn(`Missing ${result.gapSize} messages (expected ${result.expected}, got ${result.actual})`)
 *   },
 *   onDuplicate: (result) => {
 *     console.warn(`Duplicate message: seq ${result.actual}`)
 *   }
 * })
 *
 * // Validate each message
 * const message = { seq: 5, data: { text: 'Hello' } }
 * const result = validator.validate(message)
 * if (!result.valid) {
 *   console.error('Sequence issue:', result.issue)
 * }
 * ```
 */
export class SequenceValidator<T = unknown> {
  private expectedSeq: number
  private lastSeq: number | null = null
  private onGap?: (result: SequenceValidationResult) => void
  private onDuplicate?: (result: SequenceValidationResult) => void
  private onReorder?: (result: SequenceValidationResult) => void
  private autoResync: boolean

  constructor(options: SequenceValidatorOptions = {}) {
    this.expectedSeq = options.initialSeq ?? 0
    this.onGap = options.onGap
    this.onDuplicate = options.onDuplicate
    this.onReorder = options.onReorder
    this.autoResync = options.autoResync ?? true
  }

  /**
   * Validate a message's sequence number
   * Returns validation result and updates internal state
   */
  validate(message: SequencedMessage<T>): SequenceValidationResult {
    const { seq } = message
    const expected = this.expectedSeq

    // First message (no last sequence)
    if (this.lastSeq === null) {
      this.lastSeq = seq
      this.expectedSeq = seq + 1
      return { valid: true, expected: seq, actual: seq }
    }

    // Duplicate (same as last)
    if (seq === this.lastSeq) {
      const result: SequenceValidationResult = {
        valid: false,
        issue: 'duplicate',
        expected,
        actual: seq,
      }
      this.onDuplicate?.(result)
      return result
    }

    // Out of order (less than last, but not duplicate)
    if (seq < this.lastSeq) {
      const result: SequenceValidationResult = {
        valid: false,
        issue: 'reorder',
        expected,
        actual: seq,
      }
      this.onReorder?.(result)
      return result
    }

    // Gap (skipped sequence numbers)
    if (seq > expected) {
      const gapSize = seq - expected
      const result: SequenceValidationResult = {
        valid: false,
        issue: 'gap',
        expected,
        actual: seq,
        gapSize,
      }
      this.onGap?.(result)

      if (this.autoResync) {
        // Continue from this sequence
        this.lastSeq = seq
        this.expectedSeq = seq + 1
      }

      return result
    }

    // Valid (seq === expected)
    this.lastSeq = seq
    this.expectedSeq = seq + 1
    return { valid: true, expected, actual: seq }
  }

  /**
   * Reset validator to initial state
   */
  reset(initialSeq?: number): void {
    this.expectedSeq = initialSeq ?? 0
    this.lastSeq = null
  }

  /**
   * Get the next expected sequence number
   */
  getExpected(): number {
    return this.expectedSeq
  }

  /**
   * Get the last received sequence number
   */
  getLast(): number | null {
    return this.lastSeq
  }

  /**
   * Manually set the expected sequence number (for recovery scenarios)
   */
  setExpected(seq: number): void {
    this.expectedSeq = seq
  }
}

/**
 * React Hook for sequence validation
 *
 * @example
 * ```tsx
 * function StreamingComponent() {
 *   const validator = useSequenceValidator({
 *     initialSeq: 0,
 *     onGap: (result) => {
 *       console.warn(`Gap detected: missing ${result.gapSize} messages`)
 *     }
 *   })
 *
 *   const handleMessage = (msg: SequencedMessage) => {
 *     const result = validator.validate(msg)
 *     if (result.valid) {
 *       processMessage(msg)
 *     }
 *   }
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useSequenceValidator<T = unknown>(
  options: SequenceValidatorOptions = {}
): SequenceValidator<T> {
  // Use ref to maintain same instance across renders
  const validatorRef = React.useRef<SequenceValidator<T> | null>(null)

  if (!validatorRef.current) {
    validatorRef.current = new SequenceValidator<T>(options)
  }

  // Reset on unmount
  React.useEffect(() => {
    return () => {
      validatorRef.current?.reset()
    }
  }, [])

  return validatorRef.current
}

// React import for hook
import * as React from 'react'
