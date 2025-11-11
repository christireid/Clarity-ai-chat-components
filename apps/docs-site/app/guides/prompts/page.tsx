import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Prompt Templates - Clarity Chat',
  description: 'Clarity Chat provides a flexible prompt template system for managing and rendering AI prompts with variables, validation, and versioning.',
}

export default function PromptsGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Prompt Templates</h1>
        <p className="docs-lead">
          Clarity Chat provides a flexible prompt template system for managing and rendering AI prompts with variables, validation, and versioning. Perfect for building reusable prompts, A/B testing, and prompt management.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The prompt template system allows you to:
        </p>
        <ul>
          <li>Create reusable prompt templates with variables</li>
          <li>Validate prompt variables before rendering</li>
          <li>Manage a library of prompts</li>
          <li>Version prompts for A/B testing</li>
          <li>Use built-in templates for common tasks</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Installation</h2>
        <p>
          Prompt utilities are included in <code>@clarity-chat/react</code>:
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  PromptTemplateEngine,
  PromptTemplateLibrary,
  renderPrompt,
  builtInPrompts,
} from '@clarity-chat/react'`}
        />
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>

        <h3>Simple Variable Substitution</h3>
        <CodeBlock
          language="tsx"
          code={`import { renderPrompt } from '@clarity-chat/react'

const prompt = renderPrompt(
  'Hello {{name}}, you are {{age}} years old.',
  { name: 'Alice', age: 30 }
)

console.log(prompt)
// "Hello Alice, you are 30 years old."`}
        />

        <h3>Using Template Objects</h3>
        <CodeBlock
          language="tsx"
          code={`import { PromptTemplateEngine } from '@clarity-chat/react'
import type { PromptTemplate } from '@clarity-chat/react'

const template: PromptTemplate = {
  id: 'greeting',
  name: 'Greeting Template',
  description: 'A friendly greeting',
  template: 'Hello {{name}}! Welcome to {{app}}.',
  variables: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'User name',
    },
    {
      name: 'app',
      type: 'string',
      required: true,
      description: 'Application name',
    },
  ],
}

const engine = new PromptTemplateEngine()
const result = engine.render(template, {
  variables: {
    name: 'Alice',
    app: 'Clarity Chat',
  },
  validate: true,
})

console.log(result.prompt)
// "Hello Alice! Welcome to Clarity Chat."`}
        />
      </section>

      <section className="docs-section">
        <h2>Template Variables</h2>

        <h3>Variable Types</h3>
        <p>
          Variables can be of different types:
        </p>
        <CodeBlock
          language="tsx"
          code={`const template: PromptTemplate = {
  id: 'example',
  template: '{{stringVar}} {{numberVar}} {{booleanVar}}',
  variables: [
    {
      name: 'stringVar',
      type: 'string',
      required: true,
    },
    {
      name: 'numberVar',
      type: 'number',
      default: 0,
    },
    {
      name: 'booleanVar',
      type: 'boolean',
      default: false,
    },
  ],
}`}
        />

        <h3>Nested Variables</h3>
        <p>
          Access nested object properties:
        </p>
        <CodeBlock
          language="tsx"
          code={`const prompt = renderPrompt(
  'Hello {{user.name}}, your email is {{user.email}}.',
  {
    user: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  }
)`}
        />

        <h3>Array Variables</h3>
        <p>
          Arrays are automatically joined:
        </p>
        <CodeBlock
          language="tsx"
          code={`const prompt = renderPrompt(
  'Categories: {{categories}}',
  {
    categories: ['tech', 'ai', 'chat'],
  }
)
// "Categories: tech, ai, chat"`}
        />
      </section>

      <section className="docs-section">
        <h2>Validation</h2>

        <h3>Required Variables</h3>
        <CodeBlock
          language="tsx"
          code={`const template: PromptTemplate = {
  id: 'validated',
  template: 'Hello {{name}}!',
  variables: [
    {
      name: 'name',
      type: 'string',
      required: true,
    },
  ],
}

const engine = new PromptTemplateEngine()
const result = engine.render(template, {
  variables: {},
  validate: true,
})

if (!result.success) {
  console.error(result.errors)
  // ["Missing required variable: name"]
}`}
        />

        <h3>Custom Validation</h3>
        <CodeBlock
          language="tsx"
          code={`const template: PromptTemplate = {
  id: 'validated',
  template: 'Age: {{age}}',
  variables: [
    {
      name: 'age',
      type: 'number',
      required: true,
      validate: (value) => {
        if (typeof value !== 'number') {
          return 'Age must be a number'
        }
        if (value < 0 || value > 150) {
          return 'Age must be between 0 and 150'
        }
        return true
      },
    },
  ],
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Prompt Library</h2>
        <p>
          Manage a collection of prompts:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { PromptTemplateLibrary } from '@clarity-chat/react'

const library = new PromptTemplateLibrary()

// Add templates
library.add({
  id: 'greeting',
  name: 'Greeting',
  template: 'Hello {{name}}!',
  variables: [{ name: 'name', type: 'string', required: true }],
})

library.add({
  id: 'farewell',
  name: 'Farewell',
  template: 'Goodbye {{name}}!',
  variables: [{ name: 'name', type: 'string', required: true }],
})

// Retrieve templates
const greeting = library.get('greeting')
const farewell = library.getByName('Farewell')

// Search templates
const results = library.search('greet')
// Returns templates matching "greet"

// Get by tag
const tagged = library.getByTag('social')`}
        />
      </section>

      <section className="docs-section">
        <h2>Built-in Templates</h2>
        <p>
          Clarity Chat includes built-in templates for common tasks:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { builtInPrompts } from '@clarity-chat/react'

// Summarize text
const summarizeTemplate = builtInPrompts.summarize
const summary = renderPrompt(summarizeTemplate.template, {
  text: 'Long article text...',
  style: 'concise',
})

// Question answering
const qaTemplate = builtInPrompts.qa
const qaPrompt = renderPrompt(qaTemplate.template, {
  context: 'Context information...',
  question: 'What is the answer?',
})

// Text classification
const classifyTemplate = builtInPrompts.classify
const classifyPrompt = renderPrompt(classifyTemplate.template, {
  text: 'Text to classify',
  categories: ['positive', 'negative', 'neutral'],
})

// Entity extraction
const extractTemplate = builtInPrompts.extract
const extractPrompt = renderPrompt(extractTemplate.template, {
  text: 'Text with entities',
  entities: ['name', 'email', 'phone'],
})

// Translation
const translateTemplate = builtInPrompts.translate
const translatePrompt = renderPrompt(translateTemplate.template, {
  text: 'Hello world',
  sourceLang: 'en',
  targetLang: 'es',
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Use Templates</strong>: Create reusable templates instead of hardcoding prompts</li>
          <li><strong>Validate Early</strong>: Always validate variables before rendering</li>
          <li><strong>Version Control</strong>: Use versioning for prompt A/B testing</li>
          <li><strong>Organize with Tags</strong>: Use tags to organize related templates</li>
          <li><strong>Document Variables</strong>: Always provide descriptions for variables</li>
          <li><strong>Use Built-ins</strong>: Leverage built-in templates when possible</li>
          <li><strong>Export/Import</strong>: Save prompt libraries for backup and sharing</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Learn about <a href="/guides/agents">AI Agents</a> for advanced prompt usage</li>
          <li>Check out <a href="/guides/rag">RAG System</a> for context-aware prompts</li>
          <li>See <a href="/guides/memory">Memory System</a> for persistent prompt context</li>
        </ul>
      </section>
    </div>
  )
}
