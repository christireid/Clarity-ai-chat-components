/**
 * Abstract Factory Pattern
 * @packageDocumentation
 */
export const ABSTRACT_FACTORY = {
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
};
//# sourceMappingURL=abstract-factory.js.map