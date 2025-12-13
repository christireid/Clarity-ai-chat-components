'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Palette,
  ChevronLeft,
  Copy,
  Check,
  ArrowRight,
  Sun,
  Moon,
  Bot,
  User,
  MessageSquare
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { useCopyToClipboard } from '@/lib/demos/hooks'
import { trackDemoViewed, trackCodeCopied } from '@/lib/demos/analytics'
import { CopyFullExampleButton } from '@/components/Demo/CopyFullExampleButton'

interface ConfigOption {
  id: string
  label: string
  type: 'toggle' | 'select' | 'color'
  value: any
  options?: { label: string; value: any }[]
}

const defaultConfig: ConfigOption[] = [
  { id: 'showTimestamps', label: 'Show Timestamps', type: 'toggle', value: true },
  { id: 'showAvatars', label: 'Show Avatars', type: 'toggle', value: true },
  { id: 'enableMarkdown', label: 'Enable Markdown', type: 'toggle', value: true },
  { id: 'showTypingIndicator', label: 'Typing Indicator', type: 'toggle', value: true },
  { id: 'enableSoundEffects', label: 'Sound Effects', type: 'toggle', value: false },
  { id: 'theme', label: 'Theme', type: 'select', value: 'system', options: [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ]},
  { id: 'messageStyle', label: 'Message Style', type: 'select', value: 'bubbles', options: [
    { label: 'Bubbles', value: 'bubbles' },
    { label: 'Flat', value: 'flat' },
    { label: 'Minimal', value: 'minimal' },
  ]},
  { id: 'accentColor', label: 'Accent Color', type: 'color', value: '#3b82f6' },
]

const accentColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
]

interface PreviewMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const previewMessages: PreviewMessage[] = [
  { id: '1', text: 'Hello! How can I help you today?', sender: 'bot', timestamp: new Date(Date.now() - 60000) },
  { id: '2', text: 'I need help with my React project.', sender: 'user', timestamp: new Date(Date.now() - 30000) },
  { id: '3', text: "Of course! I'd be happy to help with your React project. What specifically would you like assistance with?", sender: 'bot', timestamp: new Date() },
]

export default function CustomizationPlaygroundDemo() {
  const [config, setConfig] = useState<ConfigOption[]>(defaultConfig)
  const [copied, setCopied] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light')

  // Track demo view
  useEffect(() => {
    trackDemoViewed('customization-playground')
  }, [])

  const getConfigValue = (id: string) => config.find(c => c.id === id)?.value

  const updateConfig = (id: string, value: any) => {
    setConfig(prev => prev.map(c => c.id === id ? { ...c, value } : c))
  }

  const generateCode = () => {
    const props: string[] = []
    props.push('api="/api/chat"')

    if (getConfigValue('showTimestamps')) props.push('showTimestamps')
    if (getConfigValue('showAvatars')) props.push('showAvatars')
    if (getConfigValue('enableMarkdown')) props.push('enableMarkdown')
    if (getConfigValue('showTypingIndicator')) props.push('showTypingIndicator')
    if (getConfigValue('enableSoundEffects')) props.push('enableSoundEffects')

    const theme = getConfigValue('theme')
    if (theme !== 'system') props.push(`theme="${theme}"`)

    const messageStyle = getConfigValue('messageStyle')
    if (messageStyle !== 'bubbles') props.push(`messageStyle="${messageStyle}"`)

    const accentColor = getConfigValue('accentColor')
    if (accentColor !== '#3b82f6') props.push(`accentColor="${accentColor}"`)

    return `import { ClarityChat } from '@clarity-chat/react'

export default function Chat() {
  return (
    <ClarityChat
      ${props.join('\n      ')}
    />
  )
}`
  }

  const copyCode = async () => {
    const code = generateCode()
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
  }

  const accentColor = getConfigValue('accentColor')
  const messageStyle = getConfigValue('messageStyle')
  const showTimestamps = getConfigValue('showTimestamps')
  const showAvatars = getConfigValue('showAvatars')

  // Get message style classes
  const getMessageClasses = (sender: 'user' | 'bot') => {
    const base = 'px-4 py-3'

    if (messageStyle === 'bubbles') {
      return sender === 'bot'
        ? `${base} rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800`
        : `${base} rounded-2xl rounded-tr-sm text-white`
    }
    if (messageStyle === 'flat') {
      return sender === 'bot'
        ? `${base} bg-gray-50 dark:bg-gray-900 border-l-4`
        : `${base} bg-gray-50 dark:bg-gray-900 border-l-4`
    }
    if (messageStyle === 'minimal') {
      return `${base} bg-transparent`
    }
    return base
  }

  return (
    <div className="container-docs py-12">
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Demos
      </Link>

      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
              <Palette className="w-4 h-4" />
              Interactive Builder
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Customization{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Playground
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Toggle features, change themes, and see your configuration come to life.
              Export the code when you're happy with the result.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Config Panel */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-bg-secondary border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Configuration</h3>
                  <button
                    onClick={resetConfig}
                    className="text-sm text-text-secondary hover:text-brand-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Toggle Options */}
                  {config.filter(c => c.type === 'toggle').map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-sm">{option.label}</span>
                      <button
                        onClick={() => updateConfig(option.id, !option.value)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          option.value ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                          animate={{ left: option.value ? '24px' : '4px' }}
                          transition={{ duration: 0.2 }}
                        />
                      </button>
                    </label>
                  ))}

                  <div className="border-t border-border pt-4 mt-4">
                    {/* Select Options */}
                    {config.filter(c => c.type === 'select').map((option) => (
                      <div key={option.id} className="mb-4">
                        <label className="block text-sm mb-2">{option.label}</label>
                        <select
                          value={option.value}
                          onChange={(e) => updateConfig(option.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-bg-primary text-text-primary"
                        >
                          {option.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    {/* Color Picker */}
                    <label className="block text-sm mb-3">Accent Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {accentColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => updateConfig('accentColor', color.value)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            accentColor === color.value
                              ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600'
                              : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Theme Toggle */}
              <div className="p-4 rounded-xl bg-bg-secondary border border-border">
                <label className="block text-sm mb-3">Preview Theme</label>
                <div className="flex rounded-lg overflow-hidden border border-border">
                  <button
                    onClick={() => setPreviewTheme('light')}
                    className={`flex-1 py-2 flex items-center justify-center gap-2 transition-colors ${
                      previewTheme === 'light'
                        ? 'bg-brand-500 text-white'
                        : 'bg-bg-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => setPreviewTheme('dark')}
                    className={`flex-1 py-2 flex items-center justify-center gap-2 transition-colors ${
                      previewTheme === 'dark'
                        ? 'bg-brand-500 text-white'
                        : 'bg-bg-primary hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Preview */}
          <ScrollReveal delay={0.2}>
            <div className="lg:col-span-2">
              {/* Live Preview */}
              <div className={`rounded-2xl border-2 border-border overflow-hidden shadow-xl ${
                previewTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}>
                {/* Header */}
                <div
                  className="px-6 py-4 text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Live Preview</div>
                      <div className="text-xs opacity-90">
                        Your customized chat
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className={`p-6 space-y-4 min-h-[300px] ${
                  previewTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  {previewMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      layout
                      className={`flex items-start gap-3 ${
                        message.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <AnimatePresence>
                        {showAvatars && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              message.sender === 'bot'
                                ? previewTheme === 'dark'
                                  ? 'bg-gray-700'
                                  : 'bg-gray-200'
                                : ''
                            }`}
                            style={{
                              backgroundColor: message.sender === 'user' ? accentColor : undefined,
                            }}
                          >
                            {message.sender === 'bot' ? (
                              <Bot className={`w-5 h-5 ${previewTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="max-w-[75%]">
                        <div
                          className={getMessageClasses(message.sender)}
                          style={{
                            backgroundColor: message.sender === 'user' && messageStyle === 'bubbles' ? accentColor : undefined,
                            borderColor: messageStyle === 'flat' ? accentColor : undefined,
                          }}
                        >
                          <p className={`text-sm leading-relaxed ${
                            previewTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          } ${message.sender === 'user' && messageStyle === 'bubbles' ? 'text-white' : ''}`}>
                            {message.text}
                          </p>
                        </div>
                        <AnimatePresence>
                          {showTimestamps && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className={`text-xs mt-1 ${
                                previewTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              } ${message.sender === 'user' ? 'text-right' : ''}`}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input Preview */}
                <div className={`p-4 border-t ${
                  previewTheme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      disabled
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        previewTheme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                          : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                    <button
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: accentColor }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Output */}
              <div className="mt-6 rounded-2xl border border-border overflow-hidden bg-gray-900">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <span className="text-sm text-gray-300 font-medium">Generated Code</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyCode}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                  <code>{generateCode()}</code>
                </pre>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Export Options */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Export Your Configuration</h3>
                <p className="text-text-secondary">
                  Copy the code above or download a complete starter project with your settings.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={copyCode}
                  className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </button>
                <Link
                  href="/learn/quick-start"
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
