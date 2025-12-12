/**
 * Structural Patterns
 * @packageDocumentation
 */

import type { PatternDefinition } from '../types'

export const ADAPTER: PatternDefinition = {
  id: 'ADAPTER',
  name: 'Adapter',
  category: 'structural',
  intent: 'Convert interface of a class into another interface clients expect',
  useCases: ['Legacy system integration', 'Third-party library wrapping', 'API version compatibility', 'Data format conversion'],
  tradeoffs: { pros: ['Single Responsibility', 'Open/Closed', 'Reuses existing code'], cons: ['Adds indirection', 'Additional classes'] },
  implementation: `interface Target { request(): string; }
class Adaptee { specificRequest(): string { return 'specific'; } }
class Adapter implements Target {
  constructor(private adaptee: Adaptee) {}
  request(): string { return this.adaptee.specificRequest(); }
}`,
}

export const BRIDGE: PatternDefinition = {
  id: 'BRIDGE',
  name: 'Bridge',
  category: 'structural',
  intent: 'Decouple abstraction from implementation so both can vary',
  useCases: ['Cross-platform applications', 'Graphics rendering systems', 'Device drivers', 'Database drivers'],
  tradeoffs: { pros: ['Platform independence', 'Single Responsibility', 'Open/Closed'], cons: ['Complexity for simple hierarchies'] },
  implementation: `interface Implementation { operationImpl(): string; }
class Abstraction {
  constructor(protected implementation: Implementation) {}
  operation(): string { return this.implementation.operationImpl(); }
}`,
}

export const COMPOSITE: PatternDefinition = {
  id: 'COMPOSITE',
  name: 'Composite',
  category: 'structural',
  intent: 'Compose objects into tree structures for part-whole hierarchies',
  useCases: ['File system representation', 'UI component trees', 'Organization hierarchies', 'Menu systems'],
  tradeoffs: { pros: ['Uniform treatment', 'Easy to add new components', 'Simplified client code'], cons: ['Hard to restrict composition', 'Type safety challenges'] },
  implementation: `interface Component { operation(): string; }
class Leaf implements Component { operation(): string { return 'Leaf'; } }
class Composite implements Component {
  private children: Component[] = [];
  add(child: Component): void { this.children.push(child); }
  operation(): string { return this.children.map(c => c.operation()).join('+'); }
}`,
}

export const DECORATOR: PatternDefinition = {
  id: 'DECORATOR',
  name: 'Decorator',
  category: 'structural',
  intent: 'Attach additional responsibilities to objects dynamically',
  useCases: ['Stream processing', 'UI component decoration', 'Middleware chains', 'Caching layers'],
  tradeoffs: { pros: ['Single Responsibility', 'Runtime flexibility', 'Composition over inheritance'], cons: ['Many small objects', 'Decorator order matters', 'Hard to remove decorators'] },
  implementation: `interface Component { operation(): string; }
class Decorator implements Component {
  constructor(protected component: Component) {}
  operation(): string { return this.component.operation(); }
}
class ConcreteDecorator extends Decorator {
  operation(): string { return \`Decorated(\${super.operation()})\`; }
}`,
}

export const FACADE: PatternDefinition = {
  id: 'FACADE',
  name: 'Facade',
  category: 'structural',
  intent: 'Provide simplified interface to a complex subsystem',
  useCases: ['Library wrappers', 'Complex API simplification', 'Subsystem access points', 'Legacy system modernization'],
  tradeoffs: { pros: ['Simplifies client code', 'Decouples from subsystem', 'Single entry point'], cons: ['Can become God object', 'May hide needed functionality'] },
  implementation: `class Facade {
  constructor(private subsystemA: SubsystemA, private subsystemB: SubsystemB) {}
  operation(): string { return this.subsystemA.operationA() + this.subsystemB.operationB(); }
}`,
}

export const FLYWEIGHT: PatternDefinition = {
  id: 'FLYWEIGHT',
  name: 'Flyweight',
  category: 'structural',
  intent: 'Share common state among many fine-grained objects',
  useCases: ['Text editor characters', 'Game entities', 'Tree rendering in forests', 'Network connections'],
  tradeoffs: { pros: ['Memory savings', 'Performance improvement'], cons: ['Complexity', 'Trade CPU for RAM', 'Immutable shared state'] },
  implementation: `class Flyweight {
  constructor(private sharedState: object) {}
  operation(uniqueState: object): void { /* use both states */ }
}
class FlyweightFactory {
  private flyweights: Map<string, Flyweight> = new Map();
  getFlyweight(sharedState: object): Flyweight {
    const key = JSON.stringify(sharedState);
    if (!this.flyweights.has(key)) { this.flyweights.set(key, new Flyweight(sharedState)); }
    return this.flyweights.get(key)!;
  }
}`,
}

export const PROXY: PatternDefinition = {
  id: 'PROXY',
  name: 'Proxy',
  category: 'structural',
  intent: 'Provide surrogate or placeholder for another object',
  useCases: ['Lazy initialization', 'Access control', 'Logging/caching', 'Remote object access'],
  tradeoffs: { pros: ['Control without client knowing', 'Lifecycle management', 'Works with closed classes'], cons: ['Response delay', 'Complexity'] },
  implementation: `interface Subject { request(): void; }
class RealSubject implements Subject { request(): void { /* heavy work */ } }
class Proxy implements Subject {
  private realSubject?: RealSubject;
  request(): void {
    if (!this.realSubject) { this.realSubject = new RealSubject(); }
    this.realSubject.request();
  }
}`,
}
