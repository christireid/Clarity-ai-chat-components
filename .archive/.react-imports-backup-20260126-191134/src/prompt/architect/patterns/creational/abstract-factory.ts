/**
 * Abstract Factory Pattern
 * @packageDocumentation
 */

import type { PatternDefinition } from '../types'

export const ABSTRACT_FACTORY: PatternDefinition = {
  id: 'ABSTRACT_FACTORY',
  name: 'Abstract Factory',
  category: 'creational',
  intent: 'Provide interface for creating families of related objects',
  useCases: [
    'Cross-platform UI toolkits',
    'Database abstraction layers',
    'Theme systems',
    'Multi-brand products',
  ],
  tradeoffs: {
    pros: ['Consistency among products', 'Isolates concrete classes', 'Easy product family switching'],
    cons: ['Complexity', 'Hard to add new product types'],
  },
  implementation: `interface AbstractFactory {
  createProductA(): AbstractProductA;
  createProductB(): AbstractProductB;
}`,
}
