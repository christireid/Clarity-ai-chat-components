/**
 * Phase 2: Strategic Planning
 *
 * Utilities for the "Architect" phase - chain of thought, step-by-step planning,
 * design patterns, trade-off analysis, and test strategy.
 *
 * @packageDocumentation
 */

import type {
  StrategicPlan,
  PlanningStep,
  PatternRecommendation,
  RejectedAlternative,
  TestPlanItem,
  DesignPattern,
  DesignPatternCategory,
  TestStrategy,
} from '../types'

// ============================================================================
// Design Pattern Catalog
// ============================================================================

/**
 * Design pattern descriptions and use cases
 */
export const DESIGN_PATTERN_CATALOG: Record<
  DesignPattern,
  {
    name: string
    category: DesignPatternCategory
    intent: string
    useCases: string[]
    tradeoffs: {
      pros: string[]
      cons: string[]
    }
    implementation: string
  }
> = {
  // Creational Patterns
  SINGLETON: {
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
  },
  FACTORY_METHOD: {
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
  },
  ABSTRACT_FACTORY: {
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
  },
  BUILDER: {
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
  },
  PROTOTYPE: {
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
  },

  // Structural Patterns
  ADAPTER: {
    name: 'Adapter',
    category: 'structural',
    intent: 'Convert interface of a class into another interface clients expect',
    useCases: [
      'Legacy system integration',
      'Third-party library wrapping',
      'API version compatibility',
      'Data format conversion',
    ],
    tradeoffs: {
      pros: ['Single Responsibility', 'Open/Closed', 'Reuses existing code'],
      cons: ['Adds indirection', 'Additional classes'],
    },
    implementation: `interface Target { request(): string; }
class Adaptee { specificRequest(): string { return 'specific'; } }
class Adapter implements Target {
  constructor(private adaptee: Adaptee) {}
  request(): string { return this.adaptee.specificRequest(); }
}`,
  },
  BRIDGE: {
    name: 'Bridge',
    category: 'structural',
    intent: 'Decouple abstraction from implementation so both can vary',
    useCases: [
      'Cross-platform applications',
      'Graphics rendering systems',
      'Device drivers',
      'Database drivers',
    ],
    tradeoffs: {
      pros: ['Platform independence', 'Single Responsibility', 'Open/Closed'],
      cons: ['Complexity for simple hierarchies'],
    },
    implementation: `interface Implementation { operationImpl(): string; }
class Abstraction {
  constructor(protected implementation: Implementation) {}
  operation(): string { return this.implementation.operationImpl(); }
}`,
  },
  COMPOSITE: {
    name: 'Composite',
    category: 'structural',
    intent: 'Compose objects into tree structures for part-whole hierarchies',
    useCases: [
      'File system representation',
      'UI component trees',
      'Organization hierarchies',
      'Menu systems',
    ],
    tradeoffs: {
      pros: ['Uniform treatment', 'Easy to add new components', 'Simplified client code'],
      cons: ['Hard to restrict composition', 'Type safety challenges'],
    },
    implementation: `interface Component { operation(): string; }
class Leaf implements Component { operation(): string { return 'Leaf'; } }
class Composite implements Component {
  private children: Component[] = [];
  add(child: Component): void { this.children.push(child); }
  operation(): string { return this.children.map(c => c.operation()).join('+'); }
}`,
  },
  DECORATOR: {
    name: 'Decorator',
    category: 'structural',
    intent: 'Attach additional responsibilities to objects dynamically',
    useCases: [
      'Stream processing',
      'UI component decoration',
      'Middleware chains',
      'Caching layers',
    ],
    tradeoffs: {
      pros: ['Single Responsibility', 'Runtime flexibility', 'Composition over inheritance'],
      cons: ['Many small objects', 'Decorator order matters', 'Hard to remove decorators'],
    },
    implementation: `interface Component { operation(): string; }
class Decorator implements Component {
  constructor(protected component: Component) {}
  operation(): string { return this.component.operation(); }
}
class ConcreteDecorator extends Decorator {
  operation(): string { return \`Decorated(\${super.operation()})\`; }
}`,
  },
  FACADE: {
    name: 'Facade',
    category: 'structural',
    intent: 'Provide simplified interface to a complex subsystem',
    useCases: [
      'Library wrappers',
      'Complex API simplification',
      'Subsystem access points',
      'Legacy system modernization',
    ],
    tradeoffs: {
      pros: ['Simplifies client code', 'Decouples from subsystem', 'Single entry point'],
      cons: ['Can become God object', 'May hide needed functionality'],
    },
    implementation: `class Facade {
  constructor(
    private subsystemA: SubsystemA,
    private subsystemB: SubsystemB
  ) {}
  operation(): string {
    return this.subsystemA.operationA() + this.subsystemB.operationB();
  }
}`,
  },
  FLYWEIGHT: {
    name: 'Flyweight',
    category: 'structural',
    intent: 'Share common state among many fine-grained objects',
    useCases: [
      'Text editor characters',
      'Game entities',
      'Tree rendering in forests',
      'Network connections',
    ],
    tradeoffs: {
      pros: ['Memory savings', 'Performance improvement'],
      cons: ['Complexity', 'Trade CPU for RAM', 'Immutable shared state'],
    },
    implementation: `class Flyweight {
  constructor(private sharedState: object) {}
  operation(uniqueState: object): void { /* use both states */ }
}
class FlyweightFactory {
  private flyweights: Map<string, Flyweight> = new Map();
  getFlyweight(sharedState: object): Flyweight {
    const key = JSON.stringify(sharedState);
    if (!this.flyweights.has(key)) {
      this.flyweights.set(key, new Flyweight(sharedState));
    }
    return this.flyweights.get(key)!;
  }
}`,
  },
  PROXY: {
    name: 'Proxy',
    category: 'structural',
    intent: 'Provide surrogate or placeholder for another object',
    useCases: [
      'Lazy initialization',
      'Access control',
      'Logging/caching',
      'Remote object access',
    ],
    tradeoffs: {
      pros: ['Control without client knowing', 'Lifecycle management', 'Works with closed classes'],
      cons: ['Response delay', 'Complexity'],
    },
    implementation: `interface Subject { request(): void; }
class RealSubject implements Subject { request(): void { /* heavy work */ } }
class Proxy implements Subject {
  private realSubject?: RealSubject;
  request(): void {
    if (!this.realSubject) { this.realSubject = new RealSubject(); }
    this.realSubject.request();
  }
}`,
  },

  // Behavioral Patterns
  CHAIN_OF_RESPONSIBILITY: {
    name: 'Chain of Responsibility',
    category: 'behavioral',
    intent: 'Pass request along chain of handlers until one handles it',
    useCases: [
      'Middleware pipelines',
      'Event bubbling',
      'Logging levels',
      'Authentication chains',
    ],
    tradeoffs: {
      pros: ['Decouples sender/receiver', 'Single Responsibility', 'Dynamic chains'],
      cons: ['Request may go unhandled', 'Hard to debug'],
    },
    implementation: `interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: string): string | null;
}
abstract class AbstractHandler implements Handler {
  private nextHandler?: Handler;
  setNext(handler: Handler): Handler { this.nextHandler = handler; return handler; }
  handle(request: string): string | null {
    if (this.nextHandler) { return this.nextHandler.handle(request); }
    return null;
  }
}`,
  },
  COMMAND: {
    name: 'Command',
    category: 'behavioral',
    intent: 'Encapsulate request as object, allowing parameterization and queuing',
    useCases: [
      'Undo/redo functionality',
      'Transaction systems',
      'Task scheduling',
      'Remote execution',
    ],
    tradeoffs: {
      pros: ['Single Responsibility', 'Open/Closed', 'Undo support', 'Deferred execution'],
      cons: ['More classes', 'Complexity for simple operations'],
    },
    implementation: `interface Command { execute(): void; }
class ConcreteCommand implements Command {
  constructor(private receiver: Receiver, private payload: string) {}
  execute(): void { this.receiver.action(this.payload); }
}
class Invoker {
  private command?: Command;
  setCommand(command: Command): void { this.command = command; }
  executeCommand(): void { this.command?.execute(); }
}`,
  },
  INTERPRETER: {
    name: 'Interpreter',
    category: 'behavioral',
    intent: 'Define grammar representation and interpreter for a language',
    useCases: [
      'DSL implementations',
      'Regular expression engines',
      'SQL parsers',
      'Configuration languages',
    ],
    tradeoffs: {
      pros: ['Easy grammar changes', 'Simple expressions'],
      cons: ['Complex grammars hard', 'Performance concerns'],
    },
    implementation: `interface Expression { interpret(context: Context): number; }
class NumberExpression implements Expression {
  constructor(private number: number) {}
  interpret(): number { return this.number; }
}
class AddExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  interpret(context: Context): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}`,
  },
  ITERATOR: {
    name: 'Iterator',
    category: 'behavioral',
    intent: 'Provide way to access elements sequentially without exposing structure',
    useCases: [
      'Collection traversal',
      'Database cursors',
      'File system walking',
      'Tree traversal',
    ],
    tradeoffs: {
      pros: ['Single Responsibility', 'Open/Closed', 'Parallel iteration'],
      cons: ['Overkill for simple collections', 'Less efficient than direct access'],
    },
    implementation: `interface Iterator<T> {
  current(): T;
  next(): T;
  hasNext(): boolean;
}
interface Iterable<T> {
  createIterator(): Iterator<T>;
}`,
  },
  MEDIATOR: {
    name: 'Mediator',
    category: 'behavioral',
    intent: 'Define object that encapsulates how objects interact',
    useCases: [
      'Chat rooms',
      'Air traffic control',
      'UI component coordination',
      'Event buses',
    ],
    tradeoffs: {
      pros: ['Reduces coupling', 'Centralizes control', 'Simplifies object protocols'],
      cons: ['Mediator can become God object'],
    },
    implementation: `interface Mediator { notify(sender: object, event: string): void; }
class ConcreteMediator implements Mediator {
  constructor(private componentA: ComponentA, private componentB: ComponentB) {
    this.componentA.setMediator(this);
    this.componentB.setMediator(this);
  }
  notify(sender: object, event: string): void {
    if (event === 'A') { this.componentB.doC(); }
    if (event === 'B') { this.componentA.doA(); }
  }
}`,
  },
  MEMENTO: {
    name: 'Memento',
    category: 'behavioral',
    intent: 'Capture and restore object internal state without violating encapsulation',
    useCases: [
      'Undo mechanisms',
      'Snapshots',
      'Transaction rollback',
      'Game save states',
    ],
    tradeoffs: {
      pros: ['Preserves encapsulation', 'Simplifies originator'],
      cons: ['Memory consumption', 'Expensive if frequent'],
    },
    implementation: `class Memento {
  constructor(private state: string) {}
  getState(): string { return this.state; }
}
class Originator {
  private state: string = '';
  setState(state: string): void { this.state = state; }
  save(): Memento { return new Memento(this.state); }
  restore(memento: Memento): void { this.state = memento.getState(); }
}`,
  },
  OBSERVER: {
    name: 'Observer',
    category: 'behavioral',
    intent: 'Define subscription mechanism to notify multiple objects of state changes',
    useCases: [
      'Event systems',
      'MVC architectures',
      'Reactive programming',
      'Pub/sub systems',
    ],
    tradeoffs: {
      pros: ['Open/Closed', 'Runtime subscriptions', 'Loose coupling'],
      cons: ['Notification order undefined', 'Memory leaks if not unsubscribed'],
    },
    implementation: `interface Observer { update(subject: Subject): void; }
class Subject {
  private observers: Observer[] = [];
  attach(observer: Observer): void { this.observers.push(observer); }
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) { this.observers.splice(index, 1); }
  }
  notify(): void { this.observers.forEach(o => o.update(this)); }
}`,
  },
  STATE: {
    name: 'State',
    category: 'behavioral',
    intent: 'Allow object to alter behavior when internal state changes',
    useCases: [
      'Finite state machines',
      'Document workflow',
      'TCP connections',
      'Game character states',
    ],
    tradeoffs: {
      pros: ['Single Responsibility', 'Open/Closed', 'Simplifies conditionals'],
      cons: ['Overkill for few states', 'State transitions scattered'],
    },
    implementation: `interface State { handle(context: Context): void; }
class Context {
  private state: State;
  constructor(state: State) { this.state = state; }
  setState(state: State): void { this.state = state; }
  request(): void { this.state.handle(this); }
}`,
  },
  STRATEGY: {
    name: 'Strategy',
    category: 'behavioral',
    intent: 'Define family of algorithms, encapsulate each, make them interchangeable',
    useCases: [
      'Sorting algorithms',
      'Payment processing',
      'Compression algorithms',
      'Routing strategies',
    ],
    tradeoffs: {
      pros: ['Open/Closed', 'Composition over inheritance', 'Runtime algorithm switching'],
      cons: ['Client must know strategies', 'More objects'],
    },
    implementation: `interface Strategy { execute(data: string[]): string[]; }
class Context {
  constructor(private strategy: Strategy) {}
  setStrategy(strategy: Strategy): void { this.strategy = strategy; }
  doSomething(): string[] { return this.strategy.execute(['a', 'b', 'c']); }
}`,
  },
  TEMPLATE_METHOD: {
    name: 'Template Method',
    category: 'behavioral',
    intent: 'Define skeleton of algorithm, deferring some steps to subclasses',
    useCases: [
      'Framework hooks',
      'Data processing pipelines',
      'Report generation',
      'Test fixtures',
    ],
    tradeoffs: {
      pros: ['Code reuse', 'Single point of control', 'Inversion of control'],
      cons: ['Inheritance required', 'Can violate Liskov'],
    },
    implementation: `abstract class AbstractClass {
  templateMethod(): void {
    this.baseOperation1();
    this.requiredOperation();
    this.hook();
  }
  baseOperation1(): void { /* default impl */ }
  abstract requiredOperation(): void;
  hook(): void { /* optional override */ }
}`,
  },
  VISITOR: {
    name: 'Visitor',
    category: 'behavioral',
    intent: 'Define new operation without changing classes of elements operated on',
    useCases: [
      'AST traversal',
      'Document exporters',
      'Report generators',
      'Object structure operations',
    ],
    tradeoffs: {
      pros: ['Single Responsibility', 'Open/Closed for operations', 'Accumulates state'],
      cons: ['Must update when adding element types', 'Breaks encapsulation'],
    },
    implementation: `interface Visitor {
  visitElementA(element: ElementA): void;
  visitElementB(element: ElementB): void;
}
interface Element { accept(visitor: Visitor): void; }
class ElementA implements Element {
  accept(visitor: Visitor): void { visitor.visitElementA(this); }
}`,
  },
}

// ============================================================================
// Planning Functions
// ============================================================================

/**
 * Create a planning step
 */
export function createPlanningStep(params: {
  stepNumber: number
  title: string
  description: string
  expectedOutcome: string
  dependencies?: number[]
  complexity?: 'trivial' | 'simple' | 'moderate' | 'complex' | 'very_complex'
  riskLevel?: 'low' | 'medium' | 'high'
}): PlanningStep {
  return {
    stepNumber: params.stepNumber,
    title: params.title,
    description: params.description,
    expectedOutcome: params.expectedOutcome,
    dependencies: params.dependencies ?? [],
    complexity: params.complexity ?? 'moderate',
    riskLevel: params.riskLevel ?? 'low',
  }
}

/**
 * Create a pattern recommendation
 */
export function createPatternRecommendation(
  pattern: DesignPattern,
  rationale: string,
  customTradeoffs?: string[],
  implementationNotes?: string
): PatternRecommendation {
  const patternInfo = DESIGN_PATTERN_CATALOG[pattern]

  return {
    pattern,
    category: patternInfo.category,
    rationale,
    tradeoffs: customTradeoffs ?? [
      ...patternInfo.tradeoffs.pros.map((p) => `✓ ${p}`),
      ...patternInfo.tradeoffs.cons.map((c) => `✗ ${c}`),
    ],
    implementationNotes,
  }
}

/**
 * Create a rejected alternative
 */
export function createRejectedAlternative(
  name: string,
  description: string,
  rejectionReason: string,
  preferredWhen?: string
): RejectedAlternative {
  return {
    name,
    description,
    rejectionReason,
    preferredWhen,
  }
}

/**
 * Create a test plan item
 */
export function createTestPlanItem(params: {
  strategy: TestStrategy
  target: string
  description: string
  coverage?: string
  priority?: 'critical' | 'high' | 'medium' | 'low'
}): TestPlanItem {
  return {
    strategy: params.strategy,
    target: params.target,
    description: params.description,
    coverage: params.coverage,
    priority: params.priority ?? 'medium',
  }
}

/**
 * Calculate total complexity from steps
 */
export function calculateTotalComplexity(
  steps: PlanningStep[]
): 'trivial' | 'simple' | 'moderate' | 'complex' | 'very_complex' {
  const complexityWeights = {
    trivial: 1,
    simple: 2,
    moderate: 3,
    complex: 5,
    very_complex: 8,
  }

  const totalWeight = steps.reduce(
    (sum, step) => sum + complexityWeights[step.complexity],
    0
  )
  const avgWeight = totalWeight / steps.length

  if (avgWeight <= 1.5) return 'trivial'
  if (avgWeight <= 2.5) return 'simple'
  if (avgWeight <= 4) return 'moderate'
  if (avgWeight <= 6) return 'complex'
  return 'very_complex'
}

/**
 * Create a complete strategic plan
 */
export function createStrategicPlan(params: {
  chainOfThought: string
  steps: PlanningStep[]
  patternRecommendations?: PatternRecommendation[]
  rejectedAlternatives?: RejectedAlternative[]
  testPlan?: TestPlanItem[]
  approachSummary?: string
}): StrategicPlan {
  const steps = params.steps
  const totalComplexity = calculateTotalComplexity(steps)

  return {
    chainOfThought: params.chainOfThought,
    steps,
    patternRecommendations: params.patternRecommendations ?? [],
    rejectedAlternatives: params.rejectedAlternatives ?? [],
    testPlan: params.testPlan ?? [],
    approachSummary:
      params.approachSummary ?? `${steps.length}-step implementation plan with ${totalComplexity} overall complexity`,
    totalComplexity,
  }
}

/**
 * Format strategic plan as markdown
 */
export function formatStrategicPlanAsMarkdown(plan: StrategicPlan): string {
  const lines: string[] = []

  lines.push('# Strategic Plan')
  lines.push('')
  lines.push('## Chain of Thought')
  lines.push('')
  lines.push(plan.chainOfThought)
  lines.push('')

  lines.push('## Step-by-Step Plan')
  lines.push('')
  lines.push(`**Total Complexity:** ${plan.totalComplexity.replace('_', ' ')}`)
  lines.push('')

  for (const step of plan.steps) {
    lines.push(`### Step ${step.stepNumber}: ${step.title}`)
    lines.push('')
    lines.push(`**Complexity:** ${step.complexity} | **Risk:** ${step.riskLevel}`)
    if (step.dependencies.length > 0) {
      lines.push(`**Dependencies:** Steps ${step.dependencies.join(', ')}`)
    }
    lines.push('')
    lines.push(step.description)
    lines.push('')
    lines.push(`**Expected Outcome:** ${step.expectedOutcome}`)
    lines.push('')
  }

  if (plan.patternRecommendations.length > 0) {
    lines.push('## Design Pattern Recommendations')
    lines.push('')
    for (const rec of plan.patternRecommendations) {
      lines.push(`### ${rec.pattern} (${rec.category})`)
      lines.push('')
      lines.push(`**Rationale:** ${rec.rationale}`)
      lines.push('')
      lines.push('**Trade-offs:**')
      for (const tradeoff of rec.tradeoffs) {
        lines.push(`- ${tradeoff}`)
      }
      if (rec.implementationNotes) {
        lines.push('')
        lines.push(`**Implementation Notes:** ${rec.implementationNotes}`)
      }
      lines.push('')
    }
  }

  if (plan.rejectedAlternatives.length > 0) {
    lines.push('## Rejected Alternatives')
    lines.push('')
    for (const alt of plan.rejectedAlternatives) {
      lines.push(`### ${alt.name}`)
      lines.push('')
      lines.push(alt.description)
      lines.push('')
      lines.push(`**Rejected because:** ${alt.rejectionReason}`)
      if (alt.preferredWhen) {
        lines.push(`**Would be preferred when:** ${alt.preferredWhen}`)
      }
      lines.push('')
    }
  }

  if (plan.testPlan.length > 0) {
    lines.push('## Test Strategy')
    lines.push('')
    lines.push('| Priority | Strategy | Target | Description |')
    lines.push('|----------|----------|--------|-------------|')
    for (const test of plan.testPlan) {
      lines.push(
        `| ${test.priority} | ${test.strategy} | ${test.target} | ${test.description} |`
      )
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generate a PLANNING block template
 */
export function generatePlanningBlockTemplate(): string {
  return `<PLANNING>
## Understanding
[Describe your understanding of the problem]

## Key Constraints
- [Constraint 1]
- [Constraint 2]

## Assumptions
- [Assumption 1]
- [Assumption 2]

## Approach
[Describe the high-level approach]

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Patterns Considered
- [Pattern 1]: [Why it fits or doesn't fit]
- [Pattern 2]: [Why it fits or doesn't fit]

## Test Strategy
- Unit: [What to unit test]
- Integration: [What to integration test]
</PLANNING>`
}

/**
 * Get pattern by name
 */
export function getPatternInfo(
  pattern: DesignPattern
): (typeof DESIGN_PATTERN_CATALOG)[DesignPattern] {
  return DESIGN_PATTERN_CATALOG[pattern]
}

/**
 * Get all patterns in a category
 */
export function getPatternsByCategory(
  category: DesignPatternCategory
): DesignPattern[] {
  return (Object.keys(DESIGN_PATTERN_CATALOG) as DesignPattern[]).filter(
    (pattern) => DESIGN_PATTERN_CATALOG[pattern].category === category
  )
}

/**
 * Suggest patterns for a use case
 */
export function suggestPatternsForUseCase(useCase: string): DesignPattern[] {
  const normalizedUseCase = useCase.toLowerCase()
  const matches: Array<{ pattern: DesignPattern; score: number }> = []

  const tokenize = (text: string): string[] => {
    return text
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t))
  }

  const useCaseTokens = new Set(tokenize(useCase))

  for (const [pattern, info] of Object.entries(DESIGN_PATTERN_CATALOG)) {
    let score = 0
    const intentTokens = tokenize(info.intent)
    for (const uc of info.useCases) {
      const ucNormalized = uc.toLowerCase()
      const ucTokens = tokenize(uc)

      // Strong match if a whole phrase appears.
      if (
        normalizedUseCase.includes(ucNormalized) ||
        ucNormalized.includes(normalizedUseCase)
      ) {
        score += 6
      }

      // Token overlap (handles pluralization and word order changes).
      for (const token of ucTokens) {
        if (useCaseTokens.has(token)) score += 2
      }
    }

    // Intent overlap (helps when use case phrasing differs).
    for (const token of intentTokens) {
      if (useCaseTokens.has(token)) score += 1
    }

    // Lightweight domain heuristics to improve suggestions.
    if (pattern === 'OBSERVER') {
      if (
        useCaseTokens.has('event') ||
        useCaseTokens.has('notify') ||
        useCaseTokens.has('notification')
      ) {
        score += 8
      }
    }

    if (score > 0) {
      matches.push({ pattern: pattern as DesignPattern, score })
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((m) => m.pattern)
}
