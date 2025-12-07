import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'StructuredInputBuilder - Clarity Chat Components',
  description: 'Build structured prompts with token optimization, field prioritization, and validation.',
}

const props: Prop[] = [
  {
    name: 'fields',
    type: 'StructuredInputField[]',
    required: true,
    description: 'Field configurations',
  },
  {
    name: 'values',
    type: 'Record<string, string>',
    required: true,
    description: 'Current field values',
  },
  {
    name: 'onChange',
    type: '(values: Record<string, string>) => void',
    required: true,
    description: 'Callback when values change',
  },
  {
    name: 'onSubmit',
    type: '(result: StructuredInputResult) => void',
    description: 'Callback when user submits the form',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum input tokens budget',
  },
  {
    name: 'showTokenBreakdown',
    type: 'boolean',
    description: 'Show token estimates per field',
  },
  {
    name: 'showTotalTokens',
    type: 'boolean',
    description: 'Show total token count',
  },
  {
    name: 'formatPrompt',
    type: '(values: Record<string, string>, fields: StructuredInputField[]) => string',
    description: 'Custom prompt formatter',
  },
  {
    name: 'displayMode',
    type: '"form" | "compact" | "inline"',
    description: 'Display mode',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    description: 'Size variant',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disabled state',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function StructuredInputBuilderPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>StructuredInputBuilder</h1>
        <p className="docs-lead">
          Build structured prompts with token optimization, field prioritization, validation, and automatic prompt formatting.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Create structured input forms for prompts',
          'Configure field priorities for token optimization',
          'Validate field inputs',
          'Format prompts automatically',
          'Track token usage per field',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Create a structured input form with field definitions:
        </p>
        <CodePlayground
          initialCode={`import { StructuredInputBuilder } from '@clarity-chat/react'

function PromptBuilder() {
  const [values, setValues] = React.useState({})

  const fields = [
    {
      id: 'instruction',
      name: 'instruction',
      label: 'Instruction',
      type: 'textarea' as const,
      required: true,
      section: 'instruction' as const,
      priority: 'critical' as const,
      rows: 3,
    },
    {
      id: 'context',
      name: 'context',
      label: 'Context',
      type: 'textarea' as const,
      required: false,
      section: 'context' as const,
      priority: 'high' as const,
      rows: 5,
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
}

render(<PromptBuilder />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Field Types</h2>
        <p>
          Support for multiple field types:
        </p>
        <CodePlayground
          initialCode={`import { StructuredInputBuilder } from '@clarity-chat/react'

function FieldTypesExample() {
  const fields = [
    {
      id: 'text',
      name: 'text',
      label: 'Text Input',
      type: 'text' as const,
      required: true,
    },
    {
      id: 'textarea',
      name: 'textarea',
      label: 'Textarea',
      type: 'textarea' as const,
      rows: 5,
    },
    {
      id: 'select',
      name: 'select',
      label: 'Select',
      type: 'select' as const,
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    },
    {
      id: 'number',
      name: 'number',
      label: 'Number',
      type: 'number' as const,
    },
    {
      id: 'toggle',
      name: 'toggle',
      label: 'Toggle',
      type: 'toggle' as const,
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={{}}
      onChange={() => {}}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Optimization</h2>
        <p>
          Configure field priorities for intelligent token trimming:
        </p>
        <CodePlayground
          initialCode={`import { StructuredInputBuilder } from '@clarity-chat/react'

function OptimizedBuilder() {
  const fields = [
    {
      id: 'critical',
      name: 'critical',
      label: 'Critical Field',
      type: 'textarea' as const,
      priority: 'critical' as const,  // Preserved during trimming
    },
    {
      id: 'high',
      name: 'high',
      label: 'High Priority',
      type: 'textarea' as const,
      priority: 'high' as const,
    },
    {
      id: 'low',
      name: 'low',
      label: 'Low Priority',
      type: 'textarea' as const,
      priority: 'low' as const,  // Trimmed first
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={{}}
      onChange={() => {}}
      maxTokens={2000}
      showTokenBreakdown={true}
      showTotalTokens={true}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Field Validation</h2>
        <p>
          Add custom validation to fields:
        </p>
        <CodePlayground
          initialCode={`import { StructuredInputBuilder } from '@clarity-chat/react'

function ValidatedBuilder() {
  const fields = [
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      type: 'text' as const,
      validate: (value: string) => {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
        return emailRegex.test(value) || 'Invalid email address'
      },
    },
    {
      id: 'maxLength',
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      maxLength: 500,
      validate: (value: string) => {
        return value.length <= 500 || 'Description must be 500 characters or less'
      },
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={{}}
      onChange={() => {}}
      onSubmit={(result) => {
        if (result.isValid) {
          console.log('Valid submission:', result.values)
        } else {
          console.log('Validation errors:', result.errors)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Prompt Formatting</h2>
        <p>
          Provide custom prompt formatting logic:
        </p>
        <CodePlayground
          initialCode={`import { StructuredInputBuilder } from '@clarity-chat/react'

function CustomFormatter() {
  const formatPrompt = (values: Record<string, string>, fields: any[]) => {
    // Custom formatting logic
    return \`Instruction: \${values.instruction}\\n\\nContext: \${values.context}\`
  }

  return (
    <StructuredInputBuilder
      fields={fields}
      values={{}}
      onChange={() => {}}
      formatPrompt={formatPrompt}
      onSubmit={(result) => {
        console.log('Custom formatted:', result.formattedPrompt)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Field Priority Levels</h2>
        <ul>
          <li><strong>critical</strong>: Never trimmed, always preserved</li>
          <li><strong>high</strong>: Trimmed only when necessary</li>
          <li><strong>medium</strong>: Trimmed before high priority fields</li>
          <li><strong>low</strong>: Trimmed first when token budget is exceeded</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Field Sections</h2>
        <ul>
          <li><strong>instruction</strong>: Core instructions</li>
          <li><strong>context</strong>: Background context</li>
          <li><strong>reference</strong>: Reference materials</li>
          <li><strong>question</strong>: User question</li>
          <li><strong>constraint</strong>: Constraints and requirements</li>
          <li><strong>example</strong>: Example inputs/outputs</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Set appropriate <code>priority</code> levels for token optimization</li>
          <li>Use <code>section</code> types to organize prompt structure</li>
          <li>Enable <code>showTokenBreakdown</code> to help users understand token usage</li>
          <li>Set <code>maxTokens</code> to enforce token budgets</li>
          <li>Use validation functions for data quality</li>
          <li>Provide helpful descriptions for each field</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/token-counter">TokenCounter</a> - Token usage display</li>
          <li><a href="/reference/hooks/use-structured-input">useStructuredInput</a> - Structured input hook</li>
          <li><a href="/guides/token-optimization">Token Optimization Guide</a> - Optimization strategies</li>
        </ul>
      </section>
    </div>
  )
}
