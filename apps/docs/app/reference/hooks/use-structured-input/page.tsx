import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useStructuredInput - Clarity Chat Components',
  description: 'Hook for managing structured input forms with token optimization and validation.',
}

const optionsProps: Prop[] = [
  {
    name: 'fields',
    type: 'StructuredInputField[]',
    required: true,
    description: 'Field configurations',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum input tokens budget',
  },
  {
    name: 'formatPrompt',
    type: '(values: Record<string, string>, fields: StructuredInputField[]) => string',
    description: 'Custom prompt formatter',
  },
  {
    name: 'defaultValues',
    type: 'Record<string, string>',
    description: 'Default field values',
  },
]

export default function UseStructuredInputPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useStructuredInput</h1>
        <p className="docs-lead">
          Hook for managing structured input forms with token optimization, field prioritization, and validation.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Manage structured input state',
          'Validate field inputs',
          'Format prompts automatically',
          'Track token usage per field',
          'Handle form submission',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Manage structured input form:
        </p>
        <CodePlayground
          initialCode={`import { useStructuredInput } from '@clarity-chat/react'

function PromptBuilder() {
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
      required: false,
      section: 'context' as const,
      priority: 'high' as const,
    },
  ]

  const {
    values,
    setValue,
    result,
    errors,
    isValid,
    submit,
  } = useStructuredInput({
    fields,
    maxTokens: 2000,
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      submit()
      if (isValid) {
        console.log('Formatted prompt:', result.formattedPrompt)
      }
    }}>
      {fields.map(field => (
        <div key={field.id}>
          <label>{field.label}</label>
          <textarea
            value={values[field.id] || ''}
            onChange={(e) => setValue(field.id, e.target.value)}
          />
          {errors[field.id] && <div>{errors[field.id]}</div>}
        </div>
      ))}
      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Token Tracking</h2>
        <p>
          Track token usage per field:
        </p>
        <CodePlayground
          initialCode={`import { useStructuredInput } from '@clarity-chat/react'

function WithTokenTracking() {
  const { result, tokenBreakdown } = useStructuredInput({
    fields,
    maxTokens: 2000,
  })

  return (
    <div>
      <div>Total tokens: {result.totalTokens}</div>
      {tokenBreakdown.map(breakdown => (
        <div key={breakdown.fieldId}>
          {breakdown.fieldName}: {breakdown.tokens} tokens ({breakdown.percentage}%)
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Prompt Formatting</h2>
        <p>
          Provide custom prompt formatting:
        </p>
        <CodePlayground
          initialCode={`import { useStructuredInput } from '@clarity-chat/react'

function CustomFormatter() {
  const { result } = useStructuredInput({
    fields,
    formatPrompt: (values, fields) => {
      // Custom formatting logic
      return \`Instruction: \${values.instruction}\\n\\nContext: \${values.context}\`
    },
  })

  return <div>{result.formattedPrompt}</div>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Field Validation</h2>
        <p>
          Validate fields with custom validation functions:
        </p>
        <CodePlayground
          initialCode={`import { useStructuredInput } from '@clarity-chat/react'

function WithValidation() {
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
  ]

  const { errors, isValid } = useStructuredInput({ fields })

  return (
    <div>
      {Object.keys(errors).length > 0 && (
        <div>Validation errors: {Object.values(errors).join(', ')}</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li><code>values</code>: Current field values</li>
          <li><code>setValue</code>: Function to update a field value</li>
          <li><code>result</code>: Structured input result (values, formattedPrompt, tokenBreakdown, errors, isValid)</li>
          <li><code>errors</code>: Validation errors by field ID</li>
          <li><code>isValid</code>: Whether all required fields are valid</li>
          <li><code>submit</code>: Function to submit and validate form</li>
          <li><code>tokenBreakdown</code>: Token breakdown by field</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Set appropriate <code>priority</code> levels for token optimization</li>
          <li>Use <code>section</code> types to organize prompt structure</li>
          <li>Enable validation for data quality</li>
          <li>Set <code>maxTokens</code> to enforce token budgets</li>
          <li>Use custom formatters for specific prompt formats</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/structured-input-builder">StructuredInputBuilder</a> - Structured input component</li>
          <li><a href="/guides/token-optimization">Token Optimization Guide</a> - Optimization strategies</li>
        </ul>
      </section>
    </div>
  )
}
