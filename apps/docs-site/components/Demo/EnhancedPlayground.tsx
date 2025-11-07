'use client'

import { useState, ReactNode } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { nightOwl } from '@codesandbox/sandpack-themes'
import { useTheme } from 'next-themes'
import {
  Play,
  RefreshCw,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Code2,
  Settings,
  Zap,
  ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'

export interface PlaygroundPreset {
  name: string
  description?: string
  code: string
  props?: Record<string, any>
}

export interface PlaygroundControl {
  name: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'range'
  defaultValue: any
  options?: string[]
  min?: number
  max?: number
  step?: number
  description?: string
}

interface EnhancedPlaygroundProps {
  title: string
  description?: string
  component?: string
  initialCode: string
  presets?: PlaygroundPreset[]
  controls?: PlaygroundControl[]
  dependencies?: Record<string, string>
  showResponsiveControls?: boolean
  showAccessibilityInfo?: boolean
  showQuickActions?: boolean
  height?: string
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop'

export function EnhancedPlayground({
  title,
  description,
  component,
  initialCode,
  presets = [],
  controls = [],
  dependencies = {},
  showResponsiveControls = true,
  showAccessibilityInfo = false,
  showQuickActions = true,
  height = '600px',
}: EnhancedPlaygroundProps) {
  const { theme } = useTheme()
  const [activePreset, setActivePreset] = useState(0)
  const [currentCode, setCurrentCode] = useState(initialCode)
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [showControls, setShowControls] = useState(true)
  const [copied, setCopied] = useState(false)
  const [key, setKey] = useState(0)

  // Control values state
  const initialControlValues = controls.reduce((acc, control) => {
    acc[control.name] = control.defaultValue
    return acc
  }, {} as Record<string, any>)
  const [controlValues, setControlValues] = useState(initialControlValues)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePresetChange = (index: number) => {
    setActivePreset(index)
    if (presets[index]) {
      setCurrentCode(presets[index].code)
      setKey(key + 1)
    }
  }

  const handleReset = () => {
    setCurrentCode(initialCode)
    setControlValues(initialControlValues)
    setViewport('desktop')
    setKey(key + 1)
  }

  const handleControlChange = (name: string, value: any) => {
    setControlValues({ ...controlValues, [name]: value })
    // TODO: Update code based on control changes
  }

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      case 'desktop':
      default:
        return '100%'
    }
  }

  const defaultDependencies = {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    '@clarity-chat/react': 'latest',
    'lucide-react': '^0.344.0',
    ...dependencies,
  }

  const files = {
    '/App.tsx': currentCode,
    '/index.tsx': `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@clarity-chat/react/styles.css'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)`,
  }

  const sandpackTheme = theme === 'dark' ? nightOwl : 'light'

  return (
    <div className="my-8 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-brand-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Zap className="w-5 h-5 text-brand-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  {title}
                </h3>
              </div>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-12">
                  {description}
                </p>
              )}
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm',
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
                  )}
                  title="Copy code"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://codesandbox.io/s/new?file=/App.tsx=${encodeURIComponent(
                        currentCode
                      )}`,
                      '_blank'
                    )
                  }
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-2 border-gray-200 dark:border-gray-600"
                  title="Open in CodeSandbox"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-2 border-gray-200 dark:border-gray-600"
                  title="Reset playground"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowControls(!showControls)}
                  className={clsx(
                    'p-2 rounded-lg transition-colors border-2',
                    showControls
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                  )}
                  title={showControls ? 'Hide controls' : 'Show controls'}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Presets */}
          {presets.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap ml-12">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Presets:
              </span>
              {presets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetChange(index)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    activePreset === index
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  )}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}

          {/* Responsive Controls */}
          {showResponsiveControls && (
            <div className="mt-4 flex items-center gap-2 ml-12">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Viewport:
              </span>
              <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setViewport('mobile')}
                  className={clsx(
                    'p-2 rounded transition-all',
                    viewport === 'mobile'
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  title="Mobile view (375px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={clsx(
                    'p-2 rounded transition-all',
                    viewport === 'tablet'
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  title="Tablet view (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewport('desktop')}
                  className={clsx(
                    'p-2 rounded transition-all',
                    viewport === 'desktop'
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  title="Desktop view (100%)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Controls Panel */}
        {showControls && controls.length > 0 && (
          <div className="w-full lg:w-80 bg-gray-50 dark:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-50 uppercase tracking-wide">
                Component Props
              </h4>
              <button
                onClick={() => setControlValues(initialControlValues)}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                Reset
              </button>
            </div>

            {controls.map((control) => (
              <div key={control.name} className="space-y-2">
                <label className="block">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {control.label}
                    </span>
                    <code className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded">
                      {control.name}
                    </code>
                  </div>
                  {control.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {control.description}
                    </p>
                  )}

                  {control.type === 'boolean' && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleControlChange(control.name, !controlValues[control.name])}
                        className={clsx(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          controlValues[control.name]
                            ? 'bg-brand-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={clsx(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            controlValues[control.name] ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {controlValues[control.name] ? 'On' : 'Off'}
                      </span>
                    </div>
                  )}

                  {control.type === 'select' && (
                    <select
                      value={controlValues[control.name]}
                      onChange={(e) => handleControlChange(control.name, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                      {control.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {control.type === 'text' && (
                    <input
                      type="text"
                      value={controlValues[control.name]}
                      onChange={(e) => handleControlChange(control.name, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  )}

                  {control.type === 'number' && (
                    <input
                      type="number"
                      value={controlValues[control.name]}
                      onChange={(e) => handleControlChange(control.name, Number(e.target.value))}
                      min={control.min}
                      max={control.max}
                      step={control.step || 1}
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  )}

                  {control.type === 'range' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        value={controlValues[control.name]}
                        onChange={(e) => handleControlChange(control.name, Number(e.target.value))}
                        min={control.min || 0}
                        max={control.max || 100}
                        step={control.step || 1}
                        className="w-full accent-brand-500"
                      />
                      <div className="text-right">
                        <span className="text-sm font-mono font-semibold text-brand-600 dark:text-brand-400">
                          {controlValues[control.name]}
                        </span>
                      </div>
                    </div>
                  )}

                  {control.type === 'color' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={controlValues[control.name]}
                        onChange={(e) => handleControlChange(control.name, e.target.value)}
                        className="w-14 h-10 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={controlValues[control.name]}
                        onChange={(e) => handleControlChange(control.name, e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </label>
              </div>
            ))}

            {/* Install Command */}
            {component && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Install
                </p>
                <div className="bg-gray-900 dark:bg-black rounded-lg p-3 relative group">
                  <code className="text-xs text-green-400 font-mono">
                    npm install @clarity-chat/react
                  </code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText('npm install @clarity-chat/react')
                    }}
                    className="absolute right-2 top-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy install command"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1">
          <div
            style={{
              height,
              maxWidth: showResponsiveControls ? getViewportWidth() : '100%',
              margin: viewport !== 'desktop' ? '0 auto' : '0',
            }}
            className="transition-all duration-300"
          >
            <Sandpack
              key={key}
              template="react-ts"
              theme={sandpackTheme}
              files={files}
              customSetup={{
                dependencies: defaultDependencies,
              }}
              options={{
                showNavigator: false,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: height,
                editorWidthPercentage: 50,
                showConsole: false,
                showConsoleButton: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer with Tips */}
      <div className="bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Edit code on the left to see live changes
            </span>
            <span className="hidden md:block">•</span>
            <span className="hidden md:flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" />
              Preview updates automatically
            </span>
          </div>
          <a
            href="/docs/playground"
            className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            Learn more →
          </a>
        </div>
      </div>
    </div>
  )
}
