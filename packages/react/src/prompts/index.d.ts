/**
 * Prompt Template System
 *
 * Flexible, optional prompt management utilities.
 * Use as much or as little as you need.
 *
 * @example
 * ```tsx
 * // Simple variable substitution
 * const prompt = renderPrompt(
 *   'Hello {{name}}, you are {{age}} years old.',
 *   { name: 'Alice', age: 30 }
 * )
 *
 * // Using template objects
 * const template: PromptTemplate = {
 *   id: 'greeting',
 *   name: 'Greeting Template',
 *   template: 'Hello {{name}}!',
 *   variables: [
 *     {
 *       name: 'name',
 *       type: 'string',
 *       required: true,
 *     },
 *   ],
 * }
 *
 * const engine = new PromptTemplateEngine()
 * const result = engine.render(template, {
 *   variables: { name: 'Alice' },
 *   validate: true,
 * })
 *
 * // Managing a library (optional)
 * const library = new PromptLibrary()
 * library.add(template)
 * const retrieved = library.get('greeting')
 * ```
 */
export * from './types';
export * from './template';
export * from './library';
import type { PromptTemplate } from './types';
/**
 * Built-in prompt templates (optional, for reference)
 */
export declare const builtInPrompts: Record<string, PromptTemplate>;
//# sourceMappingURL=index.d.ts.map