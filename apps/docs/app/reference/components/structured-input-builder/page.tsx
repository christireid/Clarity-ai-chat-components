'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'StructuredInputBuilder Component | Clarity Chat',
  description: 'Build structured prompts with token optimization, field validation, and automatic formatting.',
}

const structuredInputBuilderProps: Prop[] = [
  {
    name: 'fields',
    type: 'StructuredInputField[]',
    required: true,
    description: 'Array of field configurations defining the input structure.',
  },
  {
    name: 'values',
    type: 'Record<string, string>',
    required: true,
    description: 'Current field values (controlled component).',
  },
  {
    name: 'onChange',
    type: '(values: Record<string, string>) => void',
    required: true,
    description: 'Callback when field values change.',
  },
  {
    name: 'onSubmit',
    type: '(result: StructuredInputResult) => void',
    description: 'Callback when form is submitted with validation results.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum token budget for the structured input.',
  },
  {
    name: 'showTokenBreakdown',
    type: 'boolean',
    default: 'false',
    description: 'Show token estimates per field.',
  },
  {
    name: 'showTotalTokens',
    type: 'boolean',
    default: 'false',
    description: 'Show total token count.',
  },
  {
    name: 'formatPrompt',
    type: '(values: Record<string, string>, fields: StructuredInputField[]) => string',
    description: 'Custom function to format the prompt from field values.',
  },
  {
    name: 'displayMode',
    type: '"form" | "compact" | "inline"',
    default: '"form"',
    description: 'Visual display mode for the builder.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Size variant for form fields.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable all fields.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
  {
    name: 'submitLabel',
    type: 'string',
    default: '"Submit"',
    description: 'Text for the submit button.',
  },
  {
    name: 'showSubmitButton',
    type: 'boolean',
    default: 'true',
    description: 'Show submit button.',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Title for the builder.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Description text for the builder.',
  },
]

export default function StructuredInputBuilderPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>StructuredInputBuilder</h1>

      <p className="lead">
        Build structured prompts with token optimization, field validation, and automatic
        formatting. Perfect for complex AI prompts that need organization and token management.
      </p>

      <Callout type="info" title="Token Optimization">
        <p>
          This component automatically estimates tokens per field and can optimize prompts
          to fit within token budgets by prioritizing critical fields.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StructuredInputBuilder } from '@clarity-chat/react'
import { useState } from 'react'

function PromptBuilder() {
  const [values, setValues] = useState({})

  const fields = [
    {
      id: 'instruction',
      name: 'instruction',
      label: 'Instruction',
      type: 'textarea' as const,
      required: true,
      section: 'instruction' as const,
      priority: 'critical' as const,
    },
    {
      id: 'context',
      name: 'context',
      label: 'Context',
      type: 'textarea' as const,
      section: 'context' as const,
      priority: 'high' as const,
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      onSubmit={(result) => {
        console.log('Formatted prompt:', result.formattedPrompt)
        console.log('Total tokens:', result.totalTokens)
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Try the StructuredInputBuilder component:
        </p>
        <CodePlayground
          initialCode={`import { StructuredInputBuilder } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const [values, setValues] = useState({})

  const fields = [
    {
      id: 'task',
      name: 'task',
      label: 'Task',
      type: 'text',
      required: true,
      placeholder: 'What should the AI do?',
      section: 'instruction',
      priority: 'critical',
    },
    {
      id: 'tone',
      name: 'tone',
      label: 'Tone',
      type: 'select',
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'friendly', label: 'Friendly' },
      ],
      section: 'constraint',
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      showTokenBreakdown
      showTotalTokens
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Token Budget</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StructuredInputBuilder } from '@clarity-chat/react'

function PromptBuilder() {
  const [values, setValues] = useState({})

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      maxTokens={2000}
      showTokenBreakdown
      showTotalTokens
      onSubmit={(result) => {
        if (result.totalTokens > 2000) {
          alert('Prompt exceeds token budget!')
        } else {
          sendToAI(result.formattedPrompt)
        }
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Field Validation</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StructuredInputBuilder } from '@clarity-chat/react'

function PromptBuilder() {
  const fields = [
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      type: 'text',
      required: true,
      validate: (value) => {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
        return emailRegex.test(value) || 'Invalid email address'
      },
    },
    {
      id: 'age',
      name: 'age',
      label: 'Age',
      type: 'number',
      validate: (value) => {
        const age = parseInt(value)
        return (age >= 18 && age <= 120) || 'Age must be between 18 and 120'
      },
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      onSubmit={(result) => {
        if (result.isValid) {
          console.log('All fields valid:', result.values)
        } else {
          console.log('Validation errors:', result.errors)
        }
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Formatting</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StructuredInputBuilder } from '@clarity-chat/react'

function PromptBuilder() {
  const customFormatter = (values: Record<string, string>, fields: StructuredInputField[]) => {
    // Custom prompt formatting logic
    const sections = {
      instruction: values.instruction || '',
      context: values.context ? `Context: ${values.context}` : '',
      question: values.question ? `Question: ${values.question}` : '',
    }

    return Object.values(sections)
      .filter(Boolean)
      .join('\\n\\n')
  }

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      formatPrompt={customFormatter}
      onSubmit={(result) => {
        console.log('Custom formatted:', result.formattedPrompt)
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Priority-Based Optimization</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StructuredInputBuilder } from '@clarity-chat/react'

function PromptBuilder() {
  const fields = [
    {
      id: 'instruction',
      name: 'instruction',
      label: 'Core Instruction',
      type: 'textarea',
      required: true,
      priority: 'critical', // Will be preserved during trimming
      section: 'instruction',
    },
    {
      id: 'example',
      name: 'example',
      label: 'Example',
      type: 'textarea',
      priority: 'low', // Can be trimmed first if needed
      section: 'example',
    },
    {
      id: 'context',
      name: 'context',
      label: 'Context',
      type: 'textarea',
      priority: 'high', // Important but can be trimmed if necessary
      section: 'context',
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      maxTokens={1500}
      showTokenBreakdown
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Compact Display Mode</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StructuredInputBuilder } from '@clarity-chat/react'

function CompactBuilder() {
  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      displayMode="compact"
      size="sm"
      showSubmitButton={false}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={structuredInputBuilderProps} />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Field Configuration</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Each field in the <code>fields</code> array supports the following configuration:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`interface StructuredInputField {
  id: string                    // Unique identifier
  name: string                  // Field name (used in output)
  label: string                 // Display label
  type: 'text' | 'textarea' | 'select' | 'number' | 'toggle'
  required?: boolean            // Whether field is required
  defaultValue?: string         // Default value
  description?: string           // Help text
  placeholder?: string          // Placeholder text
  maxLength?: number            // Max character length
  options?: SelectOption[]       // Options for select type
  validate?: (value: string) => boolean | string  // Validation function
  priority?: 'critical' | 'high' | 'medium' | 'low'  // Token optimization priority
  section?: 'instruction' | 'context' | 'reference' | 'question' | 'constraint' | 'example'
  rows?: number                 // Rows for textarea
  disabled?: boolean            // Whether field is disabled
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Token Optimization</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The component automatically estimates tokens and can optimize prompts:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Token estimation</strong> - Estimates tokens per field using the tokenizer</li>
          <li><strong>Priority-based trimming</strong> - Trims low-priority fields first when over budget</li>
          <li><strong>Token breakdown</strong> - Shows token usage per field</li>
          <li><strong>Budget enforcement</strong> - Warns or prevents submission when over budget</li>
        </ul>
        <Callout type="warning" title="Token Estimation">
          <p>
            Token estimation is approximate. Actual token counts may vary slightly depending
            on the model's tokenizer. Use this as a guide, not an exact measurement.
          </p>
        </Callout>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Section Types</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Fields can be organized into sections for better prompt structure:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>instruction</strong> - Core instructions for the AI</li>
          <li><strong>context</strong> - Background information</li>
          <li><strong>reference</strong> - Reference materials or examples</li>
          <li><strong>question</strong> - The question or query</li>
          <li><strong>constraint</strong> - Constraints or limitations</li>
          <li><strong>example</strong> - Example inputs/outputs</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Integration with Chat</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Use with ClarityChat to build structured prompts:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StructuredInputBuilder, ClarityChat } from '@clarity-chat/react'

function ChatWithBuilder() {
  const [values, setValues] = useState({})
  const [prompt, setPrompt] = useState('')

  return (
    <div>
      <StructuredInputBuilder
        fields={fields}
        values={values}
        onChange={setValues}
        onSubmit={(result) => {
          setPrompt(result.formattedPrompt)
        }}
      />
      {prompt && (
        <ClarityChat
          api="/api/chat"
          initialMessages={[
            { role: 'system', content: prompt },
          ]}
        />
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          StructuredInputBuilder is built with accessibility in mind:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Proper form labels and ARIA attributes</li>
          <li>Keyboard navigation support</li>
          <li>Screen reader announcements for validation errors</li>
          <li>Focus management</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/advanced-chat-input" className="docs-card">
            <h3>AdvancedChatInput Component</h3>
            <p>Enhanced input with file uploads and mentions</p>
          </a>
          <a href="/reference/hooks/use-token-optimization" className="docs-card">
            <h3>useTokenOptimization Hook</h3>
            <p>Token optimization utilities</p>
          </a>
          <a href="/guides/token-optimization" className="docs-card">
            <h3>Token Optimization Guide</h3>
            <p>Complete token optimization guide</p>
          </a>
          <a href="/cookbook/structured-prompts" className="docs-card">
            <h3>Structured Prompts Recipe</h3>
            <p>Recipe for building structured prompts</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'FileUpload', href: '/reference/components/file-upload' }}
        next={{ title: 'ModelSelector', href: '/reference/components/model-selector' }}
      />
    </>
  )
}
