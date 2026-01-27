/**
 * Prototype Pattern
 * @packageDocumentation
 */

import type { PatternDefinition } from '../types'

export const PROTOTYPE: PatternDefinition = {
  id: 'PROTOTYPE',
  name: 'Prototype',
  category: 'creational',
  intent: 'Create new objects by copying existing ones',
  useCases: [
    'Cloning complex objects',
    'Object caching',
    'Undo/redo functionality',
    'Default configurations',
  ],
  tradeoffs: {
    pros: ['Avoids costly creation', 'Dynamic typing', 'Reduces subclasses'],
    cons: ['Deep vs shallow copy complexity', 'Circular reference handling'],
  },
  implementation: `interface Prototype {
  clone(): Prototype;
}
class ConcretePrototype implements Prototype {
  clone(): Prototype {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}`,
}
