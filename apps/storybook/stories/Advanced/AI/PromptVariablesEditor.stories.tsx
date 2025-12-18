import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { PromptVariablesEditor } from '@clarity-chat/react'
import type { PromptVariable } from '@clarity-chat/react'

/**
 * PromptVariablesEditor provides an interface for managing prompt template variables.
 *
 * ## Features
 * - Add, edit, and remove variables
 * - Drag-and-drop reordering
 * - Auto-detection from template
 * - Type selection (string, number, boolean, array, object)
 * - Required/optional toggle
 * - Default value editing
 * - Description field
 *
 * ## Use Cases
 * - Prompt template authoring
 * - Variable schema definition
 * - Dynamic form generation for prompts
 */
const meta: Meta<typeof PromptVariablesEditor> = {
  title: 'Advanced/AI/PromptVariablesEditor',
  component: PromptVariablesEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Editor for managing prompt template variables with drag-and-drop and auto-detection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    autoDetect: {
      control: 'boolean',
      description: 'Auto-detect variables from template',
    },
    allowReorder: {
      control: 'boolean',
      description: 'Allow drag-and-drop reordering',
    },
    allowAdd: {
      control: 'boolean',
      description: 'Allow adding new variables',
    },
    allowRemove: {
      control: 'boolean',
      description: 'Allow removing variables',
    },
    showTypes: {
      control: 'boolean',
      description: 'Show variable type selector',
    },
    readOnly: {
      control: 'boolean',
      description: 'Read-only mode',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample variables
const sampleVariables: PromptVariable[] = [
  {
    name: 'name',
    type: 'string',
    description: "User's name for personalization",
    default: 'User',
    required: true,
  },
  {
    name: 'language',
    type: 'string',
    description: 'Programming language',
    default: 'TypeScript',
    required: true,
  },
  {
    name: 'includeExamples',
    type: 'boolean',
    description: 'Whether to include code examples',
    default: 'true',
    required: false,
  },
  {
    name: 'maxLength',
    type: 'number',
    description: 'Maximum response length',
    default: '500',
    required: false,
  },
]

/**
 * Default editor with sample variables
 */
export const Default: Story = {
  render: () => {
    const [variables, setVariables] = React.useState<PromptVariable[]>(sampleVariables)

    return (
      <PromptVariablesEditor
        variables={variables}
        onChange={setVariables}
        allowReorder
        allowAdd
        allowRemove
        showTypes
      />
    )
  },
}

/**
 * Auto-detection from template
 */
export const WithAutoDetection: Story = {
  render: () => {
    const [variables, setVariables] = React.useState<PromptVariable[]>([])
    const template = `Hello {{name}},

Please review the following {{language}} code and provide:
- {{analysisType}} analysis
- {{maxSuggestions}} suggestions for improvement

Code:
{{code}}

Thanks!`

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">Template:</h3>
          <pre className="text-xs whitespace-pre-wrap">{template}</pre>
        </div>
        <PromptVariablesEditor
          variables={variables}
          onChange={setVariables}
          template={template}
          autoDetect
          allowReorder
          allowAdd
          allowRemove
          showTypes
        />
      </div>
    )
  },
}

/**
 * Empty state
 */
export const Empty: Story = {
  render: () => {
    const [variables, setVariables] = React.useState<PromptVariable[]>([])

    return (
      <PromptVariablesEditor
        variables={variables}
        onChange={setVariables}
        allowAdd
        allowRemove
        showTypes
      />
    )
  },
}

/**
 * Read-only mode
 */
export const ReadOnly: Story = {
  render: () => {
    return (
      <PromptVariablesEditor
        variables={sampleVariables}
        onChange={() => {}}
        readOnly
        showTypes
      />
    )
  },
}

/**
 * Without type selector
 */
export const SimplifiedEditor: Story = {
  render: () => {
    const [variables, setVariables] = React.useState<PromptVariable[]>(sampleVariables)

    return (
      <PromptVariablesEditor
        variables={variables}
        onChange={setVariables}
        allowReorder
        allowAdd
        allowRemove
        showTypes={false}
      />
    )
  },
}

/**
 * Interactive example with output
 */
export const Interactive: Story = {
  render: () => {
    const [variables, setVariables] = React.useState<PromptVariable[]>(sampleVariables)

    return (
      <div className="space-y-4">
        <PromptVariablesEditor
          variables={variables}
          onChange={setVariables}
          allowReorder
          allowAdd
          allowRemove
          showTypes
        />
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">Current Variables:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(variables, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

/**
 * With partially detected variables
 */
export const PartialDetection: Story = {
  render: () => {
    const [variables, setVariables] = React.useState<PromptVariable[]>([
      { name: 'name', type: 'string', required: true },
    ])
    const template = 'Hello {{name}}, your code in {{language}} has {{errorCount}} errors.'

    return (
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">Template:</h3>
          <pre className="text-xs">{template}</pre>
        </div>
        <p className="text-sm text-muted-foreground">
          Only &quot;name&quot; is defined. Other variables will be auto-detected.
        </p>
        <PromptVariablesEditor
          variables={variables}
          onChange={setVariables}
          template={template}
          autoDetect
          allowReorder
          allowAdd
          allowRemove
          showTypes
        />
      </div>
    )
  },
}

/**
 * View only (no add/remove)
 */
export const ViewOnly: Story = {
  render: () => {
    return (
      <PromptVariablesEditor
        variables={sampleVariables}
        onChange={() => {}}
        allowReorder={false}
        allowAdd={false}
        allowRemove={false}
        showTypes
      />
    )
  },
}
