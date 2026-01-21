'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Key,
  ExternalLink,
  ChevronRight,
  Play,
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
          'relative flex items-center justify-between gap-4 px-4 py-3 rounded-lg overflow-hidden',
          'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
          'shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.15)]',
          className
        )}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.5) 0%, rgba(251,146,60,0.3) 50%, rgba(234,88,12,0.4) 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-3 relative z-10">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <span className="text-sm text-amber-800 dark:text-amber-200">
            {message || `API key required for live ${feature}`}
          </span>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <Link
            href={docsLink || config.docsUrl}
            target={docsLink?.startsWith('/') ? undefined : '_blank'}
            rel={docsLink?.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
          >
            Setup Guide
          </Link>
          {allowDemoMode && onDemoMode && (
            <>
              <span className="text-amber-400/60">|</span>
              <button
                onClick={onDemoMode}
                className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
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
        whileHover={{ scale: 1.02 }}
        className={cn(
          'group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm overflow-hidden',
          config.bgColor,
          config.color,
          'shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]',
          'transition-shadow duration-300',
          'hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.25)]',
          className
        )}
      >
        {/* Subtle gradient border */}
        <div
          className="absolute inset-0 rounded-full opacity-60 pointer-events-none"
          style={{
            padding: '1px',
            background: 'linear-gradient(135deg, currentColor, transparent)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          aria-hidden="true"
        />
        <Key className="w-3.5 h-3.5 relative z-10" />
        <span className="relative z-10">
          {config.displayName} key required for live {feature}
        </span>
        <Link
          href={docsLink || config.docsUrl}
          target={docsLink?.startsWith('/') ? undefined : '_blank'}
          rel={docsLink?.startsWith('/') ? undefined : 'noopener noreferrer'}
          className="relative z-10 font-medium hover:underline flex items-center gap-0.5 transition-colors"
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
        'group/card relative rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-amber-50 to-orange-50',
        'dark:from-amber-950/30 dark:to-orange-950/30',
        'shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.04)]',
        'dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(0,0,0,0.15)]',
        'transition-shadow duration-300',
        'hover:shadow-[0_4px_8px_rgba(245,158,11,0.1),0_8px_16px_rgba(245,158,11,0.08),0_0_40px_rgba(245,158,11,0.1)]',
        'dark:hover:shadow-[0_4px_8px_rgba(245,158,11,0.15),0_8px_16px_rgba(245,158,11,0.1),0_0_40px_rgba(245,158,11,0.12)]',
        className
      )}
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: '2px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.6) 0%, rgba(251,146,60,0.4) 50%, rgba(234,88,12,0.5) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        aria-hidden="true"
      />
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
            'relative flex items-center gap-3 p-4 rounded-xl overflow-hidden',
            'bg-white dark:bg-gray-900/80',
            'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.05)]',
            'dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.15)]',
            'transition-all duration-300',
            'hover:shadow-[0_2px_6px_rgba(245,158,11,0.1),0_4px_12px_rgba(245,158,11,0.08)]',
            'dark:hover:shadow-[0_2px_6px_rgba(245,158,11,0.15),0_4px_12px_rgba(245,158,11,0.1)]'
          )}
        >
          {/* Subtle gradient border */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.4) 0%, rgba(251,146,60,0.2) 50%, rgba(234,88,12,0.3) 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            aria-hidden="true"
          />
          <span className="text-3xl relative z-10">{config.logo}</span>
          <div className="flex-1 relative z-10">
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
              'relative z-10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
              'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_100%]',
              'hover:bg-[position:100%_0] text-white',
              'shadow-md hover:shadow-[0_4px_16px_rgba(245,158,11,0.35)]'
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
                <pre className="mt-2 p-3 bg-[#011627] text-[#d6deeb] rounded-lg font-mono text-xs overflow-x-auto border border-white/[0.08] shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.25)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.25),0_0_20px_rgba(245,158,11,0.1)]">
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
        <div className="flex flex-wrap gap-3 pt-2 relative z-10">
          <Link
            href={docsLink || '/learn/quick-start'}
            className={cn(
              'group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
              'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white',
              'bg-[length:200%_100%] hover:bg-[position:100%_0]',
              'text-white dark:text-gray-900',
              'shadow-md hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]',
              'dark:hover:shadow-[0_4px_16px_rgba(255,255,255,0.15)]'
            )}
          >
            <Settings className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            Full Setup Guide
          </Link>

          {allowDemoMode && (
            <button
              onClick={onDemoMode}
              className={cn(
                'group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300',
                'shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]',
                'hover:shadow-[0_2px_8px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_2px_8px_rgba(129,140,248,0.2)]',
                'overflow-hidden'
              )}
            >
              {/* Gradient border on hover */}
              <div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  padding: '1px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.3) 50%, rgba(244,114,182,0.4) 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                aria-hidden="true"
              />
              <Play className="w-4 h-4 relative z-10 transition-transform group-hover:scale-110 duration-300" />
              <span className="relative z-10">Continue with Demo Mode</span>
            </button>
          )}
        </div>

        {/* Demo Mode Explanation */}
        {allowDemoMode && (
          <div className="relative flex items-start gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg text-sm text-blue-800 dark:text-blue-200 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            {/* Subtle border */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                padding: '1px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(79,70,229,0.1) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
              aria-hidden="true"
            />
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500 relative z-10" />
            <span className="relative z-10">
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
