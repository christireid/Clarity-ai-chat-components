'use client'

import React from 'react'
import { StructuredInputBuilder } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

function BasicBuilderDemo() {
  const [values, setValues] = React.useState({})

  const fields = [
    {
      id: 'topic',
      name: 'topic',
      label: 'Topic',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g. Quantum Physics',
    },
    {
      id: 'tone',
      name: 'tone',
      label: 'Tone',
      type: 'select' as const,
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'funny', label: 'Funny' },
      ],
      required: true,
    },
    {
      id: 'details',
      name: 'details',
      label: 'Additional Details',
      type: 'textarea' as const,
      rows: 3,
    },
  ]

  return (
    <div className="w-full max-w-lg p-6 border border-border rounded-lg bg-background">
      <StructuredInputBuilder
        fields={fields}
        values={values}
        onChange={setValues}
        onSubmit={(result) => alert(JSON.stringify(result, null, 2))}
      />
    </div>
  )
}

const props: Prop[] = [
  {
    name: 'fields',
    type: 'StructuredInputField[]',
    required: true,
    description: 'Field configurations defining the input structure.',
  },
  {
    name: 'values',
    type: 'Record<string, string>',
    required: true,
    description: 'Current field values state object.',
  },
  {
    name: 'onChange',
    type: '(values: Record<string, string>) => void',
    required: true,
    description: 'Callback when any field value changes.',
  },
  {
    name: 'onSubmit',
    type: '(result: StructuredInputResult) => void',
    description: 'Callback when user submits the form.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum input tokens budget for optimization.',
  },
  {
    name: 'showTokenBreakdown',
    type: 'boolean',
    default: 'false',
    description: 'Show visual token estimates per field.',
  },
  {
    name: 'showTotalTokens',
    type: 'boolean',
    default: 'false',
    description: 'Show total token count summary.',
  },
  {
    name: 'formatPrompt',
    type: '(values: Record<string, string>, fields: StructuredInputField[]) => string',
    description: 'Custom function to format the final prompt string.',
  },
  {
    name: 'displayMode',
    type: '"form" | "compact" | "inline"',
    default: '"form"',
    description: 'Visual layout mode for the builder.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable all inputs.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

export function StructuredInputBuilderContent() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            StructuredInputBuilder
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Build complex structured prompts with token optimization, field
            prioritization, validation, and automatic prompt formatting. Perfect
            for "mad libs" style prompt engineering.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ViewInStorybook component="StructuredInputBuilder" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <YouWillLearn
          items={[
            'Create structured input forms for prompts',
            'Configure field priorities for token optimization',
            'Validate field inputs',
            'Format prompts automatically',
            'Track token usage per field',
          ]}
        />
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 id="basic-usage">Basic Usage</h2>
        <p className="mb-4">
          Define your fields and manage the state. The component handles
          rendering and formatting.
        </p>
        <ComponentPreview
          title="Prompt Builder"
          description="A simple form to build a structured prompt."
          code={`import { useState } from 'react'
import { StructuredInputBuilder } from '@clarity-chat/react/internal'

function PromptBuilder() {
  const [values, setValues] = useState({})

  const fields = [
    {
      id: 'topic',
      name: 'topic',
      label: 'Topic',
      type: 'text',
      required: true,
    },
    {
      id: 'tone',
      name: 'tone',
      label: 'Tone',
      type: 'select',
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
      ],
    },
    {
      id: 'details',
      name: 'details',
      label: 'Additional Details',
      type: 'textarea',
    },
  ]

  return (
    <StructuredInputBuilder
      fields={fields}
      values={values}
      onChange={setValues}
      onSubmit={(result) => logger.debug(result)}
    />
  )
}`}
        >
          <BasicBuilderDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <h2 id="token-optimization">Token Optimization</h2>
        <p className="mb-4">
          Configure field priorities to automatically trim content when
          exceeding token limits:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`const fields = [
  {
    id: 'instruction',
    priority: 'critical', // Never trimmed
    // ...
  },
  {
    id: 'context',
    priority: 'high', // Trimmed only if critical fits
    // ...
  },
  {
    id: 'examples',
    priority: 'low', // Trimmed first
    // ...
  }
]

<StructuredInputBuilder
  fields={fields}
  maxTokens={1000}
  showTokenBreakdown
/>`}
        />
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-muted-foreground">
            Experiment with different field types and priorities.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const [values, setValues] = React.useState({})

  const fields = [
    {
      id: 'task',
      name: 'task',
      label: 'Task',
      type: 'textarea',
      required: true,
      priority: 'critical',
      placeholder: 'What should the AI do?'
    },
    {
      id: 'context',
      name: 'context',
      label: 'Context',
      type: 'textarea',
      priority: 'medium',
      placeholder: 'Background information...'
    }
  ]

  return (
    <div className="p-4 border rounded-lg bg-background">
      <StructuredInputBuilder
        fields={fields}
        values={values}
        onChange={setValues}
        showTokenBreakdown
        showTotalTokens
      />
      <div className="mt-4 p-3 bg-muted rounded text-xs font-mono">
        {JSON.stringify(values, null, 2)}
      </div>
    </div>
  )
}

render(<Example />)`}
          />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.6}>
        <div className="grid md:grid-cols-2 gap-8 my-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Field Types</h3>
            <ul className="space-y-2">
              <li>
                <code>text</code> - Single line input
              </li>
              <li>
                <code>textarea</code> - Multi-line text area
              </li>
              <li>
                <code>select</code> - Dropdown selection
              </li>
              <li>
                <code>number</code> - Numeric input
              </li>
              <li>
                <code>toggle</code> - Boolean switch
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Priority Levels</h3>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-red-500">critical</span> -
                Never trimmed
              </li>
              <li>
                <span className="font-semibold text-orange-500">high</span> -
                Trimmed last
              </li>
              <li>
                <span className="font-semibold text-yellow-500">medium</span> -
                Standard priority
              </li>
              <li>
                <span className="font-semibold text-blue-500">low</span> -
                Trimmed first
              </li>
            </ul>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.7}>
        <h2 id="props">Props</h2>
        <PropsTable props={props} />
      </ScrollReveal>

      <ScrollReveal delay={0.8}>
        <h2 id="related">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/reference/components/token-counter"
            className="p-4 border rounded-lg hover:border-brand-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">TokenCounter</h3>
            <p className="text-sm text-muted-foreground">
              Standalone token counting component
            </p>
          </a>
          <a
            href="/guides/token-optimization"
            className="p-4 border rounded-lg hover:border-brand-500 transition-colors"
          >
            <h3 className="font-semibold mb-1">Token Optimization Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn about optimization strategies
            </p>
          </a>
        </div>
      </ScrollReveal>
    </div>
  )
}
