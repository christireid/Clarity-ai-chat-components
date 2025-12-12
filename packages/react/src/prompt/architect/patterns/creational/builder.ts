/**
 * Builder Pattern
 * @packageDocumentation
 */

import type { PatternDefinition } from '../types'

export const BUILDER: PatternDefinition = {
  id: 'BUILDER',
  name: 'Builder',
  category: 'creational',
  intent: 'Separate construction of complex objects from their representation',
  useCases: [
    'Complex object construction',
    'SQL query builders',
    'HTML/DOM builders',
    'Configuration objects',
  ],
  tradeoffs: {
    pros: ['Step-by-step construction', 'Reusable construction code', 'Single Responsibility'],
    cons: ['More code', 'Requires mutable builder state'],
  },
  implementation: `class Builder {
  private product: Product = new Product();
  reset(): void { this.product = new Product(); }
  setPartA(a: string): this { this.product.partA = a; return this; }
  setPartB(b: string): this { this.product.partB = b; return this; }
  build(): Product { const result = this.product; this.reset(); return result; }
}`,
}
