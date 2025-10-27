/**
 * InitWizard - Interactive setup wizard using Ink
 */

import React, { useState } from 'react'
import { Box, Text } from 'ink'
import Gradient from 'ink-gradient'
import SelectInput from 'ink-select-input'
import TextInput from 'ink-text-input'
import Spinner from 'ink-spinner'

interface InitWizardProps {
  detectedFramework?: string
  packageManager: string
  onComplete: (config: any) => void
}

type Step = 'framework' | 'template' | 'components' | 'confirm'

const frameworks = [
  { label: '⚡ Next.js (Recommended)', value: 'nextjs' },
  { label: '💿 Remix', value: 'remix' },
  { label: '⚡ Vite + React', value: 'vite' },
  { label: '🔺 Astro', value: 'astro' },
]

const templates = [
  { label: '🎯 Basic Chat - Simple chat interface', value: 'basic' },
  { label: '🔀 Model Comparison - Compare multiple AI models', value: 'comparison' },
  { label: '📚 RAG Workbench - Document Q&A with RAG', value: 'rag' },
  { label: '📊 Analytics Console - Token tracking & analytics', value: 'analytics' },
]

const components = [
  { label: '💬 Chat Interface', value: 'chat-interface', selected: true },
  { label: '🤖 Model Selector', value: 'model-selector', selected: true },
  { label: '📊 Token Counter', value: 'token-counter', selected: false },
  { label: '📈 Cost Estimator', value: 'cost-estimator', selected: false },
  { label: '⚡ Streaming Handler', value: 'streaming-handler', selected: true },
  { label: '🔄 Retry Logic', value: 'retry-logic', selected: false },
]

export function InitWizard({ detectedFramework, packageManager, onComplete }: InitWizardProps) {
  const [step, setStep] = useState<Step>('framework')
  const [config, setConfig] = useState({
    framework: detectedFramework || '',
    template: '',
    components: ['chat-interface', 'model-selector', 'streaming-handler'],
    installDeps: true,
    initGit: true,
  })

  const handleFrameworkSelect = (item: any) => {
    setConfig({ ...config, framework: item.value })
    setStep('template')
  }

  const handleTemplateSelect = (item: any) => {
    setConfig({ ...config, template: item.value })
    setStep('components')
  }

  const handleComponentsSelect = (item: any) => {
    // Toggle component selection
    const components = config.components.includes(item.value)
      ? config.components.filter(c => c !== item.value)
      : [...config.components, item.value]
    
    setConfig({ ...config, components })
  }

  const handleConfirm = () => {
    onComplete(config)
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Gradient name="pastel">
          <Text bold>✨ Clarity Chat Setup Wizard</Text>
        </Gradient>
      </Box>

      {step === 'framework' && (
        <Box flexDirection="column">
          <Text>
            {detectedFramework 
              ? `📦 Detected: ${detectedFramework} (press Enter to use or select another)`
              : '🎯 Select your framework:'}
          </Text>
          <Box marginTop={1}>
            <SelectInput items={frameworks} onSelect={handleFrameworkSelect} />
          </Box>
        </Box>
      )}

      {step === 'template' && (
        <Box flexDirection="column">
          <Text>✅ Framework: {config.framework}</Text>
          <Text marginTop={1}>📦 Select a template:</Text>
          <Box marginTop={1}>
            <SelectInput items={templates} onSelect={handleTemplateSelect} />
          </Box>
        </Box>
      )}

      {step === 'components' && (
        <Box flexDirection="column">
          <Text>✅ Framework: {config.framework}</Text>
          <Text>✅ Template: {config.template}</Text>
          <Text marginTop={1}>🎨 Select components (Space to toggle, Enter to continue):</Text>
          <Box marginTop={1}>
            <SelectInput 
              items={components.map(c => ({
                ...c,
                label: config.components.includes(c.value) 
                  ? `✅ ${c.label}` 
                  : `⬜ ${c.label}`
              }))}
              onSelect={handleComponentsSelect}
            />
          </Box>
          <Text marginTop={1} dimColor>
            Press Enter when done selecting
          </Text>
          <Box marginTop={1}>
            <Text color="green" bold onPress={handleConfirm}>
              → Continue
            </Text>
          </Box>
        </Box>
      )}

      <Box marginTop={2}>
        <Text dimColor>
          📦 Package Manager: {packageManager}
        </Text>
      </Box>
    </Box>
  )
}
