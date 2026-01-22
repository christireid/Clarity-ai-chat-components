import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useOutputPreference - Clarity Chat Components',
  description:
    'Hook for managing output verbosity preferences with intelligent token limit calculation.',
}

const optionsProps: Prop[] = [
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
    name: 'defaultPreference',
    type: 'OutputPreference',
    description: 'Default preference value',
  },
]

export default function UseOutputPreferencePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useOutputPreference</h1>
        <p className="docs-lead">
          Hook for managing output verbosity preferences with intelligent token
          limit calculation based on context and model capacity.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Manage output preference state',
          'Calculate optimal token limits',
          'Get brevity instructions',
          'Handle preference changes',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Manage output preference with default configuration:</p>
        <CodePlayground
          initialCode={`import { useOutputPreference } from '@clarity-chat/react'

function ChatWithPreference() {
  const {
    preference,
    setPreference,
    preferenceValue,
    maxTokens,
    brevityInstruction,
  } = useOutputPreference({
    defaultPreference: 'balanced',
  })

  return (
    <div>
      <select value={preference} onChange={(e) => setPreference(e.target.value)}>
        <option value="concise">Concise</option>
        <option value="balanced">Balanced</option>
        <option value="detailed">Detailed</option>
      </select>
      <div>Max tokens: {maxTokens}</div>
      <div>Instruction: {brevityInstruction}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Token Calculation</h2>
        <p>Calculate optimal token limits based on model capacity:</p>
        <CodePlayground
          initialCode={`import { useOutputPreference } from '@clarity-chat/react'

function TokenAwarePreference() {
  const { preferenceValue, maxTokens } = useOutputPreference({
    modelCapacity: 8000,
    inputTokens: 2000,
    taskType: 'code-generation',
  })

  // Use maxTokens for API call
  const sendMessage = async (message: string) => {
    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        max_tokens: maxTokens,
        system_prompt: preferenceValue.brevityInstruction,
      }),
    })
  }

  return <ChatInput onSend={sendMessage} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Preference Values</h2>
        <p>Access calculated preference values:</p>
        <CodePlayground
          initialCode={`import { useOutputPreference } from '@clarity-chat/react'

function PreferenceValues() {
  const { preferenceValue } = useOutputPreference()

  return (
    <div>
      <div>Mode: {preferenceValue.mode}</div>
      <div>Max tokens: {preferenceValue.maxTokens}</div>
      <div>Brevity instruction: {preferenceValue.brevityInstruction}</div>
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
          <li>
            <code>preference</code>: Current preference value ('concise' |
            'balanced' | 'detailed')
          </li>
          <li>
            <code>setPreference</code>: Function to update preference
          </li>
          <li>
            <code>preferenceValue</code>: Full preference object with calculated
            values
          </li>
          <li>
            <code>maxTokens</code>: Calculated max tokens for current preference
          </li>
          <li>
            <code>brevityInstruction</code>: Instruction string to inject into
            system prompt
          </li>
        </ul>
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
            Inject <code>brevityInstruction</code> into system prompt for better
            results
          </li>
          <li>
            Use <code>maxTokens</code> in API calls to enforce limits
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/output-preference-selector">
              OutputPreferenceSelector
            </a>{' '}
            - Preference selector component
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
