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

export * from './types'
export * from './template'
export * from './library'

import type { PromptTemplate } from './types'

/**
 * Built-in prompt templates (optional, for reference)
 */
export const builtInPrompts: Record<string, PromptTemplate> = {
  summarize: {
    id: 'summarize',
    name: 'Summarize Text',
    description: 'Summarize the given text in the specified style',
    template: `Please summarize the following text{{#if style}} in a {{style}} style{{/if}}:

{{text}}

Summary:`,
    variables: [
      {
        name: 'text',
        type: 'string',
        required: true,
        description: 'The text to summarize',
      },
      {
        name: 'style',
        type: 'string',
        required: false,
        description: 'Summary style (e.g., "concise", "detailed")',
      },
    ],
    tags: ['text', 'summary', 'content'],
  },
  
  qa: {
    id: 'qa',
    name: 'Question Answering',
    description: 'Answer a question based on provided context',
    template: `Context:
{{context}}

Question: {{question}}

Please provide a clear and accurate answer based on the context above.

Answer:`,
    variables: [
      {
        name: 'context',
        type: 'string',
        required: true,
        description: 'The context to use for answering',
      },
      {
        name: 'question',
        type: 'string',
        required: true,
        description: 'The question to answer',
      },
    ],
    tags: ['qa', 'rag', 'question'],
  },
  
  classify: {
    id: 'classify',
    name: 'Text Classification',
    description: 'Classify text into predefined categories',
    template: `Classify the following text into one of these categories: {{categories}}

Text: {{text}}

Category:`,
    variables: [
      {
        name: 'text',
        type: 'string',
        required: true,
      },
      {
        name: 'categories',
        type: 'array',
        required: true,
        description: 'Available categories',
      },
    ],
    tags: ['classification', 'category'],
  },
  
  extract: {
    id: 'extract',
    name: 'Entity Extraction',
    description: 'Extract specific information from text',
    template: `Extract the following information from the text: {{entities}}

Text: {{text}}

Extracted information (JSON format):`,
    variables: [
      {
        name: 'text',
        type: 'string',
        required: true,
      },
      {
        name: 'entities',
        type: 'array',
        required: true,
        description: 'Entities to extract',
      },
    ],
    tags: ['extraction', 'entities', 'ner'],
  },
  
  translate: {
    id: 'translate',
    name: 'Translation',
    description: 'Translate text to another language',
    template: `Translate the following text from {{sourceLang}} to {{targetLang}}:

{{text}}

Translation:`,
    variables: [
      {
        name: 'text',
        type: 'string',
        required: true,
      },
      {
        name: 'sourceLang',
        type: 'string',
        required: false,
      },
      {
        name: 'targetLang',
        type: 'string',
        required: true,
      },
    ],
    tags: ['translation', 'language'],
  },
}

