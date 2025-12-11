'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HeroParticles } from '@/components/hero'
import type { InteractionMode } from '@/components/hero'
import {
  Sparkles,
  MousePointer,
  Magnet,
  Blend,
  Moon,
  Sun,
  Smartphone,
  Monitor,
  RefreshCw,
} from 'lucide-react'

// =============================================================================
// PRESET CONFIGURATIONS
// =============================================================================

interface Preset {
  name: string
  description: string
  config: {
    count?: number
    interactionMode: InteractionMode
    interactionStrength: number
    bloomIntensity: number
    primaryColor?: string
    secondaryColor?: string
  }
}

const PRESETS: Preset[] = [
  {
    name: 'Default',
    description: 'Balanced settings for general use',
    config: {
      interactionMode: 'repel',
      interactionStrength: 0.5,
      bloomIntensity: 1.5,
    },
  },
  {
    name: 'Subtle',
    description: 'Minimal, understated effect',
    config: {
      count: 400,
      interactionMode: 'repel',
      interactionStrength: 0.3,
      bloomIntensity: 0.8,
    },
  },
  {
    name: 'Dramatic',
    description: 'Bold, eye-catching animation',
    config: {
      count: 1000,
      interactionMode: 'repel',
      interactionStrength: 0.8,
      bloomIntensity: 2.5,
    },
  },
  {
    name: 'Magnetic',
    description: 'Particles drawn to cursor',
    config: {
      interactionMode: 'attract',
      interactionStrength: 0.6,
      bloomIntensity: 1.8,
    },
  },
  {
    name: 'Hybrid',
    description: 'Attract from far, repel when close',
    config: {
      interactionMode: 'hybrid',
      interactionStrength: 0.7,
      bloomIntensity: 2.0,
    },
  },
  {
    name: 'Cosmic',
    description: 'Deep space vibes',
    config: {
      count: 1200,
      interactionMode: 'hybrid',
      interactionStrength: 0.5,
      bloomIntensity: 2.2,
      primaryColor: '#818cf8',
      secondaryColor: '#c084fc',
    },
  },
  {
    name: 'Ocean',
    description: 'Calm, flowing water',
    config: {
      count: 600,
      interactionMode: 'attract',
      interactionStrength: 0.4,
      bloomIntensity: 1.2,
      primaryColor: '#22d3ee',
      secondaryColor: '#0ea5e9',
    },
  },
  {
    name: 'Fire',
    description: 'Warm, energetic particles',
    config: {
      count: 800,
      interactionMode: 'repel',
      interactionStrength: 0.7,
      bloomIntensity: 2.0,
      primaryColor: '#f97316',
      secondaryColor: '#ef4444',
    },
  },
]

// =============================================================================
// SLIDER COMPONENT
// =============================================================================

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        <span className="text-sm text-text-secondary font-mono">
          {value.toFixed(step < 1 ? 1 : 0)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer accent-brand-500"
      />
    </div>
  )
}

// =============================================================================
// MODE BUTTON COMPONENT
// =============================================================================

interface ModeButtonProps {
  mode: InteractionMode
  currentMode: InteractionMode
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function ModeButton({
  mode,
  currentMode,
  icon,
  label,
  onClick,
}: ModeButtonProps) {
  const isActive = mode === currentMode

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isActive
          ? 'bg-brand-500 text-white shadow-lg'
          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// =============================================================================
// PRESET BUTTON COMPONENT
// =============================================================================

interface PresetButtonProps {
  preset: Preset
  isActive: boolean
  onClick: () => void
}

function PresetButton({ preset, isActive, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-all ${
        isActive
          ? 'border-brand-500 bg-brand-500/10'
          : 'border-border hover:border-brand-300 hover:bg-bg-secondary'
      }`}
    >
      <div className="font-medium text-text-primary">{preset.name}</div>
      <div className="text-xs text-text-secondary">{preset.description}</div>
    </button>
  )
}

// =============================================================================
// MAIN DEMO PAGE
// =============================================================================

export default function ParticlesDemoPage() {
  // State for controls
  const [count, setCount] = useState(800)
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('repel')
  const [interactionStrength, setInteractionStrength] = useState(0.5)
  const [bloomIntensity, setBloomIntensity] = useState(1.5)
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(
    undefined
  )
  const [secondaryColor, setSecondaryColor] = useState<string | undefined>(
    undefined
  )
  const [activePreset, setActivePreset] = useState<string>('Default')
  const [key, setKey] = useState(0) // For forcing re-render

  // Apply preset
  const applyPreset = useCallback((preset: Preset) => {
    setActivePreset(preset.name)
    setCount(preset.config.count ?? 800)
    setInteractionMode(preset.config.interactionMode)
    setInteractionStrength(preset.config.interactionStrength)
    setBloomIntensity(preset.config.bloomIntensity)
    setPrimaryColor(preset.config.primaryColor)
    setSecondaryColor(preset.config.secondaryColor)
    setKey((k) => k + 1)
  }, [])

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const defaultPreset = PRESETS[0]
    applyPreset(defaultPreset)
  }, [applyPreset])

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Full-screen particle background */}
      <div className="fixed inset-0">
        <HeroParticles
          key={key}
          count={count}
          interactionMode={interactionMode}
          interactionStrength={interactionStrength}
          bloomIntensity={bloomIntensity}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 container-docs py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-500 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Interactive Demo
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Hero Particles
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A stunning 3D particle animation with mouse/touch interaction, bloom
            effects, and smooth organic motion. Try moving your cursor around!
          </p>
        </motion.div>

        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-xl">
            {/* Presets */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                Presets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRESETS.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    preset={preset}
                    isActive={activePreset === preset.name}
                    onClick={() => applyPreset(preset)}
                  />
                ))}
              </div>
            </div>

            {/* Interaction Mode */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                Interaction Mode
              </h3>
              <div className="flex flex-wrap gap-3">
                <ModeButton
                  mode="repel"
                  currentMode={interactionMode}
                  icon={<MousePointer className="w-4 h-4" />}
                  label="Repel"
                  onClick={() => {
                    setInteractionMode('repel')
                    setActivePreset('')
                  }}
                />
                <ModeButton
                  mode="attract"
                  currentMode={interactionMode}
                  icon={<Magnet className="w-4 h-4" />}
                  label="Attract"
                  onClick={() => {
                    setInteractionMode('attract')
                    setActivePreset('')
                  }}
                />
                <ModeButton
                  mode="hybrid"
                  currentMode={interactionMode}
                  icon={<Blend className="w-4 h-4" />}
                  label="Hybrid"
                  onClick={() => {
                    setInteractionMode('hybrid')
                    setActivePreset('')
                  }}
                />
              </div>
            </div>

            {/* Sliders */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Slider
                label="Particle Count"
                value={count}
                min={100}
                max={1500}
                step={100}
                onChange={(v) => {
                  setCount(v)
                  setActivePreset('')
                }}
              />
              <Slider
                label="Interaction Strength"
                value={interactionStrength}
                min={0}
                max={1}
                step={0.1}
                onChange={(v) => {
                  setInteractionStrength(v)
                  setActivePreset('')
                }}
              />
              <Slider
                label="Bloom Intensity"
                value={bloomIntensity}
                min={0}
                max={3}
                step={0.1}
                onChange={(v) => {
                  setBloomIntensity(v)
                  setActivePreset('')
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <span>Desktop: {count} particles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile: ~{Math.round(count * 0.375)} particles</span>
                </div>
              </div>
              <button
                onClick={resetToDefaults}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="bg-bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-xl">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Usage
            </h3>
            <pre className="bg-bg-tertiary rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-text-primary">
                {`import { HeroParticles } from '@/components/hero'

<HeroParticles
  interactionMode="${interactionMode}"
  interactionStrength={${interactionStrength}}
  bloomIntensity={${bloomIntensity}}${count !== 800 ? `\n  count={${count}}` : ''}${primaryColor ? `\n  primaryColor="${primaryColor}"` : ''}${secondaryColor ? `\n  secondaryColor="${secondaryColor}"` : ''}
/>`}
              </code>
            </pre>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <MousePointer className="w-5 h-5" />,
                title: 'Mouse & Touch',
                description: 'Interactive on all devices',
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: 'Bloom Effect',
                description: 'Dreamy post-processing glow',
              },
              {
                icon: <Sun className="w-5 h-5" />,
                title: 'Theme Aware',
                description: 'Adapts to dark/light mode',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-bg-secondary/60 backdrop-blur rounded-xl border border-border p-4 text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-500/10 text-brand-500 mb-3">
                  {feature.icon}
                </div>
                <h4 className="font-medium text-text-primary mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
