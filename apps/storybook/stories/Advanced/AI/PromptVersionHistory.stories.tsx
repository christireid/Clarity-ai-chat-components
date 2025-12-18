import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { PromptVersionHistory } from '@clarity-chat/react'
import type { PromptVersion, PromptEnvironment } from '@clarity-chat/react'

/**
 * PromptVersionHistory displays and manages version history for prompt templates.
 *
 * ## Features
 * - Version timeline with timestamps
 * - Active version indicator
 * - Deployment status per environment
 * - Version comparison selection
 * - Rollback functionality
 * - Deploy to environment buttons
 *
 * ## Use Cases
 * - Version control for prompts
 * - Audit trail for prompt changes
 * - Deployment management
 * - Rollback to previous versions
 */
const meta: Meta<typeof PromptVersionHistory> = {
  title: 'Advanced/AI/PromptVersionHistory',
  component: PromptVersionHistory,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Version history component for prompt templates with comparison and deployment features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    enableComparison: {
      control: 'boolean',
      description: 'Enable version comparison feature',
    },
    showDeployment: {
      control: 'boolean',
      description: 'Show deployment action buttons',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height of the component',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample version data
const now = Date.now()
const hour = 60 * 60 * 1000
const day = 24 * hour

const sampleVersions: PromptVersion[] = [
  {
    id: 'v-1',
    templateId: 'template-1',
    version: '1.0.0',
    template: 'Hello {{name}}, welcome to our service!',
    createdAt: now - 7 * day,
    notes: 'Initial version',
    isActive: false,
  },
  {
    id: 'v-2',
    templateId: 'template-1',
    version: '1.0.1',
    template: 'Hello {{name}}! Welcome to our service. How can I help you today?',
    createdAt: now - 5 * day,
    notes: 'Added follow-up question',
    isActive: false,
  },
  {
    id: 'v-3',
    templateId: 'template-1',
    version: '1.1.0',
    template: `Hello {{name}}!

Welcome to our service. I'm here to assist you with {{topic}}.

How can I help you today?`,
    createdAt: now - 2 * day,
    notes: 'Added topic variable for personalization',
    isActive: false,
  },
  {
    id: 'v-4',
    templateId: 'template-1',
    version: '1.1.1',
    template: `Hello {{name}}!

Welcome to our service. I'm your AI assistant, ready to help you with {{topic}}.

What would you like to know?`,
    createdAt: now - 12 * hour,
    notes: 'Refined language and added AI assistant context',
    isActive: true,
  },
]

/**
 * Default version history display
 */
export const Default: Story = {
  args: {
    templateId: 'template-1',
    templateName: 'Welcome Message',
    versions: sampleVersions,
    activeVersionId: 'v-4',
    enableComparison: true,
    showDeployment: true,
    maxHeight: 500,
  },
}

/**
 * With deployment status
 */
export const WithDeployments: Story = {
  args: {
    templateId: 'template-1',
    templateName: 'Welcome Message',
    versions: sampleVersions,
    activeVersionId: 'v-4',
    deployedVersions: {
      production: 'v-3',
      staging: 'v-4',
      development: 'v-4',
    },
    enableComparison: true,
    showDeployment: true,
  },
}

/**
 * Interactive example with callbacks
 */
export const Interactive: Story = {
  args: {
    templateId: 'template-1',
    templateName: 'Welcome Message',
    versions: sampleVersions,
    enableComparison: true,
    showDeployment: true,
  },
  render: (args) => {
    const [activeVersionId, setActiveVersionId] = React.useState('v-4')
    const [deployedVersions, setDeployedVersions] = React.useState<
      Partial<Record<PromptEnvironment, string>>
    >({
      production: 'v-3',
      staging: 'v-4',
    })
    const [comparisonResult, setComparisonResult] = React.useState<{
      v1: string
      v2: string
    } | null>(null)

    return (
      <div className="space-y-4">
        <PromptVersionHistory
          {...args}
          activeVersionId={activeVersionId}
          deployedVersions={deployedVersions}
          onSelectVersion={(version) => {
            console.log('Selected version:', version.version)
          }}
          onSetActive={(versionId) => {
            setActiveVersionId(versionId)
            console.log('Set active:', versionId)
          }}
          onRollback={(versionId) => {
            console.log('Rollback to:', versionId)
            alert(`Rolling back to version ${versionId}`)
          }}
          onDeploy={(versionId, env) => {
            setDeployedVersions((prev) => ({ ...prev, [env]: versionId }))
            console.log(`Deployed ${versionId} to ${env}`)
          }}
          onCompare={(v1, v2) => {
            setComparisonResult({ v1, v2 })
            console.log(`Comparing ${v1} and ${v2}`)
          }}
        />
        {comparisonResult && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">Comparison requested:</p>
            <p className="text-xs text-muted-foreground">
              {comparisonResult.v1} vs {comparisonResult.v2}
            </p>
          </div>
        )}
      </div>
    )
  },
}

/**
 * Empty state
 */
export const Empty: Story = {
  args: {
    templateId: 'template-new',
    templateName: 'New Template',
    versions: [],
    enableComparison: true,
    showDeployment: true,
  },
}

/**
 * Without deployment controls
 */
export const WithoutDeployment: Story = {
  args: {
    templateId: 'template-1',
    templateName: 'Welcome Message',
    versions: sampleVersions,
    activeVersionId: 'v-4',
    enableComparison: true,
    showDeployment: false,
  },
}

/**
 * Comparison only mode
 */
export const ComparisonOnly: Story = {
  args: {
    templateId: 'template-1',
    templateName: 'Welcome Message',
    versions: sampleVersions,
    activeVersionId: 'v-4',
    enableComparison: true,
    showDeployment: false,
  },
  render: (args) => {
    const [selectedVersions, setSelectedVersions] = React.useState<string[]>([])

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
          <strong>Instructions:</strong> Click &quot;Compare&quot; on any two versions to
          select them for comparison.
        </div>
        <PromptVersionHistory
          {...args}
          onCompare={(v1, v2) => {
            setSelectedVersions([v1, v2])
          }}
        />
        {selectedVersions.length === 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Version {selectedVersions[0]}</h3>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {sampleVersions.find((v) => v.id === selectedVersions[0])?.template}
              </pre>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Version {selectedVersions[1]}</h3>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {sampleVersions.find((v) => v.id === selectedVersions[1])?.template}
              </pre>
            </div>
          </div>
        )}
      </div>
    )
  },
}
