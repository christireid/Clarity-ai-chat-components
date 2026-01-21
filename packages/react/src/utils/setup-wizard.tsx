/**
 * Setup Wizard - Interactive Configuration Helper
 *
 * An interactive setup wizard that guides developers through configuring
 * Clarity Chat with sensible defaults and validation.
 *
 * @module utils/setup-wizard
 */

import * as React from 'react'
import { ClarityChat } from '../components/chat/clarity-chat'
import { devLog } from './dev-helpers'

/**
 * Interactive setup wizard component
 */
export class SetupWizard extends React.Component<
  {
    onComplete: (config: SetupWizardConfig) => void
    onCancel?: () => void
  },
  SetupWizardState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      step: 0,
      config: {
        api: '',
        features: {
          memory: false,
          streaming: false,
          rateLimiting: false,
          enterprise: false,
        },
        ui: {
          header: true,
          prompts: true,
          darkMode: false,
        }
      }
    }
  }

  private nextStep = () => {
    this.setState(prev => ({ step: prev.step + 1 }))
  }

  private prevStep = () => {
    this.setState(prev => ({ step: prev.step - 1 }))
  }

  private updateConfig = (updates: Partial<SetupWizardConfig>) => {
    this.setState(prev => ({
      config: { ...prev.config, ...updates }
    }))
  }

  private complete = () => {
    this.props.onComplete(this.state.config)
  }

  override render() {
    const { step, config } = this.state

    return (
      <div className="setup-wizard">
        {step === 0 && (
          <Step1API
            api={config.api}
            onChange={(api) => this.updateConfig({ api })}
            onNext={this.nextStep}
          />
        )}
        {step === 1 && (
          <Step2Features
            features={config.features}
            onChange={(features) => this.updateConfig({ features })}
            onNext={this.nextStep}
            onBack={this.prevStep}
          />
        )}
        {step === 2 && (
          <Step3UI
            ui={config.ui}
            onChange={(ui) => this.updateConfig({ ui })}
            onComplete={this.complete}
            onBack={this.prevStep}
          />
        )}
      </div>
    )
  }
}

/**
 * Quick setup utility for common configurations
 */
export class QuickSetup {
  static basic(api: string): React.ReactElement {
    return <ClarityChat api={api} />
  }

  static withMemory(api: string): React.ReactElement {
    return (
      <ClarityChat
        api={api}
        memory={{ enabled: true, strategy: 'sliding-window' }}
      />
    )
  }

  static enterprise(api: string): React.ReactElement {
    return (
      <ClarityChat
        api={api}
        memory={{ enabled: true, strategy: 'vector-store' }}
        promptOptimization={{ enabled: true }}
        rateLimiting={{ enabled: true }}
        header={{ show: true, title: 'Enterprise Assistant' }}
      />
    )
  }

  static streaming(api: string): React.ReactElement {
    return (
      <ClarityChat
        api={api}
        transport="sse"
      />
    )
  }
}

/**
 * Interactive setup function that can be called from console
 */
export function interactiveSetup(): void {
  if (typeof window === 'undefined') {
    console.log('Interactive setup is only available in browser environment')
    return
  }

  devLog.info('Starting interactive Clarity Chat setup...')

  const api = prompt('Enter your API endpoint URL (e.g., /api/chat):')
  if (!api) {
    devLog.warn('Setup cancelled')
    return
  }

  const memory = confirm('Enable memory for context-aware conversations?')
  const streaming = confirm('Enable streaming responses?')
  const enterprise = confirm('Use enterprise features (memory + optimization)?')

  const config = {
    api,
    features: { memory, streaming, enterprise },
    ui: { header: true, prompts: true, darkMode: false }
  }

  console.log('Generated configuration:', config)
  console.log('Copy this into your component:')
  console.log(generateCodeSnippet(config))
}

/**
 * Generate a code snippet from configuration
 */
function generateCodeSnippet(config: SetupWizardConfig): string {
  const lines: string[] = []

  lines.push('import { ClarityChat } from "@clarity-chat/react"')
  lines.push('import "@clarity-chat/react/styles.css"')
  lines.push('')
  lines.push('export function MyChat() {')
  lines.push('  return (')

  const props: string[] = []
  props.push(`api="${config.api}"`)

  if (config.features.memory) {
    props.push('memory={{ enabled: true, strategy: "sliding-window" }}')
  }

  if (config.features.streaming) {
    props.push('transport="sse"')
  }

  if (config.features.enterprise) {
    props.push('promptOptimization={{ enabled: true }}')
    props.push('rateLimiting={{ enabled: true }}')
  }

  if (config.ui.header) {
    props.push('header={{ show: true, title: "AI Assistant" }}')
  }

  const indentedProps = props.map(p => `      ${p}`).join('\n')
  lines.push(`    <ClarityChat`)
  lines.push(indentedProps)
  lines.push('    />')

  lines.push('  )')
  lines.push('}')

  return lines.join('\n')
}

// =============================================================================
// WIZARD STEP COMPONENTS
// =============================================================================

interface Step1APIProps {
  api: string
  onChange: (api: string) => void
  onNext: () => void
}

function Step1API({ api, onChange, onNext }: Step1APIProps) {
  const [input, setInput] = React.useState(api)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(input)
    onNext()
  }

  return (
    <div className="step">
      <h3>Step 1: API Endpoint</h3>
      <p>Enter your chat API endpoint URL</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="/api/chat"
          required
        />
        <button type="submit">Next</button>
      </form>
    </div>
  )
}

interface Step2FeaturesProps {
  features: SetupWizardConfig['features']
  onChange: (features: SetupWizardConfig['features']) => void
  onNext: () => void
  onBack: () => void
}

function Step2Features({ features, onChange, onNext, onBack }: Step2FeaturesProps) {
  const updateFeature = (key: keyof typeof features, value: boolean) => {
    onChange({ ...features, [key]: value })
  }

  return (
    <div className="step">
      <h3>Step 2: Features</h3>
      <p>Choose the features you want to enable</p>

      <label>
        <input
          type="checkbox"
          checked={features.memory}
          onChange={(e) => updateFeature('memory', e.target.checked)}
        />
        Memory (context-aware conversations)
      </label>

      <label>
        <input
          type="checkbox"
          checked={features.streaming}
          onChange={(e) => updateFeature('streaming', e.target.checked)}
        />
        Streaming (real-time responses)
      </label>

      <label>
        <input
          type="checkbox"
          checked={features.rateLimiting}
          onChange={(e) => updateFeature('rateLimiting', e.target.checked)}
        />
        Rate Limiting (prevent spam)
      </label>

      <label>
        <input
          type="checkbox"
          checked={features.enterprise}
          onChange={(e) => updateFeature('enterprise', e.target.checked)}
        />
        Enterprise (all features optimized)
      </label>

      <div className="buttons">
        <button onClick={onBack}>Back</button>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  )
}

interface Step3UIProps {
  ui: SetupWizardConfig['ui']
  onChange: (ui: SetupWizardConfig['ui']) => void
  onComplete: () => void
  onBack: () => void
}

function Step3UI({ ui, onChange, onComplete, onBack }: Step3UIProps) {
  const updateUI = (key: keyof typeof ui, value: boolean) => {
    onChange({ ...ui, [key]: value })
  }

  return (
    <div className="step">
      <h3>Step 3: UI Options</h3>
      <p>Customize the appearance</p>

      <label>
        <input
          type="checkbox"
          checked={ui.header}
          onChange={(e) => updateUI('header', e.target.checked)}
        />
        Show header
      </label>

      <label>
        <input
          type="checkbox"
          checked={ui.prompts}
          onChange={(e) => updateUI('prompts', e.target.checked)}
        />
        Show starter prompts
      </label>

      <label>
        <input
          type="checkbox"
          checked={ui.darkMode}
          onChange={(e) => updateUI('darkMode', e.target.checked)}
        />
        Dark mode
      </label>

      <div className="buttons">
        <button onClick={onBack}>Back</button>
        <button onClick={onComplete}>Complete Setup</button>
      </div>
    </div>
  )
}

// =============================================================================
// TYPES
// =============================================================================

interface SetupWizardState {
  step: number
  config: SetupWizardConfig
}

export interface SetupWizardConfig {
  api: string
  features: {
    memory: boolean
    streaming: boolean
    rateLimiting: boolean
    enterprise: boolean
  }
  ui: {
    header: boolean
    prompts: boolean
    darkMode: boolean
  }
}