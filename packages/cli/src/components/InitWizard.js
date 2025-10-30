/**
 * Init Wizard Component
 */

import React, { useState } from 'react'
import { Box, Text, Newline } from 'ink'
import TextInput from 'ink-text-input'
import SelectInput from 'ink-select-input'
import Spinner from 'ink-spinner'
import { detectFramework, detectTypeScript } from '../utils/detect.js'
import logger from '../utils/logger.js'

export function InitWizard({ onComplete }) {
  const [step, setStep] = useState('name')
  const [config, setConfig] = useState({
    name: '',
    framework: detectFramework() || 'react',
    typescript: detectTypeScript(),
    theme: 'defaultLight',
    features: []
  })

  const handleNameSubmit = (name) => {
    setConfig(prev => ({ ...prev, name }))
    setStep('framework')
  }

  const handleFrameworkSelect = (item) => {
    setConfig(prev => ({ ...prev, framework: item.value }))
    setStep('theme')
  }

  const handleThemeSelect = (item) => {
    setConfig(prev => ({ ...prev, theme: item.value }))
    setStep('features')
  }

  const handleFeaturesSelect = (item) => {
    if (item.value === 'done') {
      onComplete(config)
    } else {
      setConfig(prev => ({
        ...prev,
        features: prev.features.includes(item.value)
          ? prev.features.filter(f => f !== item.value)
          : [...prev.features, item.value]
      }))
    }
  }

  if (step === 'name') {
    return (
      <Box flexDirection="column">
        <Text color="cyan">? Project name:</Text>
        <TextInput
          value={config.name}
          onSubmit={handleNameSubmit}
          placeholder="my-chat-app"
        />
      </Box>
    )
  }

  if (step === 'framework') {
    const frameworks = [
      { label: 'Next.js', value: 'nextjs' },
      { label: 'Vite', value: 'vite' },
      { label: 'Create React App', value: 'create-react-app' },
      { label: 'Remix', value: 'remix' },
      { label: 'Plain React', value: 'react' },
    ]

    return (
      <Box flexDirection="column">
        <Text color="cyan">? Choose framework:</Text>
        <SelectInput items={frameworks} onSelect={handleFrameworkSelect} />
      </Box>
    )
  }

  if (step === 'theme') {
    const themes = [
      { label: 'Default Light', value: 'defaultLight' },
      { label: 'Default Dark', value: 'defaultDark' },
      { label: 'Ocean', value: 'ocean' },
      { label: 'Sunset', value: 'sunset' },
      { label: 'Forest', value: 'forest' },
    ]

    return (
      <Box flexDirection="column">
        <Text color="cyan">? Choose default theme:</Text>
        <SelectInput items={themes} onSelect={handleThemeSelect} />
      </Box>
    )
  }

  if (step === 'features') {
    const features = [
      { label: config.features.includes('voice') ? '✓ Voice Input' : '  Voice Input', value: 'voice' },
      { label: config.features.includes('streaming') ? '✓ Streaming' : '  Streaming', value: 'streaming' },
      { label: config.features.includes('analytics') ? '✓ Analytics' : '  Analytics', value: 'analytics' },
      { label: config.features.includes('files') ? '✓ File Upload' : '  File Upload', value: 'files' },
      { label: '→ Done', value: 'done' },
    ]

    return (
      <Box flexDirection="column">
        <Text color="cyan">? Select features (space to toggle, enter to continue):</Text>
        <SelectInput items={features} onSelect={handleFeaturesSelect} />
      </Box>
    )
  }

  return null
}

export default InitWizard