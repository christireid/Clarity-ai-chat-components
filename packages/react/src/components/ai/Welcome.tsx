'use client'

/**
 * Welcome Component
 *
 * A welcome/landing screen for AI chat interfaces with customizable
 * branding, quick actions, and example prompts.
 *
 * Features:
 * - Customizable branding (logo, title, description)
 * - Quick action buttons
 * - Example prompts/suggestions
 * - Multiple layout variants
 * - Animated entrance
 * - Responsive design
 *
 * @example
 * ```tsx
 * <Welcome
 *   title="How can I help you today?"
 *   description="I'm your AI assistant, ready to help with questions, writing, analysis, and more."
 *   suggestions={[
 *     { text: "Write a professional email", icon: <MailIcon /> },
 *     { text: "Explain quantum computing", icon: <AtomIcon /> },
 *     { text: "Help me debug my code", icon: <CodeIcon /> },
 *   ]}
 *   onSuggestionClick={(suggestion) => console.log(suggestion)}
 * />
 * ```
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { DURATION_SECONDS, EASING_FRAMER } from './animation-constants'

// ============================================================================
// Types
// ============================================================================

/** Quick action item */
export interface WelcomeAction {
  /** Unique key */
  key: string
  /** Action label */
  label: string
  /** Action description */
  description?: string
  /** Action icon */
  icon?: React.ReactNode
  /** Whether disabled */
  disabled?: boolean
}

/** Suggestion item */
export interface WelcomeSuggestion {
  /** Suggestion text */
  text: string
  /** Suggestion icon */
  icon?: React.ReactNode
  /** Category/tag */
  category?: string
  /** Whether disabled */
  disabled?: boolean
}

/** Feature item for feature list */
export interface WelcomeFeature {
  /** Feature title */
  title: string
  /** Feature description */
  description: string
  /** Feature icon */
  icon?: React.ReactNode
}

/** Display variant */
export type WelcomeVariant = 'default' | 'centered' | 'split' | 'minimal' | 'hero'

/** Size variant */
export type WelcomeSize = 'sm' | 'md' | 'lg'

/** Props for Welcome component */
export interface WelcomeProps {
  /** Main title */
  title?: string
  /** Subtitle or description */
  description?: string
  /** Logo or avatar */
  logo?: React.ReactNode
  /** Display variant */
  variant?: WelcomeVariant
  /** Size variant */
  size?: WelcomeSize
  /** Quick actions */
  actions?: WelcomeAction[]
  /** Suggestion prompts */
  suggestions?: WelcomeSuggestion[]
  /** Feature highlights */
  features?: WelcomeFeature[]
  /** Maximum suggestions to show */
  maxSuggestions?: number
  /** Whether to show animation */
  animated?: boolean
  /** Header content */
  header?: React.ReactNode
  /** Footer content */
  footer?: React.ReactNode
  /** Custom content (replaces default layout) */
  children?: React.ReactNode
  /** Custom class name */
  className?: string
  /** Callback when action clicked */
  onActionClick?: (action: WelcomeAction) => void
  /** Callback when suggestion clicked */
  onSuggestionClick?: (suggestion: WelcomeSuggestion) => void
}

/** Hook options */
export interface UseWelcomeOptions {
  /** Initial suggestions */
  suggestions?: WelcomeSuggestion[]
  /** Initial actions */
  actions?: WelcomeAction[]
  /** Storage key for usage tracking */
  storageKey?: string
  /** Track suggestion usage */
  trackUsage?: boolean
}

/** Hook return type */
export interface UseWelcomeReturn {
  /** Suggestions */
  suggestions: WelcomeSuggestion[]
  /** Actions */
  actions: WelcomeAction[]
  /** Most used suggestions */
  popularSuggestions: WelcomeSuggestion[]
  /** Track suggestion use */
  useSuggestion: (text: string) => void
  /** Track action use */
  useAction: (key: string) => void
  /** Add suggestion */
  addSuggestion: (suggestion: WelcomeSuggestion) => void
  /** Remove suggestion */
  removeSuggestion: (text: string) => void
  /** Add action */
  addAction: (action: WelcomeAction) => void
  /** Remove action */
  removeAction: (key: string) => void
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for managing welcome screen state
 */
export function useWelcome(options: UseWelcomeOptions = {}): UseWelcomeReturn {
  const {
    suggestions: initialSuggestions = [],
    actions: initialActions = [],
    storageKey = 'welcome-state',
    trackUsage = true,
  } = options

  const [suggestions, setSuggestions] = React.useState<WelcomeSuggestion[]>(initialSuggestions)
  const [actions, setActions] = React.useState<WelcomeAction[]>(initialActions)
  const [usageMap, setUsageMap] = React.useState<Record<string, number>>({})

  // Load usage from storage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && storageKey && trackUsage) {
      try {
        const stored = localStorage.getItem(`${storageKey}-usage`)
        if (stored) {
          setUsageMap(JSON.parse(stored))
        }
      } catch (e) {
        console.warn('Failed to load welcome usage:', e)
      }
    }
  }, [storageKey, trackUsage])

  // Save usage to storage
  const saveUsage = React.useCallback(() => {
    if (typeof window !== 'undefined' && storageKey && trackUsage) {
      try {
        localStorage.setItem(`${storageKey}-usage`, JSON.stringify(usageMap))
      } catch (e) {
        console.warn('Failed to save welcome usage:', e)
      }
    }
  }, [storageKey, trackUsage, usageMap])

  React.useEffect(() => {
    saveUsage()
  }, [saveUsage])

  const useSuggestion = React.useCallback((text: string) => {
    setUsageMap((prev) => ({
      ...prev,
      [text]: (prev[text] || 0) + 1,
    }))
  }, [])

  const useAction = React.useCallback((key: string) => {
    setUsageMap((prev) => ({
      ...prev,
      [`action:${key}`]: (prev[`action:${key}`] || 0) + 1,
    }))
  }, [])

  const popularSuggestions = React.useMemo(() => {
    return [...suggestions]
      .sort((a, b) => (usageMap[b.text] || 0) - (usageMap[a.text] || 0))
      .slice(0, 5)
  }, [suggestions, usageMap])

  const addSuggestion = React.useCallback((suggestion: WelcomeSuggestion) => {
    setSuggestions((prev) => [...prev, suggestion])
  }, [])

  const removeSuggestion = React.useCallback((text: string) => {
    setSuggestions((prev) => prev.filter((s) => s.text !== text))
  }, [])

  const addAction = React.useCallback((action: WelcomeAction) => {
    setActions((prev) => [...prev, action])
  }, [])

  const removeAction = React.useCallback((key: string) => {
    setActions((prev) => prev.filter((a) => a.key !== key))
  }, [])

  return {
    suggestions,
    actions,
    popularSuggestions,
    useSuggestion,
    useAction,
    addSuggestion,
    removeSuggestion,
    addAction,
    removeAction,
  }
}

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_SECONDS.normal,
      ease: EASING_FRAMER,
    },
  },
}

// ============================================================================
// Sub-components
// ============================================================================

interface SuggestionCardProps {
  suggestion: WelcomeSuggestion
  size: WelcomeSize
  onClick: () => void
}

function SuggestionCard({ suggestion, size, onClick }: SuggestionCardProps) {
  return (
    <motion.button
      className={`welcome-suggestion welcome-suggestion-${size}`}
      variants={itemVariants}
      onClick={onClick}
      disabled={suggestion.disabled}
      type="button"
    >
      {suggestion.icon && (
        <span className="welcome-suggestion-icon">{suggestion.icon}</span>
      )}
      <span className="welcome-suggestion-text">{suggestion.text}</span>
      {suggestion.category && (
        <span className="welcome-suggestion-category">{suggestion.category}</span>
      )}
    </motion.button>
  )
}

interface ActionButtonProps {
  action: WelcomeAction
  size: WelcomeSize
  onClick: () => void
}

function ActionButton({ action, size, onClick }: ActionButtonProps) {
  return (
    <motion.button
      className={`welcome-action welcome-action-${size}`}
      variants={itemVariants}
      onClick={onClick}
      disabled={action.disabled}
      type="button"
    >
      {action.icon && <span className="welcome-action-icon">{action.icon}</span>}
      <div className="welcome-action-content">
        <span className="welcome-action-label">{action.label}</span>
        {action.description && (
          <span className="welcome-action-description">{action.description}</span>
        )}
      </div>
    </motion.button>
  )
}

interface FeatureCardProps {
  feature: WelcomeFeature
  size: WelcomeSize
}

function FeatureCard({ feature, size }: FeatureCardProps) {
  return (
    <motion.div
      className={`welcome-feature welcome-feature-${size}`}
      variants={itemVariants}
    >
      {feature.icon && (
        <span className="welcome-feature-icon">{feature.icon}</span>
      )}
      <div className="welcome-feature-content">
        <h4 className="welcome-feature-title">{feature.title}</h4>
        <p className="welcome-feature-description">{feature.description}</p>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Welcome component for chat welcome/landing screen
 */
export function Welcome({
  title = 'How can I help you today?',
  description,
  logo,
  variant = 'default',
  size = 'md',
  actions = [],
  suggestions = [],
  features = [],
  maxSuggestions = 6,
  animated = true,
  header,
  footer,
  children,
  className = '',
  onActionClick,
  onSuggestionClick,
}: WelcomeProps) {
  const displayedSuggestions = suggestions.slice(0, maxSuggestions)

  const handleSuggestionClick = (suggestion: WelcomeSuggestion) => {
    if (!suggestion.disabled) {
      onSuggestionClick?.(suggestion)
    }
  }

  const handleActionClick = (action: WelcomeAction) => {
    if (!action.disabled) {
      onActionClick?.(action)
    }
  }

  const sizeClasses = {
    sm: 'welcome-sm',
    md: 'welcome-md',
    lg: 'welcome-lg',
  }

  const variantClasses = {
    default: 'welcome-default',
    centered: 'welcome-centered',
    split: 'welcome-split',
    minimal: 'welcome-minimal',
    hero: 'welcome-hero',
  }

  const MotionWrapper = animated ? motion.div : 'div' as unknown as typeof motion.div

  return (
    <MotionWrapper
      className={`welcome ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      initial={animated ? 'hidden' : undefined}
      animate={animated ? 'visible' : undefined}
      variants={animated ? containerVariants : undefined}
    >
      {header}

      {children || (
        <>
          {/* Branding */}
          <motion.div className="welcome-branding" variants={animated ? itemVariants : undefined}>
            {logo && <div className="welcome-logo">{logo}</div>}
            {title && <h1 className="welcome-title">{title}</h1>}
            {description && <p className="welcome-description">{description}</p>}
          </motion.div>

          {/* Features */}
          {features.length > 0 && (
            <div className="welcome-features">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} size={size} />
              ))}
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="welcome-actions">
              {actions.map((action) => (
                <ActionButton
                  key={action.key}
                  action={action}
                  size={size}
                  onClick={() => handleActionClick(action)}
                />
              ))}
            </div>
          )}

          {/* Suggestions */}
          {displayedSuggestions.length > 0 && (
            <div className="welcome-suggestions">
              {variant !== 'minimal' && (
                <motion.h3
                  className="welcome-suggestions-title"
                  variants={animated ? itemVariants : undefined}
                >
                  Try asking
                </motion.h3>
              )}
              <div className="welcome-suggestions-grid">
                {displayedSuggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    suggestion={suggestion}
                    size={size}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {footer}
    </MotionWrapper>
  )
}

// ============================================================================
// Default Logo Component
// ============================================================================

export interface WelcomeLogoProps {
  /** Logo variant */
  variant?: 'sparkle' | 'brain' | 'chat' | 'robot'
  /** Size */
  size?: 'sm' | 'md' | 'lg'
  /** Custom class name */
  className?: string
}

/**
 * Default logo component for Welcome
 */
export function WelcomeLogo({
  variant = 'sparkle',
  size = 'md',
  className = '',
}: WelcomeLogoProps) {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
  }

  const iconSize = sizes[size]

  const icons: Record<string, React.ReactNode> = {
    sparkle: (
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="currentColor"
      />
    ),
    brain: (
      <>
        <path
          d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path d="M12 5v13" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    chat: (
      <>
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path d="M8 10h8" stroke="currentColor" strokeWidth="2" />
        <path d="M8 14h4" stroke="currentColor" strokeWidth="2" />
      </>
    ),
    robot: (
      <>
        <rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M7 8V6a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="8.5" cy="14" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="14" r="1.5" fill="currentColor" />
        <path d="M9 17.5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  }

  return (
    <div className={`welcome-logo-icon welcome-logo-${size} ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[variant]}
      </svg>
    </div>
  )
}

export default Welcome
