/**
 * ChainOfThought Storybook Stories
 *
 * Demonstrates all features and usage patterns of the ChainOfThought component.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import {
  ChainOfThought,
  useChainOfThought,
  type ChainOfThoughtStep,
} from './chain-of-thought'

const meta: Meta<typeof ChainOfThought> = {
  title: 'AI/ChainOfThought',
  component: ChainOfThought,
  parameters: {
    docs: {
      description: {
        component: `
# Chain of Thought

Visualizes step-by-step AI reasoning with collapsible sections, progress indicators, and streaming support.

## Features

- Step-by-step reasoning visualization
- Collapsible/expandable sections
- Real-time streaming updates
- Progress indicators for each step
- Status badges (pending, in-progress, complete, error)
- Accessible with full ARIA support
- Respects reduced motion preferences
- Keyboard navigation

## Installation

\`\`\`tsx
import { ChainOfThought, useChainOfThought } from '@clarity-chat/react'
\`\`\`

## Basic Usage

\`\`\`tsx
<ChainOfThought
  steps={[
    { id: '1', title: 'Analyzing query', content: '...', status: 'complete' },
    { id: '2', title: 'Searching database', content: '...', status: 'in-progress' },
    { id: '3', title: 'Generating response', content: '...', status: 'pending' }
  ]}
/>
\`\`\`

## With Hook for Streaming

\`\`\`tsx
function StreamingExample() {
  const { steps, addStep, updateStep } = useChainOfThought()

  // Add steps as AI processes
  useEffect(() => {
    addStep({ id: '1', title: 'Thinking...', content: '', status: 'in-progress' })
    // ... update as streaming progresses
  }, [])

  return <ChainOfThought steps={steps} />
}
\`\`\`
        `,
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed', 'minimal'],
      description: 'Visual variant of the component',
    },
    expanded: {
      control: 'boolean',
      description: 'Whether all steps are expanded by default',
    },
    showTimestamps: {
      control: 'boolean',
      description: 'Show timestamps for each step',
    },
    showStepNumbers: {
      control: 'boolean',
      description: 'Show step numbers instead of status icons',
    },
    showDuration: {
      control: 'boolean',
      description: 'Show duration for completed steps',
    },
    showToggleAll: {
      control: 'boolean',
      description: 'Show collapse all/expand all button',
    },
  },
}

export default meta
type Story = StoryObj<typeof ChainOfThought>

// =============================================================================
// SAMPLE DATA
// =============================================================================

const basicSteps: ChainOfThoughtStep[] = [
  {
    id: '1',
    title: 'Analyzing query',
    content:
      'Parsing the user query to identify key entities, intent, and required data sources. Detected entities: "AI", "reasoning", "visualization". Intent: information retrieval.',
    status: 'complete',
    duration: durations.slower,
    timestamp: new Date(Date.now() - 10000),
  },
  {
    id: '2',
    title: 'Searching knowledge base',
    content:
      'Querying internal knowledge base for relevant documents. Found 15 matching documents with relevance scores above 0.8.',
    status: 'complete',
    duration: durations.slower,
    timestamp: new Date(Date.now() - 8000),
  },
  {
    id: '3',
    title: 'Synthesizing information',
    content:
      'Combining information from multiple sources. Cross-referencing facts and checking for consistency.',
    status: 'in-progress',
    progress: 65,
    timestamp: new Date(Date.now() - 5000),
  },
  {
    id: '4',
    title: 'Generating response',
    content: '',
    status: 'pending',
  },
]

const detailedSteps: ChainOfThoughtStep[] = [
  {
    id: '1',
    title: 'Query Understanding',
    content: `Breaking down the user's question into components:
- Primary topic: Machine learning model deployment
- Context: Production environment
- Constraints: Low latency requirements
- Expected output: Step-by-step guide`,
    status: 'complete',
    duration: durations.slower,
    timestamp: new Date(Date.now() - 30000),
    metadata: {
      'Confidence': '0.95',
      'Tokens processed': 48,
      'Model': 'claude-3-opus',
    },
  },
  {
    id: '2',
    title: 'Context Retrieval',
    content: `Retrieved relevant context from knowledge base:
1. ML deployment best practices documentation
2. Previous similar queries and responses
3. System architecture diagrams
4. Performance benchmarks`,
    status: 'complete',
    duration: durations.slower,
    timestamp: new Date(Date.now() - 25000),
    metadata: {
      'Documents retrieved': 12,
      'Avg relevance': '0.87',
      'Cache hit': true,
    },
    subSteps: [
      {
        id: '2a',
        title: 'Vector search',
        content: 'Searched 50,000 embeddings',
        status: 'complete',
      },
      {
        id: '2b',
        title: 'Reranking',
        content: 'Applied cross-encoder reranking',
        status: 'complete',
      },
      {
        id: '2c',
        title: 'Deduplication',
        content: 'Removed 3 duplicate passages',
        status: 'complete',
      },
    ],
  },
  {
    id: '3',
    title: 'Reasoning & Planning',
    content: `Developing response structure:
1. Introduction to deployment considerations
2. Infrastructure requirements
3. Step-by-step deployment process
4. Monitoring and optimization
5. Common pitfalls to avoid`,
    status: 'in-progress',
    progress: 78,
    timestamp: new Date(Date.now() - 15000),
    metadata: {
      'Reasoning steps': 5,
      'Branches explored': 3,
    },
  },
  {
    id: '4',
    title: 'Response Generation',
    content: '',
    status: 'pending',
    metadata: {
      'Target length': '500-800 words',
      'Format': 'Markdown',
    },
  },
  {
    id: '5',
    title: 'Quality Check',
    content: '',
    status: 'pending',
    metadata: {
      'Checks': 'Accuracy, completeness, tone',
    },
  },
]

const errorSteps: ChainOfThoughtStep[] = [
  {
    id: '1',
    title: 'Parsing request',
    content: 'Successfully parsed the incoming request and validated parameters.',
    status: 'complete',
    duration: durations.slower,
  },
  {
    id: '2',
    title: 'Fetching external data',
    content: 'Attempted to fetch data from external API endpoint.',
    status: 'error',
    error:
      'Connection timeout: Unable to reach external API after 30 seconds. Please check network connectivity.',
    duration: durations.slower,
  },
  {
    id: '3',
    title: 'Processing results',
    content: '',
    status: 'skipped',
  },
]

// =============================================================================
// STORIES
// =============================================================================

export const Default: Story = {
  args: {
    steps: basicSteps,
    title: 'AI Reasoning',
    subtitle: 'Follow the thought process step by step',
  },
}

export const Expanded: Story = {
  args: {
    steps: basicSteps,
    expanded: true,
    title: 'AI Reasoning (All Expanded)',
  },
}

export const Compact: Story = {
  args: {
    steps: basicSteps,
    variant: 'compact',
    title: 'Compact View',
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact variant for embedding in smaller spaces.',
      },
    },
  },
}

export const Detailed: Story = {
  args: {
    steps: detailedSteps,
    variant: 'detailed',
    expanded: true,
    showTimestamps: true,
    title: 'Detailed Reasoning',
    subtitle: 'With metadata and sub-steps',
  },
  parameters: {
    docs: {
      description: {
        story: 'Detailed variant showing metadata and nested sub-steps.',
      },
    },
  },
}

export const Minimal: Story = {
  args: {
    steps: basicSteps,
    variant: 'minimal',
    showToggleAll: false,
    title: 'Minimal View',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal variant with reduced visual elements.',
      },
    },
  },
}

export const WithStepNumbers: Story = {
  args: {
    steps: basicSteps,
    showStepNumbers: true,
    title: 'Numbered Steps',
  },
}

export const WithTimestamps: Story = {
  args: {
    steps: basicSteps,
    showTimestamps: true,
    title: 'With Timestamps',
  },
}

export const WithError: Story = {
  args: {
    steps: errorSteps,
    expanded: true,
    title: 'Error Handling',
    onRetry: (stepId) => console.log('Retrying step:', stepId),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error state with retry functionality.',
      },
    },
  },
}

export const MaxVisibleSteps: Story = {
  args: {
    steps: detailedSteps,
    maxVisibleSteps: 2,
    title: 'Limited Visibility',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows "Show more" button when steps exceed maxVisibleSteps.',
      },
    },
  },
}

export const Empty: Story = {
  args: {
    steps: [],
    title: 'Empty State',
  },
}

export const Loading: Story = {
  args: {
    steps: [],
    loading: true,
    title: 'Loading State',
  },
}

export const AllComplete: Story = {
  args: {
    steps: basicSteps.map((s) => ({
      ...s,
      status: 'complete' as const,
      duration: Math.floor(Math.random() * 2000),
    })),
    title: 'All Steps Complete',
  },
}

export const AllPending: Story = {
  args: {
    steps: basicSteps.map((s) => ({
      ...s,
      status: 'pending' as const,
      content: '',
    })),
    title: 'All Steps Pending',
  },
}

// =============================================================================
// INTERACTIVE EXAMPLES
// =============================================================================

/**
 * Interactive streaming simulation
 */
export const StreamingSimulation: Story = {
  render: function StreamingDemo() {
    const { steps, addStep, updateStep, clearSteps } = useChainOfThought()
    const [isRunning, setIsRunning] = React.useState(false)

    const simulateStreaming = async () => {
      clearSteps()
      setIsRunning(true)

      // Step 1: Start analyzing
      addStep({
        id: '1',
        title: 'Analyzing query',
        content: '',
        status: 'in-progress',
        progress: 0,
        timestamp: new Date(),
      })

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 100))
        updateStep('1', { progress: i })
      }

      updateStep('1', {
        status: 'complete',
        content: 'Identified key entities and user intent. Query type: factual question.',
        duration: durations.slower,
      })

      // Step 2
      await new Promise((r) => setTimeout(r, 300))
      addStep({
        id: '2',
        title: 'Searching knowledge base',
        content: '',
        status: 'in-progress',
        progress: 0,
        timestamp: new Date(),
      })

      for (let i = 0; i <= 100; i += 5) {
        await new Promise((r) => setTimeout(r, 80))
        updateStep('2', { progress: i })
      }

      updateStep('2', {
        status: 'complete',
        content: 'Retrieved 8 relevant documents with average relevance score of 0.91.',
        duration: durations.slower,
      })

      // Step 3
      await new Promise((r) => setTimeout(r, 300))
      addStep({
        id: '3',
        title: 'Synthesizing response',
        content: '',
        status: 'in-progress',
        progress: 0,
        timestamp: new Date(),
      })

      for (let i = 0; i <= 100; i += 8) {
        await new Promise((r) => setTimeout(r, 120))
        updateStep('3', { progress: i })
      }

      updateStep('3', {
        status: 'complete',
        content: 'Combined information from multiple sources. Verified factual accuracy.',
        duration: durations.slower,
      })

      // Step 4
      await new Promise((r) => setTimeout(r, 200))
      addStep({
        id: '4',
        title: 'Generating final response',
        content: '',
        status: 'in-progress',
        timestamp: new Date(),
      })

      await new Promise((r) => setTimeout(r, 800))
      updateStep('4', {
        status: 'complete',
        content: 'Response generated successfully. Ready to deliver.',
        duration: durations.slower,
      })

      setIsRunning(false)
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={simulateStreaming}
            disabled={isRunning}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
          >
            {isRunning ? 'Processing...' : 'Start Simulation'}
          </button>
          <button
            onClick={clearSteps}
            disabled={isRunning}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium"
          >
            Reset
          </button>
        </div>

        <ChainOfThought
          steps={steps}
          title="Streaming Simulation"
          subtitle="Watch the reasoning process unfold in real-time"
          expanded
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing how to use the useChainOfThought hook for streaming updates.',
      },
    },
  },
}

/**
 * Controlled expansion state
 */
export const ControlledExpansion: Story = {
  render: function ControlledDemo() {
    const [expandedSteps, setExpandedSteps] = React.useState<string[]>(['1'])

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {basicSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => {
                setExpandedSteps((prev) =>
                  prev.includes(step.id)
                    ? prev.filter((id) => id !== step.id)
                    : [...prev, step.id]
                )
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                expandedSteps.includes(step.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-muted'
              }`}
            >
              Step {step.id}
            </button>
          ))}
        </div>

        <ChainOfThought
          steps={basicSteps}
          expandedSteps={expandedSteps}
          onExpandedStepsChange={setExpandedSteps}
          title="Controlled Expansion"
          subtitle="Click buttons above to control expansion"
        />
      </div>
    )
  },
}

/**
 * With click handlers
 */
export const WithClickHandlers: Story = {
  render: function ClickDemo() {
    const [lastClicked, setLastClicked] = React.useState<string | null>(null)

    return (
      <div className="space-y-4">
        {lastClicked && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            Last clicked step: <strong>{lastClicked}</strong>
          </div>
        )}

        <ChainOfThought
          steps={basicSteps}
          title="Click Handler Demo"
          onStepClick={(stepId) => {
            setLastClicked(stepId)
            console.log('Step clicked:', stepId)
          }}
        />
      </div>
    )
  },
}

/**
 * Custom styling
 */
export const CustomStyling: Story = {
  args: {
    steps: basicSteps,
    title: 'Custom Styled',
    className: 'gap-4',
    containerClassName: 'p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-xl',
    stepClassName: 'shadow-md',
  },
}

/**
 * Real-world example: Code generation
 */
export const CodeGenerationExample: Story = {
  args: {
    steps: [
      {
        id: '1',
        title: 'Understanding requirements',
        content: `Analyzed the request for a React component:
- Component type: Form with validation
- Framework: React 18 with TypeScript
- Styling: Tailwind CSS
- Features: Real-time validation, error messages`,
        status: 'complete',
        duration: durations.slower,
      },
      {
        id: '2',
        title: 'Designing component structure',
        content: `Planned component architecture:
- FormProvider for context
- Individual field components
- Validation schema using Zod
- Custom hooks for form state`,
        status: 'complete',
        duration: durations.slower,
      },
      {
        id: '3',
        title: 'Writing implementation',
        content: `Generating code with best practices:
- TypeScript strict mode
- Accessible form controls
- Error boundary wrapper
- Memoized callbacks`,
        status: 'in-progress',
        progress: 72,
      },
      {
        id: '4',
        title: 'Adding tests',
        content: '',
        status: 'pending',
      },
      {
        id: '5',
        title: 'Final review',
        content: '',
        status: 'pending',
      },
    ],
    title: 'Code Generation',
    subtitle: 'Building a validated form component',
    variant: 'default',
    expanded: true,
  },
}

/**
 * Real-world example: Research assistant
 */
export const ResearchAssistantExample: Story = {
  args: {
    steps: [
      {
        id: '1',
        title: 'Interpreting research question',
        content: `Research topic: "Impact of remote work on productivity"
- Scope: Academic and industry research
- Time frame: 2020-2024
- Focus areas: Technology, management, employee wellbeing`,
        status: 'complete',
        duration: durations.slower,
        metadata: {
          'Keywords extracted': 8,
          'Search strategy': 'Boolean',
        },
      },
      {
        id: '2',
        title: 'Literature search',
        content: `Searching academic databases:
- Found 156 peer-reviewed articles
- 42 industry reports
- 18 meta-analyses`,
        status: 'complete',
        duration: durations.slower,
        subSteps: [
          { id: '2a', title: 'Google Scholar', content: '89 results', status: 'complete' },
          { id: '2b', title: 'PubMed', content: '34 results', status: 'complete' },
          { id: '2c', title: 'IEEE Xplore', content: '33 results', status: 'complete' },
        ],
      },
      {
        id: '3',
        title: 'Analyzing findings',
        content: `Key themes emerging:
1. Productivity metrics vary by industry
2. Communication tools impact collaboration
3. Work-life balance considerations
4. Management adaptation strategies`,
        status: 'in-progress',
        progress: 45,
      },
      {
        id: '4',
        title: 'Synthesizing report',
        content: '',
        status: 'pending',
      },
    ],
    title: 'Research Assistant',
    subtitle: 'Analyzing remote work productivity',
    variant: 'detailed',
    showTimestamps: true,
    expanded: true,
  },
}
