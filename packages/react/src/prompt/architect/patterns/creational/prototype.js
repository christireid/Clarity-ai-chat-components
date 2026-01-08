/**
 * Prototype Pattern
 * @packageDocumentation
 */
export const PROTOTYPE = {
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
};
//# sourceMappingURL=prototype.js.map