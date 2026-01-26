'use client'

/**
 * Components Reference - Overview Page
 *
 * Lists all available components in the Clarity Chat library.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Box,
  ArrowRight,
  MessageSquare,
  Layout,
  Zap,
  Palette,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'

// ISR Configuration
export const revalidate = 3600

interface ComponentInfo {
  name: string
  slug: string
  description: string
  category: string
  isNew?: boolean
  isExperimental?: boolean
}

const components: ComponentInfo[] = [
  {
    name: 'ClarityChat',
    slug: 'clarity-chat',
    description:
      'The main drop-in component for AI chat. Handles streaming, memory, rate limiting, and more.',
    category: 'Chat',
    isNew: false,
  },
  {
    name: 'ChatWindow',
    slug: 'chat-window',
    description:
      'The UI component for rendering chat messages with full customization.',
    category: 'Chat',
  },
  {
    name: 'ChatInput',
    slug: 'chat-input',
    description: 'Customizable input component for sending messages.',
    category: 'Chat',
  },
  {
    name: 'MessageBubble',
    slug: 'message-bubble',
    description: 'Individual message display component with actions.',
    category: 'Messages',
  },
  {
    name: 'StreamingText',
    slug: 'streaming-text',
    description: 'Component for displaying streaming text with typing effect.',
    category: 'Streaming',
  },
  {
    name: 'CodeBlock',
    slug: 'code-block',
    description: 'Syntax highlighted code block with copy functionality.',
    category: 'Content',
  },
  {
    name: 'ThemeProvider',
    slug: 'theme-provider',
    description: 'Context provider for theming and dark mode.',
    category: 'Theming',
  },
  {
    name: 'FloatingChatWidget',
    slug: 'floating-chat-widget',
    description:
      'A floating chat button that expands into a full chat interface.',
    category: 'Chat',
  },
]

const categories = [...new Set(components.map((c) => c.category))]

export default function ComponentsReferencePage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Box className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted-foreground">API Reference</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Components
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore the full library of React components for building AI chat
            interfaces. From simple drop-in solutions to fully customizable
            building blocks.
          </p>
        </motion.header>

        {/* Category sections */}
        <div className="space-y-12">
          {categories.map((category) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {category}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {components
                  .filter((c) => c.category === category)
                  .map((component, index) => (
                    <Link
                      key={component.slug}
                      href={`/reference/components/${component.slug}`}
                      className={cn(
                        'group relative rounded-xl border bg-card text-card-foreground p-6',
                        'shadow-sm hover:shadow-lg transition-all duration-300',
                        'border-border/50 hover:border-brand-500/30',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                      )}
                    >
                      {/* Gradient glow on hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {component.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {component.isNew && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                New
                              </span>
                            )}
                            {component.isExperimental && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                Beta
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {component.description}
                        </p>

                        <div className="flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                          View documentation
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  )
}
