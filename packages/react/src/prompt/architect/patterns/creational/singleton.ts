/**
 * Singleton Pattern
 * @packageDocumentation
 */

import type { PatternDefinition } from '../types'

export const SINGLETON: PatternDefinition = {
  id: 'SINGLETON',
  name: 'Singleton',
  category: 'creational',
  intent: 'Ensure a class has only one instance and provide global access',
  useCases: [
    'Database connection pools',
    'Configuration managers',
    'Logging services',
    'Cache managers',
  ],
  tradeoffs: {
    pros: ['Global access', 'Lazy initialization', 'Single instance guarantee'],
    cons: ['Global state', 'Hard to test', 'Hidden dependencies', 'Thread safety concerns'],
  },
  implementation: `class Singleton {
  private static instance: Singleton;
  private constructor() {}
  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}`,
}
