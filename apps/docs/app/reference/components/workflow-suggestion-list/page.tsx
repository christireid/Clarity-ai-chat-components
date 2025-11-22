import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Workflow Suggestion List - Clarity Chat Components',
  description: 'Suggest complete workflows and multi-step processes to help users accomplish complex tasks.',
}

export default function WorkflowSuggestionListPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Workflow Suggestion List</h1>
        <p className="docs-lead">
          Suggest complete workflows for complex tasks. Like having a playbook - "Want to deploy to production? Here are the 5 steps."
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Instead of just suggesting single questions, suggest entire workflows. For example: "Setting up CI/CD" workflow includes: 1) Create config file, 2) Set up secrets, 3) Test locally, 4) Deploy. Users get a complete game plan.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function SimpleWorkflows() {
  const workflows = [
    {
      id: '1',
      name: 'Deploy to Production',
      description: 'Complete deployment checklist',
      steps: [
        'Run all tests',
        'Build production bundle',
        'Update environment variables',
        'Deploy to server',
        'Verify deployment'
      ],
      estimatedTime: '15 min'
    },
    {
      id: '2',
      name: 'Set Up New Feature',
      description: 'Standard feature development workflow',
      steps: [
        'Create feature branch',
        'Write tests first (TDD)',
        'Implement feature',
        'Update documentation',
        'Submit pull request'
      ],
      estimatedTime: '2-3 hours'
    }
  ]

  return (
    <WorkflowSuggestionList
      workflows={workflows}
      onSelect={(w) => console.log('Selected:', w.name)}
    />
  )
}

render(<SimpleWorkflows />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable title="WorkflowSuggestionList Props" data={workflowProps} />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Keep workflows to 3-7 steps (not too simple, not too complex)</li>
          <li>Provide realistic time estimates</li>
          <li>Make steps actionable (start with verbs)</li>
          <li>Group similar workflows by category</li>
          <li>Include common workflows users actually need</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/follow-up-suggestions" className="docs-card">
            <h3>Follow-Up Suggestions</h3>
            <p>Single question suggestions</p>
          </a>
          <a href="/reference/components/prompt-library" className="docs-card">
            <h3>Prompt Library</h3>
            <p>Pre-built prompts</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const workflowProps = [
  {
    name: 'workflows',
    type: 'WorkflowSuggestion[]',
    required: true,
    description: 'Array of workflow suggestions'
  },
  {
    name: 'onSelect',
    type: '(workflow: WorkflowSuggestion) => void',
    required: false,
    description: 'Callback when workflow is selected'
  },
  {
    name: 'onPreview',
    type: '(workflow: WorkflowSuggestion) => void',
    required: false,
    description: 'Callback to preview workflow details'
  },
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes'
  }
]

