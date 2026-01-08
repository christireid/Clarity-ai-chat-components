/**
 * Behavioral Patterns
 * @packageDocumentation
 */
export const CHAIN_OF_RESPONSIBILITY = {
    id: 'CHAIN_OF_RESPONSIBILITY',
    name: 'Chain of Responsibility',
    category: 'behavioral',
    intent: 'Pass request along chain of handlers until one handles it',
    useCases: ['Middleware pipelines', 'Event bubbling', 'Logging levels', 'Authentication chains'],
    tradeoffs: { pros: ['Decouples sender/receiver', 'Single Responsibility', 'Dynamic chains'], cons: ['Request may go unhandled', 'Hard to debug'] },
    implementation: `interface Handler { setNext(handler: Handler): Handler; handle(request: string): string | null; }
abstract class AbstractHandler implements Handler {
  private nextHandler?: Handler;
  setNext(handler: Handler): Handler { this.nextHandler = handler; return handler; }
  handle(request: string): string | null { return this.nextHandler?.handle(request) ?? null; }
}`,
};
export const COMMAND = {
    id: 'COMMAND',
    name: 'Command',
    category: 'behavioral',
    intent: 'Encapsulate request as object, allowing parameterization and queuing',
    useCases: ['Undo/redo functionality', 'Transaction systems', 'Task scheduling', 'Remote execution'],
    tradeoffs: { pros: ['Single Responsibility', 'Open/Closed', 'Undo support', 'Deferred execution'], cons: ['More classes', 'Complexity for simple operations'] },
    implementation: `interface Command { execute(): void; }
class ConcreteCommand implements Command {
  constructor(private receiver: Receiver, private payload: string) {}
  execute(): void { this.receiver.action(this.payload); }
}`,
};
export const INTERPRETER = {
    id: 'INTERPRETER',
    name: 'Interpreter',
    category: 'behavioral',
    intent: 'Define grammar representation and interpreter for a language',
    useCases: ['DSL implementations', 'Regular expression engines', 'SQL parsers', 'Configuration languages'],
    tradeoffs: { pros: ['Easy grammar changes', 'Simple expressions'], cons: ['Complex grammars hard', 'Performance concerns'] },
    implementation: `interface Expression { interpret(context: Context): number; }
class NumberExpression implements Expression {
  constructor(private num: number) {}
  interpret(): number { return this.num; }
}`,
};
export const ITERATOR = {
    id: 'ITERATOR',
    name: 'Iterator',
    category: 'behavioral',
    intent: 'Provide way to access elements sequentially without exposing structure',
    useCases: ['Collection traversal', 'Database cursors', 'File system walking', 'Tree traversal'],
    tradeoffs: { pros: ['Single Responsibility', 'Open/Closed', 'Parallel iteration'], cons: ['Overkill for simple collections', 'Less efficient than direct access'] },
    implementation: `interface Iterator<T> { current(): T; next(): T; hasNext(): boolean; }
interface Iterable<T> { createIterator(): Iterator<T>; }`,
};
export const MEDIATOR = {
    id: 'MEDIATOR',
    name: 'Mediator',
    category: 'behavioral',
    intent: 'Define object that encapsulates how objects interact',
    useCases: ['Chat rooms', 'Air traffic control', 'UI component coordination', 'Event buses'],
    tradeoffs: { pros: ['Reduces coupling', 'Centralizes control', 'Simplifies object protocols'], cons: ['Mediator can become God object'] },
    implementation: `interface Mediator { notify(sender: object, event: string): void; }
class ConcreteMediator implements Mediator {
  notify(sender: object, event: string): void { /* coordinate components */ }
}`,
};
export const MEMENTO = {
    id: 'MEMENTO',
    name: 'Memento',
    category: 'behavioral',
    intent: 'Capture and restore object internal state without violating encapsulation',
    useCases: ['Undo mechanisms', 'Snapshots', 'Transaction rollback', 'Game save states'],
    tradeoffs: { pros: ['Preserves encapsulation', 'Simplifies originator'], cons: ['Memory consumption', 'Expensive if frequent'] },
    implementation: `class Memento { constructor(private state: string) {} getState(): string { return this.state; } }
class Originator {
  private state: string = '';
  save(): Memento { return new Memento(this.state); }
  restore(memento: Memento): void { this.state = memento.getState(); }
}`,
};
export const OBSERVER = {
    id: 'OBSERVER',
    name: 'Observer',
    category: 'behavioral',
    intent: 'Define subscription mechanism to notify multiple objects of state changes',
    useCases: ['Event systems', 'MVC architectures', 'Reactive programming', 'Pub/sub systems'],
    tradeoffs: { pros: ['Open/Closed', 'Runtime subscriptions', 'Loose coupling'], cons: ['Notification order undefined', 'Memory leaks if not unsubscribed'] },
    implementation: `interface Observer { update(subject: Subject): void; }
class Subject {
  private observers: Observer[] = [];
  attach(observer: Observer): void { this.observers.push(observer); }
  notify(): void { this.observers.forEach(o => o.update(this)); }
}`,
};
export const STATE = {
    id: 'STATE',
    name: 'State',
    category: 'behavioral',
    intent: 'Allow object to alter behavior when internal state changes',
    useCases: ['Finite state machines', 'Document workflow', 'TCP connections', 'Game character states'],
    tradeoffs: { pros: ['Single Responsibility', 'Open/Closed', 'Simplifies conditionals'], cons: ['Overkill for few states', 'State transitions scattered'] },
    implementation: `interface State { handle(context: Context): void; }
class Context {
  constructor(private state: State) {}
  setState(state: State): void { this.state = state; }
  request(): void { this.state.handle(this); }
}`,
};
export const STRATEGY = {
    id: 'STRATEGY',
    name: 'Strategy',
    category: 'behavioral',
    intent: 'Define family of algorithms, encapsulate each, make them interchangeable',
    useCases: ['Sorting algorithms', 'Payment processing', 'Compression algorithms', 'Routing strategies'],
    tradeoffs: { pros: ['Open/Closed', 'Composition over inheritance', 'Runtime algorithm switching'], cons: ['Client must know strategies', 'More objects'] },
    implementation: `interface Strategy { execute(data: string[]): string[]; }
class Context {
  constructor(private strategy: Strategy) {}
  setStrategy(strategy: Strategy): void { this.strategy = strategy; }
  doSomething(): string[] { return this.strategy.execute(['a', 'b', 'c']); }
}`,
};
export const TEMPLATE_METHOD = {
    id: 'TEMPLATE_METHOD',
    name: 'Template Method',
    category: 'behavioral',
    intent: 'Define skeleton of algorithm, deferring some steps to subclasses',
    useCases: ['Framework hooks', 'Data processing pipelines', 'Report generation', 'Test fixtures'],
    tradeoffs: { pros: ['Code reuse', 'Single point of control', 'Inversion of control'], cons: ['Inheritance required', 'Can violate Liskov'] },
    implementation: `abstract class AbstractClass {
  templateMethod(): void { this.baseOperation(); this.requiredOperation(); this.hook(); }
  baseOperation(): void { /* default impl */ }
  abstract requiredOperation(): void;
  hook(): void { /* optional override */ }
}`,
};
export const VISITOR = {
    id: 'VISITOR',
    name: 'Visitor',
    category: 'behavioral',
    intent: 'Define new operation without changing classes of elements operated on',
    useCases: ['AST traversal', 'Document exporters', 'Report generators', 'Object structure operations'],
    tradeoffs: { pros: ['Single Responsibility', 'Open/Closed for operations', 'Accumulates state'], cons: ['Must update when adding element types', 'Breaks encapsulation'] },
    implementation: `interface Visitor { visitElementA(element: ElementA): void; visitElementB(element: ElementB): void; }
interface Element { accept(visitor: Visitor): void; }
class ElementA implements Element { accept(visitor: Visitor): void { visitor.visitElementA(this); } }`,
};
//# sourceMappingURL=index.js.map