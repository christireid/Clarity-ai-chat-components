import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { PromptPlayground, builtInPrompts } from '@clarity-chat/react'
import type { PromptTemplate } from '@clarity-chat/react'

/**
 * PromptPlayground provides an interactive environment for testing
 * and iterating on prompt templates with live preview.
 *
 * ## Features
 * - Live template editing with variable detection
 * - Real-time rendering preview
 * - Token counting and cost estimation
 * - Multiple model pricing support
 * - Variable management
 * - Template validation
 *
 * ## Use Cases
 * - Prompt engineering and iteration
 * - Cost optimization for AI applications
 * - Template testing before deployment
 * - Training and onboarding for prompt writing
 */
const meta: Meta<typeof PromptPlayground> = {
  title: 'Advanced/AI/PromptPlayground',
  component: PromptPlayground,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive playground for testing and experimenting with prompt templates.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'number',
      description: 'Height of the component in pixels',
    },
    showModelSelector: {
      control: 'boolean',
      description: 'Show model selector dropdown',
    },
    showCostEstimate: {
      control: 'boolean',
      description: 'Show cost estimation',
    },
    showTokenCount: {
      control: 'boolean',
      description: 'Show token count badge',
    },
    showValidation: {
      control: 'boolean',
      description: 'Show validation status',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read-only mode',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample templates for stories
const sampleTemplates: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Get a thorough code review',
    template: `Review the following {{language}} code for:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security vulnerabilities

Code:
\`\`\`{{language}}
{{code}}
\`\`\`

Provide specific suggestions for improvement.`,
    variables: [
      { name: 'language', type: 'string', default: 'TypeScript', required: true },
      { name: 'code', type: 'string', required: true },
    ],
    tags: ['code', 'review', 'development'],
  },
  {
    id: 'email-draft',
    name: 'Email Draft',
    description: 'Draft professional emails',
    template: `Write a {{tone}} email to {{recipient}} about {{subject}}.

Key points to include:
{{keyPoints}}

Keep it {{length}}.`,
    variables: [
      { name: 'tone', type: 'string', default: 'professional', required: true },
      { name: 'recipient', type: 'string', required: true },
      { name: 'subject', type: 'string', required: true },
      { name: 'keyPoints', type: 'string', required: true },
      { name: 'length', type: 'string', default: 'concise', required: false },
    ],
    tags: ['email', 'writing', 'business'],
  },
  builtInPrompts.summarize,
  builtInPrompts.qa,
  builtInPrompts.translate,
]

/**
 * Default playground with an empty template
 */
export const Default: Story = {
  args: {
    height: 600,
    showModelSelector: true,
    showCostEstimate: true,
    showTokenCount: true,
    showValidation: true,
  },
}

/**
 * Playground with pre-loaded template
 */
export const WithTemplate: Story = {
  args: {
    template: sampleTemplates[0],
    height: 600,
    showModelSelector: true,
    showCostEstimate: true,
    showTokenCount: true,
  },
}

/**
 * Playground with template selector
 */
export const WithTemplateSelector: Story = {
  args: {
    templates: sampleTemplates,
    height: 600,
    showModelSelector: true,
    showCostEstimate: true,
  },
  render: (args) => {
    const [savedTemplates, setSavedTemplates] = React.useState(sampleTemplates)

    return (
      <PromptPlayground
        {...args}
        templates={savedTemplates}
        onSave={(template) => {
          setSavedTemplates((prev) => {
            const idx = prev.findIndex((t) => t.id === template.id)
            if (idx >= 0) {
              const updated = [...prev]
              updated[idx] = template
              return updated
            }
            return [...prev, template]
          })
        }}
      />
    )
  },
}

/**
 * Compact playground for embedded use
 */
export const Compact: Story = {
  args: {
    height: 400,
    showModelSelector: false,
    showCostEstimate: false,
    showTokenCount: true,
    showValidation: true,
  },
}

/**
 * Read-only mode for viewing templates
 */
export const ReadOnly: Story = {
  args: {
    template: sampleTemplates[0],
    height: 500,
    readOnly: true,
    showModelSelector: false,
    showCostEstimate: true,
    showTokenCount: true,
  },
}

/**
 * Interactive example with save callback
 */
export const WithSaveCallback: Story = {
  args: {
    height: 600,
    showModelSelector: true,
    showCostEstimate: true,
  },
  render: (args) => {
    const [lastSaved, setLastSaved] = React.useState<PromptTemplate | null>(null)

    return (
      <div className="space-y-4">
        <PromptPlayground
          {...args}
          onSave={(template) => {
            setLastSaved(template)
            console.log('Saved template:', template)
          }}
        />
        {lastSaved && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Last saved:</p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(lastSaved, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  },
}

/**
 * Full-featured example with all options
 */
export const FullFeatured: Story = {
  args: {
    templates: sampleTemplates,
    height: 700,
    showModelSelector: true,
    showCostEstimate: true,
    showTokenCount: true,
    showValidation: true,
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <p>
          <strong>Instructions:</strong> Select a template from the dropdown, edit
          variables, and see the live preview.
        </p>
      </div>
      <PromptPlayground {...args} />
    </div>
  ),
}
