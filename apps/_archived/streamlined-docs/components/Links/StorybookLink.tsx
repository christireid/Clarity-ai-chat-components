/**
 * Storybook Link Component
 *
 * Creates prominent links from documentation to Storybook for interactive component exploration.
 */

'use client'

import { ExternalLink, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { Callout } from '@/components/MDX/Callout'

interface StorybookLinkProps {
  /**
   * Path to the Storybook story (e.g., "components-chatwindow--default")
   */
  story: string

  /**
   * Component name for display (e.g., "ChatWindow")
   */
  componentName?: string

  /**
   * Base URL for Storybook (defaults to production URL when deployed)
   */
  storybookUrl?: string

  /**
   * Display variant
   */
  variant?: 'callout' | 'button' | 'inline'
}

export function StorybookLink({
  story,
  componentName,
  storybookUrl = 'https://storybook.clarity-chat.dev',
  variant = 'callout'
}: StorybookLinkProps) {
  const fullUrl = `${storybookUrl}/?path=/story/${story}`
  const displayName = componentName || story.split('--')[0].split('-').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  if (variant === 'inline') {
    return (
      <motion.a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, x: 2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
      >
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Play className="w-4 h-4" />
        </motion.div>
        View in Storybook
        <motion.div
          whileHover={{ x: 2, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </motion.div>
      </motion.a>
    )
  }

  if (variant === 'button') {
    return (
      <motion.a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Play className="w-4 h-4" />
        </motion.div>
        Try {displayName} in Storybook
        <motion.div
          whileHover={{ x: 2, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <ExternalLink className="w-4 h-4" />
        </motion.div>
      </motion.a>
    )
  }

  // Default: callout variant
  return (
    <Callout type="info" icon={<Play className="w-5 h-5" />}>
      <div className="flex items-start justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <p className="font-medium mb-1">Interactive Demo</p>
          <p className="text-sm text-text-secondary">
            Try this component with live controls and see all variations in Storybook.
          </p>
        </motion.div>
        <motion.a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm rounded-md font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow"
        >
          Open Storybook
          <motion.div
            whileHover={{ x: 2, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.div>
        </motion.a>
      </div>
    </Callout>
  )
}

/**
 * Helper to generate Storybook story path from component name
 */
export function getStorybookPath(componentName: string, storyName: string = 'default') {
  const kebabCase = componentName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()

  return `components-${kebabCase}--${storyName}`
}

/**
 * Quick link component for adding to component pages
 */
export function ViewInStorybook({ component, story }: { component: string; story?: string }) {
  const storyPath = getStorybookPath(component, story)

  return <StorybookLink story={storyPath} componentName={component} />
}
