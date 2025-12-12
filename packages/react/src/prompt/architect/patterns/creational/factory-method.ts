/**
 * Factory Method Pattern
 * @packageDocumentation
 */

import type { PatternDefinition } from '../types'

export const FACTORY_METHOD: PatternDefinition = {
  id: 'FACTORY_METHOD',
  name: 'Factory Method',
  category: 'creational',
  intent: 'Define interface for creating objects, let subclasses decide which class to instantiate',
  useCases: [
    'Framework extension points',
    'Plugin systems',
    'Database adapters',
    'UI component creation',
  ],
  tradeoffs: {
    pros: ['Loose coupling', 'Single Responsibility', 'Open/Closed principle'],
    cons: ['More classes', 'Requires subclassing'],
  },
  implementation: `interface Product { operation(): string; }
abstract class Creator {
  abstract factoryMethod(): Product;
  someOperation(): string {
    const product = this.factoryMethod();
    return product.operation();
  }
}`,
}
