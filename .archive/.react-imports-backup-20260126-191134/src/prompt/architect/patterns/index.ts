/**
 * Design Pattern Catalog
 *
 * Tree-shakeable exports for all 23 GoF design patterns.
 * Import individual patterns for optimal bundle size.
 *
 * @example
 * ```typescript
 * // Import specific patterns (tree-shakeable)
 * import { SINGLETON, FACTORY_METHOD } from '@clarity-chat/react/prompt/architect/patterns'
 *
 * // Import all patterns
 * import { ALL_PATTERNS, getPatternById } from '@clarity-chat/react/prompt/architect/patterns'
 * ```
 *
 * @packageDocumentation
 */

import type { DesignPattern, DesignPatternCategory } from '../types'
import type { PatternDefinition } from './types'

// Re-export types
export type { PatternDefinition } from './types'

// Creational patterns
export { SINGLETON } from './creational/singleton'
export { FACTORY_METHOD } from './creational/factory-method'
export { ABSTRACT_FACTORY } from './creational/abstract-factory'
export { BUILDER } from './creational/builder'
export { PROTOTYPE } from './creational/prototype'

// Structural patterns
export {
  ADAPTER,
  BRIDGE,
  COMPOSITE,
  DECORATOR,
  FACADE,
  FLYWEIGHT,
  PROXY,
} from './structural'

// Behavioral patterns
export {
  CHAIN_OF_RESPONSIBILITY,
  COMMAND,
  INTERPRETER,
  ITERATOR,
  MEDIATOR,
  MEMENTO,
  OBSERVER,
  STATE,
  STRATEGY,
  TEMPLATE_METHOD,
  VISITOR,
} from './behavioral'

// Import all for catalog
import { SINGLETON } from './creational/singleton'
import { FACTORY_METHOD } from './creational/factory-method'
import { ABSTRACT_FACTORY } from './creational/abstract-factory'
import { BUILDER } from './creational/builder'
import { PROTOTYPE } from './creational/prototype'
import {
  ADAPTER,
  BRIDGE,
  COMPOSITE,
  DECORATOR,
  FACADE,
  FLYWEIGHT,
  PROXY,
} from './structural'
import {
  CHAIN_OF_RESPONSIBILITY,
  COMMAND,
  INTERPRETER,
  ITERATOR,
  MEDIATOR,
  MEMENTO,
  OBSERVER,
  STATE,
  STRATEGY,
  TEMPLATE_METHOD,
  VISITOR,
} from './behavioral'

/**
 * All patterns as a record (for backward compatibility)
 */
export const ALL_PATTERNS: Record<DesignPattern, PatternDefinition> = {
  SINGLETON,
  FACTORY_METHOD,
  ABSTRACT_FACTORY,
  BUILDER,
  PROTOTYPE,
  ADAPTER,
  BRIDGE,
  COMPOSITE,
  DECORATOR,
  FACADE,
  FLYWEIGHT,
  PROXY,
  CHAIN_OF_RESPONSIBILITY,
  COMMAND,
  INTERPRETER,
  ITERATOR,
  MEDIATOR,
  MEMENTO,
  OBSERVER,
  STATE,
  STRATEGY,
  TEMPLATE_METHOD,
  VISITOR,
}

/**
 * Get pattern by ID
 */
export function getPatternById(id: DesignPattern): PatternDefinition {
  return ALL_PATTERNS[id]
}

/**
 * Get all patterns in a category
 */
export function getPatternsByCategory(
  category: DesignPatternCategory
): PatternDefinition[] {
  return Object.values(ALL_PATTERNS).filter((p) => p.category === category)
}

/**
 * Get all creational patterns
 */
export function getCreationalPatterns(): PatternDefinition[] {
  return [SINGLETON, FACTORY_METHOD, ABSTRACT_FACTORY, BUILDER, PROTOTYPE]
}

/**
 * Get all structural patterns
 */
export function getStructuralPatterns(): PatternDefinition[] {
  return [ADAPTER, BRIDGE, COMPOSITE, DECORATOR, FACADE, FLYWEIGHT, PROXY]
}

/**
 * Get all behavioral patterns
 */
export function getBehavioralPatterns(): PatternDefinition[] {
  return [
    CHAIN_OF_RESPONSIBILITY,
    COMMAND,
    INTERPRETER,
    ITERATOR,
    MEDIATOR,
    MEMENTO,
    OBSERVER,
    STATE,
    STRATEGY,
    TEMPLATE_METHOD,
    VISITOR,
  ]
}
