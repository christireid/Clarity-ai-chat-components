/**
 * Design Pattern Type Definitions
 *
 * Shared types for the design pattern catalog.
 *
 * @packageDocumentation
 */

import type { DesignPattern, DesignPatternCategory } from '../types'

/**
 * Complete definition of a design pattern
 */
export interface PatternDefinition {
  /** Pattern identifier */
  id: DesignPattern
  /** Human-readable name */
  name: string
  /** Pattern category */
  category: DesignPatternCategory
  /** Description of intent */
  intent: string
  /** Common use cases */
  useCases: string[]
  /** Trade-offs */
  tradeoffs: {
    pros: string[]
    cons: string[]
  }
  /** Implementation example */
  implementation: string
}
