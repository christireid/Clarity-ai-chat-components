import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'OutputPreferenceSelector - Clarity Chat Components',
  description:
    'Select output verbosity preference with intelligent token limit calculation based on context.',
}

const props: Prop[] = [
  {
    name: 'value',
    type: '"concise" | "balanced" | "detailed"',
    required: true,
    description: 'Current selected output preference mode',
  },
  {
    name: 'onChange',
    type: '(preference: OutputPreferenceValue) => void',
    required: true,
    description: 'Callback when preference changes',
  },
  {
    name: 'modelCapacity',
    type: 'number',
    description: "Model's total context capacity for token calculation",
  },
  {
    name: 'inputTokens',
    type: 'number',
    description: 'Current input token count for token calculation',
  },
  {
    name: 'taskType',
    type: 'TaskType',
    description: 'Task type for more accurate token calculation',
  },
  {
    name: 'showTokenEstimate',
    type: 'boolean',
    description: 'Show estimated token counts for each option',
  },
  {
    name: 'displayMode',
    type: '"compact" | "expanded"',
    description:
      'Display mode: compact (inline) or expanded (with descriptions)',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disabled state',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    description: 'Size variant',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function OutputPreferenceSelectorPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>OutputPreferenceSelector</h1>
        <p className="docs-lead">
          Select output verbosity preference with intelligent token limit
          calculation based on context and model capacity.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Select output verbosity preferences',
          'Calculate optimal token limits based on context',
          'Configure task-specific preferences',
          'Display token estimates for each option',
          'Integrate with chat interfaces',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Select output preference with default configuration:</p>
        <CodePlayground
          initialCode={`import { OutputPreferenceSelector } from '@clarity-chat/react/internal'

function ChatWithPreference() {
  const [preference, setPreference] = React.useState('balanced')

  return (
    <div className="p-4">
      <OutputPreferenceSelector
        value={preference}
        onChange={(pref) => {
          setPreference(pref.mode)
          logger.debug('Max tokens:', pref.maxTokens)
          logger.debug('Brevity instruction:', pref.brevityInstruction)
        }}
      />
    </div>
  )
}

render(<ChatWithPreference />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Token Calculation</h2>
        <p>
          Calculate optimal token limits based on model capacity and input
          tokens:
        </p>
        <CodePlayground
          initialCode={`import { OutputPreferenceSelector } from '@clarity-chat/react/internal'

function TokenAwareSelector() {
  const [preference, setPreference] = React.useState('balanced')
  const modelCapacity = 8000  // e.g., GPT-4 context window
  const inputTokens = 2000    // Current input token count

  return (
    <OutputPreferenceSelector
      value={preference}
      onChange={setPreference}
      modelCapacity={modelCapacity}
      inputTokens={inputTokens}
      showTokenEstimate={true}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Task-Specific Preferences</h2>
        <p>Configure task-specific token calculations:</p>
        <CodePlayground
          initialCode={`import { OutputPreferenceSelector } from '@clarity-chat/react/internal'

function TaskSpecificSelector() {
  return (
    <OutputPreferenceSelector
      value="balanced"
      onChange={(pref) => {
        // Use calculated maxTokens for API call
        sendMessage(message, { max_tokens: pref.maxTokens })
      }}
      modelCapacity={8000}
      inputTokens={2000}
      taskType="code-generation"  // Task-specific calculation
      showTokenEstimate={true}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Display Modes</h2>
        <p>Use compact or expanded display modes:</p>
        <CodePlayground
          initialCode={`import { OutputPreferenceSelector } from '@clarity-chat/react/internal'

function CompactSelector() {
  return (
    <OutputPreferenceSelector
      value="balanced"
      onChange={(pref) => {}}
      displayMode="compact"  // Inline, minimal UI
    />
  )
}

function ExpandedSelector() {
  return (
    <OutputPreferenceSelector
      value="balanced"
      onChange={(pref) => {}}
      displayMode="expanded"  // With descriptions
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
        <h2>Output Preference Values</h2>
        <ul>
          <li>
            <strong>concise</strong>: Short, to-the-point responses (~500
            tokens)
          </li>
          <li>
            <strong>balanced</strong>: Standard response length (~1000 tokens)
          </li>
          <li>
            <strong>detailed</strong>: Comprehensive explanations (~2000 tokens)
          </li>
        </ul>
        <p>
          Actual token limits are calculated based on <code>modelCapacity</code>
          , <code>inputTokens</code>, and <code>taskType</code>.
        </p>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Provide <code>modelCapacity</code> and <code>inputTokens</code> for
            accurate calculations
          </li>
          <li>
            Use <code>taskType</code> for task-specific optimizations
          </li>
          <li>
            Enable <code>showTokenEstimate</code> to help users understand token
            usage
          </li>
          <li>
            Use <code>compact</code> mode for inline placement
          </li>
          <li>
            Use <code>expanded</code> mode when space allows for better UX
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/token-counter">TokenCounter</a> -
            Token usage display
          </li>
          <li>
            <a href="/reference/hooks/use-output-preference">
              useOutputPreference
            </a>{' '}
            - Output preference hook
          </li>
          <li>
            <a href="/guides/token-optimization">Token Optimization Guide</a> -
            Optimization strategies
          </li>
        </ul>
      </section>
    </div>
  )
}
