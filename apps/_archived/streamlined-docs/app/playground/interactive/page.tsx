'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Copy,
  Check,
  Sun,
  Moon,
  Download,
  Share2,
  Settings2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Code2,
  Eye,
  Maximize2,
  Minimize2,
  Sparkles,
  Palette,
  Terminal,
  Zap,
} from 'lucide-react'
import { durations, fadeInUp } from '@/lib/animations'

// =============================================================================
// TYPES
// =============================================================================

type ComponentType = 'button' | 'card' | 'input' | 'badge' | 'message'

interface PropControl {
  name: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'color'
  value: any
  options?: string[]
  min?: number
  max?: number
  step?: number
}

interface PresetConfig {
  id: string
  name: string
  description: string
  props: Record<string, any>
}

interface ComponentConfig {
  id: ComponentType
  name: string
  icon: React.ReactNode
  description: string
  component: React.ComponentType<any>
  defaultProps: Record<string, any>
  propControls: PropControl[]
  presets: PresetConfig[]
  codeTemplate: (props: Record<string, any>) => string
}

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function DemoButton({ variant = 'primary', size = 'md', disabled = false, children = 'Click me' }: any) {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    secondary: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600',
    outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`
        rounded-lg font-medium transition-all
        focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant as keyof typeof variants]}
        ${sizes[size as keyof typeof sizes]}
      `}
    >
      {children}
    </motion.button>
  )
}

function DemoCard({ variant = 'default', padding = 'md', elevation = 'md', children = 'Card content' }: any) {
  const variants = {
    default: 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700',
    elevated: 'bg-white dark:bg-neutral-900',
    glass: 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50',
  }

  const paddings = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }

  const elevations = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }

  return (
    <div className={`rounded-xl transition-all ${variants[variant]} ${paddings[padding]} ${elevations[elevation]}`}>
      {children}
    </div>
  )
}

function DemoInput({ placeholder = 'Enter text...', size = 'md', disabled = false }: any) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-4 py-3 text-lg',
  }

  return (
    <input
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full rounded-lg border border-neutral-200 dark:border-neutral-700
        bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
        placeholder:text-neutral-400 transition-all
        focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size as keyof typeof sizes]}
      `}
    />
  )
}

function DemoBadge({ variant = 'default', size = 'md', children = 'Badge' }: any) {
  const variants = {
    default: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white',
    primary: 'bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400',
    success: 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  return <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>{children}</span>
}

function DemoMessage({ role = 'user', content = 'Hello! This is a sample message.', showAvatar = true }: any) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {showAvatar && (
        <div
          className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0
          ${isUser ? 'bg-brand-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'}
        `}
        >
          {isUser ? 'U' : 'A'}
        </div>
      )}
      <div
        className={`
        max-w-[80%] px-4 py-2 rounded-2xl
        ${
          isUser
            ? 'bg-brand-500 text-white rounded-br-sm'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-sm'
        }
      `}
      >
        {content}
      </div>
    </div>
  )
}

// =============================================================================
// COMPONENT CONFIGURATIONS
// =============================================================================

const COMPONENTS: ComponentConfig[] = [
  {
    id: 'button',
    name: 'Button',
    icon: <Zap className="w-5 h-5" />,
    description: 'Interactive button component',
    component: DemoButton,
    defaultProps: {
      variant: 'primary',
      size: 'md',
      disabled: false,
      children: 'Click me',
    },
    propControls: [
      {
        name: 'variant',
        type: 'select',
        value: 'primary',
        options: ['primary', 'secondary', 'outline'],
      },
      {
        name: 'size',
        type: 'select',
        value: 'md',
        options: ['sm', 'md', 'lg'],
      },
      {
        name: 'disabled',
        type: 'boolean',
        value: false,
      },
      {
        name: 'children',
        type: 'text',
        value: 'Click me',
      },
    ],
    presets: [
      {
        id: 'primary',
        name: 'Primary',
        description: 'Default primary button',
        props: { variant: 'primary', size: 'md', disabled: false, children: 'Primary Action' },
      },
      {
        id: 'secondary',
        name: 'Secondary',
        description: 'Secondary action button',
        props: { variant: 'secondary', size: 'md', disabled: false, children: 'Secondary' },
      },
      {
        id: 'cta',
        name: 'Call to Action',
        description: 'Large primary CTA',
        props: { variant: 'primary', size: 'lg', disabled: false, children: 'Get Started' },
      },
    ],
    codeTemplate: (props) => `<Button
  variant="${props.variant}"
  size="${props.size}"
  ${props.disabled ? 'disabled' : ''}
>
  ${props.children}
</Button>`,
  },
  {
    id: 'card',
    name: 'Card',
    icon: <Terminal className="w-5 h-5" />,
    description: 'Container card component',
    component: DemoCard,
    defaultProps: {
      variant: 'default',
      padding: 'md',
      elevation: 'md',
      children: 'Card content goes here',
    },
    propControls: [
      {
        name: 'variant',
        type: 'select',
        value: 'default',
        options: ['default', 'elevated', 'glass'],
      },
      {
        name: 'padding',
        type: 'select',
        value: 'md',
        options: ['sm', 'md', 'lg'],
      },
      {
        name: 'elevation',
        type: 'select',
        value: 'md',
        options: ['none', 'sm', 'md', 'lg'],
      },
      {
        name: 'children',
        type: 'text',
        value: 'Card content goes here',
      },
    ],
    presets: [
      {
        id: 'default',
        name: 'Default Card',
        description: 'Standard card style',
        props: { variant: 'default', padding: 'md', elevation: 'md', children: 'Standard card content' },
      },
      {
        id: 'glass',
        name: 'Glass Card',
        description: 'Modern glass morphism',
        props: { variant: 'glass', padding: 'lg', elevation: 'lg', children: 'Glass effect card' },
      },
    ],
    codeTemplate: (props) => `<Card
  variant="${props.variant}"
  padding="${props.padding}"
  elevation="${props.elevation}"
>
  ${props.children}
</Card>`,
  },
  {
    id: 'input',
    name: 'Input',
    icon: <Code2 className="w-5 h-5" />,
    description: 'Text input field',
    component: DemoInput,
    defaultProps: {
      placeholder: 'Enter text...',
      size: 'md',
      disabled: false,
    },
    propControls: [
      {
        name: 'placeholder',
        type: 'text',
        value: 'Enter text...',
      },
      {
        name: 'size',
        type: 'select',
        value: 'md',
        options: ['sm', 'md', 'lg'],
      },
      {
        name: 'disabled',
        type: 'boolean',
        value: false,
      },
    ],
    presets: [
      {
        id: 'default',
        name: 'Default Input',
        description: 'Standard text input',
        props: { placeholder: 'Enter text...', size: 'md', disabled: false },
      },
      {
        id: 'search',
        name: 'Search Input',
        description: 'Search field',
        props: { placeholder: 'Search...', size: 'md', disabled: false },
      },
    ],
    codeTemplate: (props) => `<Input
  placeholder="${props.placeholder}"
  size="${props.size}"
  ${props.disabled ? 'disabled' : ''}
/>`,
  },
  {
    id: 'badge',
    name: 'Badge',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'Status badge component',
    component: DemoBadge,
    defaultProps: {
      variant: 'default',
      size: 'md',
      children: 'Badge',
    },
    propControls: [
      {
        name: 'variant',
        type: 'select',
        value: 'default',
        options: ['default', 'primary', 'success', 'warning', 'error'],
      },
      {
        name: 'size',
        type: 'select',
        value: 'md',
        options: ['sm', 'md', 'lg'],
      },
      {
        name: 'children',
        type: 'text',
        value: 'Badge',
      },
    ],
    presets: [
      {
        id: 'status',
        name: 'Status Badge',
        description: 'Success status',
        props: { variant: 'success', size: 'md', children: 'Active' },
      },
      {
        id: 'alert',
        name: 'Alert Badge',
        description: 'Warning alert',
        props: { variant: 'warning', size: 'md', children: 'Warning' },
      },
    ],
    codeTemplate: (props) => `<Badge
  variant="${props.variant}"
  size="${props.size}"
>
  ${props.children}
</Badge>`,
  },
  {
    id: 'message',
    name: 'Chat Message',
    icon: <Palette className="w-5 h-5" />,
    description: 'Chat message bubble',
    component: DemoMessage,
    defaultProps: {
      role: 'user',
      content: 'Hello! This is a sample message.',
      showAvatar: true,
    },
    propControls: [
      {
        name: 'role',
        type: 'select',
        value: 'user',
        options: ['user', 'assistant'],
      },
      {
        name: 'content',
        type: 'text',
        value: 'Hello! This is a sample message.',
      },
      {
        name: 'showAvatar',
        type: 'boolean',
        value: true,
      },
    ],
    presets: [
      {
        id: 'user',
        name: 'User Message',
        description: 'Message from user',
        props: { role: 'user', content: 'How can I use this component?', showAvatar: true },
      },
      {
        id: 'assistant',
        name: 'Assistant Message',
        description: 'AI response',
        props: { role: 'assistant', content: 'Here is how you can use this component...', showAvatar: true },
      },
    ],
    codeTemplate: (props) => `<ChatMessage
  role="${props.role}"
  content="${props.content}"
  ${props.showAvatar ? 'showAvatar' : ''}
/>`,
  },
]

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function InteractivePlaygroundPage() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('button')
  const [componentProps, setComponentProps] = useState<Record<string, any>>({})
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [showControls, setShowControls] = useState(true)

  const config = useMemo(() => COMPONENTS.find((c) => c.id === selectedComponent)!, [selectedComponent])

  // Initialize props when component changes
  useEffect(() => {
    setComponentProps(config.defaultProps)
  }, [config])

  // Update prop value
  const updateProp = useCallback((name: string, value: any) => {
    setComponentProps((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Apply preset
  const applyPreset = useCallback((preset: PresetConfig) => {
    setComponentProps(preset.props)
  }, [])

  // Reset to defaults
  const resetProps = useCallback(() => {
    setComponentProps(config.defaultProps)
  }, [config])

  // Copy code to clipboard
  const copyCode = useCallback(async () => {
    const code = config.codeTemplate(componentProps)
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [config, componentProps])

  // Share playground URL
  const sharePlayground = useCallback(() => {
    const params = new URLSearchParams({
      component: selectedComponent,
      props: JSON.stringify(componentProps),
      theme,
    })
    const url = `${window.location.origin}${window.location.pathname}?${params}`
    navigator.clipboard.writeText(url)
    setShareLink('Link copied to clipboard!')
    setTimeout(() => setShareLink(''), 3000)
  }, [selectedComponent, componentProps, theme])

  // Load from URL params
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const component = params.get('component') as ComponentType
    const props = params.get('props')
    const urlTheme = params.get('theme') as 'light' | 'dark'

    if (component && COMPONENTS.find((c) => c.id === component)) {
      setSelectedComponent(component)
    }
    if (props) {
      try {
        setComponentProps(JSON.parse(props))
      } catch (e) {
        // Invalid props, ignore
      }
    }
    if (urlTheme) {
      setTheme(urlTheme)
    }
  }, [])

  const Component = config.component
  const code = useMemo(() => config.codeTemplate(componentProps), [config, componentProps])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-neutral-950' : 'bg-neutral-50'} transition-colors`}>
      <div className="container-docs py-8 sm:py-12">
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2 dark:text-white">Interactive Playground</h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Customize components in real-time and export robust code
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-white" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 dark:text-white" />
                ) : (
                  <Maximize2 className="w-5 h-5 dark:text-white" />
                )}
              </button>

              {/* Share */}
              <button
                onClick={sharePlayground}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {shareLink && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-lg text-sm text-green-600 dark:text-green-400 mb-4"
            >
              {shareLink}
            </motion.div>
          )}

          {/* Component Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {COMPONENTS.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(comp.id)}
                className={`
                  p-4 rounded-xl border transition-all text-left
                  ${
                    selectedComponent === comp.id
                      ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-300 dark:border-brand-700 shadow-lg'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-brand-200 dark:hover:border-brand-800'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`
                    p-2 rounded-lg
                    ${
                      selectedComponent === comp.id
                        ? 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }
                  `}
                  >
                    {comp.icon}
                  </div>
                  <h3 className="font-semibold text-sm dark:text-white">{comp.name}</h3>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">{comp.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setViewMode('split')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${
                viewMode === 'split'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
              }
            `}
          >
            <Settings2 className="w-4 h-4" />
            Split View
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${
                viewMode === 'preview'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
              }
            `}
          >
            <Eye className="w-4 h-4" />
            Preview Only
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${
                viewMode === 'code'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
              }
            `}
          >
            <Code2 className="w-4 h-4" />
            Code Only
          </button>
        </div>

        {/* Main Playground */}
        <div className={`grid ${viewMode === 'split' ? 'lg:grid-cols-[300px_1fr]' : 'grid-cols-1'} gap-6`}>
          {/* Controls Panel */}
          {(viewMode === 'split' || showControls) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold dark:text-white">Controls</h2>
                  <button
                    onClick={resetProps}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>

                {/* Presets */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 dark:text-white">Presets</label>
                  <div className="space-y-2">
                    {config.presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className="w-full text-left p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border border-neutral-200 dark:border-neutral-700"
                      >
                        <div className="font-medium text-sm dark:text-white">{preset.name}</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">{preset.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prop Controls */}
                <div className="space-y-4">
                  {config.propControls.map((control) => (
                    <div key={control.name}>
                      <label className="block text-sm font-medium mb-2 capitalize dark:text-white">{control.name}</label>

                      {control.type === 'text' && (
                        <input
                          type="text"
                          value={componentProps[control.name] || ''}
                          onChange={(e) => updateProp(control.name, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      )}

                      {control.type === 'number' && (
                        <input
                          type="number"
                          value={componentProps[control.name] || 0}
                          onChange={(e) => updateProp(control.name, Number(e.target.value))}
                          min={control.min}
                          max={control.max}
                          step={control.step}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      )}

                      {control.type === 'boolean' && (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={componentProps[control.name] || false}
                            onChange={(e) => updateProp(control.name, e.target.checked)}
                            className="w-5 h-5 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                          />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {componentProps[control.name] ? 'Enabled' : 'Disabled'}
                          </span>
                        </label>
                      )}

                      {control.type === 'select' && (
                        <select
                          value={componentProps[control.name] || ''}
                          onChange={(e) => updateProp(control.name, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          {control.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {control.type === 'color' && (
                        <input
                          type="color"
                          value={componentProps[control.name] || '#000000'}
                          onChange={(e) => updateProp(control.name, e.target.value)}
                          className="w-full h-10 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Preview and Code */}
          <div className="space-y-6">
            {/* Preview */}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold dark:text-white">Preview</h2>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <Play className="w-3 h-3" />
                    Live
                  </div>
                </div>

                <div className="min-h-[200px] flex items-center justify-center p-8 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                  <Component {...componentProps} />
                </div>
              </motion.div>
            )}

            {/* Code */}
            {(viewMode === 'split' || viewMode === 'code') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h2 className="font-semibold dark:text-white">Code</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyCode}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm font-medium text-neutral-600 dark:text-neutral-400"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([code], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${config.id}-component.tsx`
                        a.click()
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-neutral-900 dark:text-neutral-100 font-mono">{code}</code>
                  </pre>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
