'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Key,
  ExternalLink,
  ChevronRight,
  CirclePlay,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'any'

interface ProviderConfig {
  name: string
  displayName: string
  envVar: string
  docsUrl: string
  color: string
  bgColor: string
  logo: string
}

const providerConfigs: Record<AIProvider, ProviderConfig> = {
  openai: {
    name: 'openai',
    displayName: 'OpenAI',
    envVar: 'OPENAI_API_KEY',
    docsUrl: 'https://platform.openai.com/api-keys',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    logo: '🟢',
  },
  anthropic: {
    name: 'anthropic',
    displayName: 'Anthropic',
    envVar: 'ANTHROPIC_API_KEY',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    logo: '🟠',
  },
  google: {
    name: 'google',
    displayName: 'Google AI',
    envVar: 'GOOGLE_API_KEY',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    logo: '🔵',
  },
  any: {
    name: 'any',
    displayName: 'an AI Provider',
    envVar: 'OPENAI_API_KEY (or ANTHROPIC_API_KEY or GOOGLE_API_KEY)',
    docsUrl: '/learn/quick-start',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    logo: '🤖',
  },
}

interface SetupRequiredProps {
  /** Which AI provider is required */
  provider?: AIProvider
  /** Description of the feature that requires setup */
  feature: string
  /** Optional link to specific setup documentation */
  docsLink?: string
  /** Allow continuing with simulated/demo mode */
  allowDemoMode?: boolean
  /** Callback when user chooses demo mode */
  onDemoMode?: () => void
  /** Custom message to display */
  message?: string
  /** Compact variant for inline display */
  variant?: 'default' | 'compact' | 'banner'
  /** Additional CSS classes */
  className?: string
}

export function SetupRequired({
  provider = 'any',
  feature,
  docsLink,
  allowDemoMode = true,
  onDemoMode,
  message,
  variant = 'default',
  className,
}: SetupRequiredProps) {
  const [showDetails, setShowDetails] = useState(false)
  const config = providerConfigs[provider]

  const defaultMessage =
    provider === 'any'
      ? `This ${feature} requires an API key from an AI provider to show real responses.`
      : `This ${feature} requires a ${config.displayName} API key to work with real AI responses.`

  // Compact banner variant
  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center justify-between gap-4 px-4 py-3 rounded-lg',
          'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800',
          className
        )}
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <span className="text-sm text-amber-800 dark:text-amber-200">
            {message || `API key required for live ${feature}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={docsLink || config.docsUrl}
            target={docsLink?.startsWith('/') ? undefined : '_blank'}
            rel={docsLink?.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline"
          >
            Setup Guide
          </Link>
          {allowDemoMode && onDemoMode && (
            <>
              <span className="text-amber-400">|</span>
              <button
                onClick={onDemoMode}
                className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline"
              >
                Use Demo Mode
              </button>
            </>
          )}
        </div>
      </motion.div>
    )
  }

  // Compact inline variant
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm',
          config.bgColor,
          config.color,
          className
        )}
      >
        <Key className="w-3.5 h-3.5" />
        <span>
          {config.displayName} key required for live {feature}
        </span>
        <Link
          href={docsLink || config.docsUrl}
          target={docsLink?.startsWith('/') ? undefined : '_blank'}
          rel={docsLink?.startsWith('/') ? undefined : 'noopener noreferrer'}
          className="font-medium hover:underline flex items-center gap-0.5"
        >
          Setup
          <ExternalLink className="w-3 h-3" />
        </Link>
      </motion.div>
    )
  }

  // Default full card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border-2 border-dashed overflow-hidden',
        'border-amber-300 dark:border-amber-700',
        'bg-gradient-to-br from-amber-50 to-orange-50',
        'dark:from-amber-950/30 dark:to-orange-950/30',
        className
      )}
    >
      {/* Header */}
      <div className="px-6 py-4 bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
            <Key className="w-5 h-5 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              Setup Required
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Configure an API key to unlock this feature
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <p className="text-amber-800 dark:text-amber-200">
          {message || defaultMessage}
        </p>

        {/* Provider Info */}
        <div
          className={cn(
            'flex items-center gap-3 p-4 rounded-xl',
            'bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700'
          )}
        >
          <span className="text-3xl">{config.logo}</span>
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {config.displayName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {config.envVar}
            </div>
          </div>
          <Link
            href={config.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              'bg-amber-500 hover:bg-amber-600 text-white'
            )}
          >
            Get API Key
          </Link>
        </div>

        {/* Setup Instructions Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
        >
          <ChevronRight
            className={cn(
              'w-4 h-4 transition-transform',
              showDetails && 'rotate-90'
            )}
          />
          How to set up your API key
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pl-6 text-sm text-amber-800 dark:text-amber-200"
          >
            <div className="flex items-start gap-2">
              <span className="font-mono bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded text-xs">
                1
              </span>
              <span>
                Get your API key from{' '}
                <Link
                  href={config.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  {config.displayName}
                </Link>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded text-xs">
                2
              </span>
              <span>
                Create a <code className="font-mono bg-amber-200/50 dark:bg-amber-800/50 px-1 rounded">.env.local</code> file in your project root
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded text-xs">
                3
              </span>
              <div>
                Add your key:
                <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-lg font-mono text-xs overflow-x-auto">
                  {config.envVar}=your_api_key_here
                </pre>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded text-xs">
                4
              </span>
              <span>Restart your development server</span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={docsLink || '/learn/quick-start'}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
              'hover:bg-gray-800 dark:hover:bg-gray-100'
            )}
          >
            <Settings className="w-4 h-4" />
            Full Setup Guide
          </Link>

          {allowDemoMode && (
            <button
              onClick={onDemoMode}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                'border border-gray-300 dark:border-gray-600',
                'hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              <CirclePlay className="w-4 h-4" />
              Continue with Demo Mode
            </button>
          )}
        </div>

        {/* Demo Mode Explanation */}
        {allowDemoMode && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Demo Mode:</strong> Experience all features with simulated
              responses. Perfect for exploring the interface before setting up
              your API keys.
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SetupRequired
