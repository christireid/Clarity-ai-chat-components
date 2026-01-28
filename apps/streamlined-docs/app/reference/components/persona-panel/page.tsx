'use client'

/**
 * PersonaPanel Component - API Reference Documentation
 *
 * A component for managing and switching between AI personas with different
 * personalities, expertise areas, and response configurations.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users,
  Copy,
  Check,
  Zap,
  Star,
  Code2,
  Play,
  Wrench,
  Settings,
  Info,
  Sparkles,
  Brain,
  Target,
  Accessibility,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function PersonaPanelDemo() {
  const [activePersonaId, setActivePersonaId] = React.useState('coder')

  const personas = [
    {
      id: 'coder',
      name: 'Code Assistant',
      role: 'Developer' as const,
      summary: 'Expert in software development and debugging',
      expertise: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
      temperature: 0.7,
      tags: ['coding', 'debugging'],
      avatar: '💻',
    },
    {
      id: 'researcher',
      name: 'Research Analyst',
      role: 'Researcher' as const,
      summary: 'Deep dive into topics with thorough analysis',
      expertise: ['Research', 'Analysis', 'Data Science'],
      temperature: 0.5,
      tags: ['research', 'analysis'],
      avatar: '🔬',
    },
    {
      id: 'creative',
      name: 'Creative Writer',
      role: 'Writer' as const,
      summary: 'Imaginative storytelling and content creation',
      expertise: ['Writing', 'Storytelling', 'Marketing'],
      temperature: 0.9,
      tags: ['creative', 'writing'],
      avatar: '✍️',
    },
  ]

  const activePersona = personas.find((p) => p.id === activePersonaId)

  return (
    <div className="space-y-4">
      {/* Persona Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {personas.map((persona) => {
          const isActive = persona.id === activePersonaId
          return (
            <motion.button
              key={persona.id}
              onClick={() => setActivePersonaId(persona.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true }}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-left',
                isActive
                  ? 'border-brand-500 bg-brand-500/10 shadow-lg'
                  : 'border-border/50 bg-card hover:border-brand-300'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{persona.avatar}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {persona.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {persona.role}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {persona.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {persona.expertise.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {isActive && (
                  <Check className="w-5 h-5 text-brand-500 shrink-0" />
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Active Persona Details */}
      {activePersona && (
        <motion.div
          key={activePersona.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.normal }}
          viewport={{ once: true }}
          className="p-6 rounded-xl border border-border/50 bg-card"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{activePersona.avatar}</div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {activePersona.name}
                </h3>
                <p className="text-sm text-muted-foreground">Active Persona</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted-foreground">Temperature</span>
              <span className="text-lg font-mono font-semibold">
                {activePersona.temperature}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Summary
              </h4>
              <p className="text-sm text-muted-foreground">
                {activePersona.summary}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Areas of Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {activePersona.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {activePersona.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '—'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Component
// ============================================================================

interface SectionProps {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

function Section({ id, title, children, className }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={cn('scroll-mt-24', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.moderate, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      {children}
    </motion.section>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function PersonaPanelPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Users className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                PersonaPanel
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A component for managing and switching between AI personas with
                different personalities, expertise areas, and response
                configurations. Enables users to customize AI behavior for
                specific use cases like coding assistance, research, creative
                writing, and more.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <Brain
                  className="w-5 h-5 text-brand-500 mb-2"
                  aria-hidden="true"
                />
                <p className="font-medium text-foreground text-sm">
                  Multiple Personas
                </p>
                <p className="text-xs text-muted-foreground">
                  Switch between specialized AI assistants
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <Settings
                  className="w-5 h-5 text-brand-500 mb-2"
                  aria-hidden="true"
                />
                <p className="font-medium text-foreground text-sm">
                  Custom Configuration
                </p>
                <p className="text-xs text-muted-foreground">
                  Temperature, expertise, and tone settings
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <Target
                  className="w-5 h-5 text-brand-500 mb-2"
                  aria-hidden="true"
                />
                <p className="font-medium text-foreground text-sm">
                  Role-Based
                </p>
                <p className="text-xs text-muted-foreground">
                  Built-in roles for common use cases
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <Accessibility
                  className="w-5 h-5 text-brand-500 mb-2"
                  aria-hidden="true"
                />
                <p className="font-medium text-foreground text-sm">
                  Accessible
                </p>
                <p className="text-xs text-muted-foreground">
                  Full keyboard navigation support
                </p>
              </div>
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The PersonaPanel component provides a sophisticated interface
                  for managing AI personas in your application. Each persona
                  represents a specialized configuration with unique
                  characteristics like tone, expertise areas, response
                  temperature, and system prompts.
                </p>
                <p>
                  This is particularly useful for applications that need to
                  serve different user workflows - from technical coding
                  assistance to creative writing support.
                </p>
              </div>

              {/* Basic Usage */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Basic Usage
                </h3>
                <CodeBlock
                  code={`import { PersonaPanel } from '@clarity-chat/react'

const personas = [
  {
    id: '1',
    name: 'Code Assistant',
    role: 'assistant',
    summary: 'Expert in software development and debugging',
    expertise: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    temperature: 0.7,
    tags: ['coding', 'debugging'],
  },
  {
    id: '2',
    name: 'Research Analyst',
    role: 'researcher',
    summary: 'Deep dive into topics with thorough analysis',
    expertise: ['Research', 'Analysis', 'Data'],
    temperature: 0.5,
    tags: ['research', 'analysis'],
  },
]

function App() {
  const [activePersonaId, setActivePersonaId] = useState('1')

  return (
    <PersonaPanel
      personas={personas}
      activePersonaId={activePersonaId}
      onSelect={(persona) => setActivePersonaId(persona.id)}
    />
  )
}`}
                  language="tsx"
                  showLineNumbers
                />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Interact with different AI personas. Click on a persona card to
                activate it and see how the interface responds.
              </p>
              <PersonaPanelDemo />
            </Section>

            {/* Props Section */}
            <Section id="props" title="Props">
              <PropsTable
                props={[
                  {
                    name: 'personas',
                    type: 'Persona[]',
                    required: true,
                    description:
                      'Array of persona configurations to display and manage',
                  },
                  {
                    name: 'activePersonaId',
                    type: 'string',
                    description:
                      'ID of the currently active persona for visual indication',
                  },
                  {
                    name: 'onSelect',
                    type: '(persona: Persona) => void',
                    description:
                      'Callback fired when a user selects a different persona',
                  },
                  {
                    name: 'onConfigure',
                    type: '(persona: Persona) => void',
                    description:
                      'Optional callback for opening persona configuration dialog',
                  },
                  {
                    name: 'showTemperature',
                    type: 'boolean',
                    default: 'true',
                    description:
                      'Whether to display temperature settings for each persona',
                  },
                  {
                    name: 'toneSubtitle',
                    type: 'string',
                    description:
                      'Custom subtitle text to display above the persona list',
                  },
                  {
                    name: 'className',
                    type: 'string',
                    description: 'Additional CSS classes for styling',
                  },
                ]}
              />
            </Section>

            {/* Type Definitions Section */}
            <Section id="types" title="Type Definitions">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Persona Type
                  </h3>
                  <CodeBlock
                    code={`interface Persona {
  /** Unique identifier for the persona */
  id: string

  /** Display name of the persona */
  name: string

  /** Persona role category */
  role: 'assistant' | 'researcher' | 'strategist' | 'critic' | 'coach' | 'custom'

  /** Brief description of the persona's purpose */
  summary: string

  /** Array of expertise areas or specializations */
  expertise: string[]

  /** AI temperature setting (0-1, lower = more focused) */
  temperature: number

  /** Optional tags for categorization */
  tags?: string[]

  /** Optional custom system prompt */
  systemPrompt?: string

  /** Optional custom instructions */
  instructions?: string
}`}
                    language="typescript"
                    showLineNumbers
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Persona Roles
                  </h3>
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/20">
                          <th className="px-4 py-3 text-left font-semibold text-foreground">
                            Role
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-foreground">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-foreground">
                            Use Case
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                            assistant
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            General purpose helper
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Coding, debugging, general tasks
                          </td>
                        </tr>
                        <tr className="border-b border-border/30 bg-muted/10">
                          <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                            researcher
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Deep analysis and research
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Research papers, data analysis
                          </td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                            strategist
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Strategic planning
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Business strategy, decision making
                          </td>
                        </tr>
                        <tr className="border-b border-border/30 bg-muted/10">
                          <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                            critic
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Critical analysis and review
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Code review, constructive feedback
                          </td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                            coach
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Teaching and mentoring
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Learning, skill development
                          </td>
                        </tr>
                        <tr className="bg-muted/10">
                          <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                            custom
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            User-defined persona
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            Specialized workflows
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              {/* Example 1: Multiple Personas */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Multiple Personas with Selection
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Allow users to switch between different specialized AI
                    assistants for different tasks.
                  </p>
                  <CodeBlock
                    code={`import { PersonaPanel } from '@clarity-chat/react'
import { useState } from 'react'

function MultiPersonaChat() {
  const [activePersonaId, setActivePersonaId] = useState('code-assistant')

  const personas = [
    {
      id: 'code-assistant',
      name: 'Code Assistant',
      role: 'assistant',
      summary: 'Expert in software development',
      expertise: ['JavaScript', 'TypeScript', 'React'],
      temperature: 0.7,
      tags: ['coding', 'debugging'],
    },
    {
      id: 'creative-writer',
      name: 'Creative Writer',
      role: 'custom',
      summary: 'Helps with creative writing',
      expertise: ['Writing', 'Storytelling'],
      temperature: 0.9,
      tags: ['creative', 'writing'],
    },
  ]

  const handlePersonaSelect = (persona: Persona) => {
    setActivePersonaId(persona.id)
    // Apply persona's system prompt to chat
    console.log(\`Switched to \${persona.name}\`)
  }

  return (
    <PersonaPanel
      personas={personas}
      activePersonaId={activePersonaId}
      onSelect={handlePersonaSelect}
    />
  )
}`}
                    language="tsx"
                    showLineNumbers
                  />
                </div>

                {/* Example 2: Custom Persona Creation */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Custom Persona Creation
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enable users to create and configure their own custom
                    personas.
                  </p>
                  <CodeBlock
                    code={`import { PersonaPanel } from '@clarity-chat/react'
import { useState } from 'react'

function CustomPersonaManager() {
  const [personas, setPersonas] = useState<Persona[]>([
    {
      id: '1',
      name: 'Technical Writer',
      role: 'assistant',
      summary: 'Documentation and technical writing expert',
      expertise: ['Documentation', 'Technical Writing', 'Markdown'],
      temperature: 0.6,
      tags: ['documentation', 'writing'],
      systemPrompt: 'You are a technical writing expert...',
    },
  ])

  const handleConfigure = (persona: Persona) => {
    // Open configuration dialog
    openPersonaConfigDialog(persona)
  }

  const createNewPersona = (config: PersonaConfig) => {
    const newPersona: Persona = {
      id: generateId(),
      name: config.name,
      role: 'custom',
      summary: config.summary,
      expertise: config.expertise,
      temperature: config.temperature,
      tags: config.tags,
      systemPrompt: config.systemPrompt,
    }

    setPersonas([...personas, newPersona])
  }

  return (
    <div>
      <PersonaPanel
        personas={personas}
        onSelect={handlePersonaSelect}
        onConfigure={handleConfigure}
      />
      <button onClick={() => createNewPersona(defaultConfig)}>
        Create New Persona
      </button>
    </div>
  )
}`}
                    language="tsx"
                    showLineNumbers
                  />
                </div>

                {/* Example 3: Integrated with Chat */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Integrated with Chat System
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect persona selection to your chat system to apply
                    different system prompts.
                  </p>
                  <CodeBlock
                    code={`import { PersonaPanel } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'
import { useState } from 'react'

function PersonaChat() {
  const [activePersona, setActivePersona] = useState<Persona>(personas[0])

  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    initialMessages: [],
    body: {
      systemPrompt: activePersona.systemPrompt,
      temperature: activePersona.temperature,
    },
  })

  const handlePersonaChange = (persona: Persona) => {
    setActivePersona(persona)
    // System prompt will be updated on next message
  }

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r">
        <PersonaPanel
          personas={personas}
          activePersonaId={activePersona.id}
          onSelect={handlePersonaChange}
        />
      </aside>

      <main className="flex-1">
        <ChatWindow
          messages={messages}
          onSend={(content) => append({ role: 'user', content })}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}`}
                    language="tsx"
                    showLineNumbers
                  />
                </div>
              </div>
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The PersonaPanel component follows WCAG 2.1 AA guidelines and
                  includes comprehensive accessibility features:
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Accessibility className="w-4 h-4 text-brand-500" />
                    Keyboard Navigation
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>
                      •{' '}
                      <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                        Tab
                      </kbd>{' '}
                      - Navigate between personas
                    </li>
                    <li>
                      •{' '}
                      <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                        Enter
                      </kbd>{' '}
                      /
                      <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                        Space
                      </kbd>{' '}
                      - Select persona
                    </li>
                    <li>
                      •{' '}
                      <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                        ↑
                      </kbd>{' '}
                      /
                      <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
                        ↓
                      </kbd>{' '}
                      - Navigate list items
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    Screen Reader Support
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• All personas have descriptive labels and roles</li>
                    <li>• Active persona state is announced</li>
                    <li>
                      • Temperature and expertise information is accessible
                    </li>
                    <li>• Configuration buttons have clear purpose labels</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    Visual Indicators
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Clear focus indicators for keyboard users</li>
                    <li>• High contrast active state</li>
                    <li>• Color-blind friendly status indicators</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Best Practices Section */}
            <Section id="best-practices" title="Best Practices">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-500/5">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Do
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                    <li>• Provide clear, descriptive names for each persona</li>
                    <li>
                      • Use appropriate temperature settings (0.7 for balanced,
                      0.3-0.5 for precise, 0.8-1.0 for creative)
                    </li>
                    <li>
                      • Include relevant expertise areas to help users choose
                    </li>
                    <li>
                      • Persist the active persona selection across sessions
                    </li>
                    <li>• Provide visual feedback when switching personas</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-500/5">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-red-500">✕</span>
                    Don't
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                    <li>• Don't create too many personas (3-5 is ideal)</li>
                    <li>
                      • Don't use vague or overlapping persona descriptions
                    </li>
                    <li>
                      • Don't forget to apply the persona's system prompt to the
                      chat
                    </li>
                    <li>
                      • Don't change personas mid-conversation without user
                      confirmation
                    </li>
                    <li>• Don't hide the active persona indicator</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Related Section */}
            <section id="related" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Related
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/reference/components/model-selector"
                  className="group p-4 rounded-lg border border-border/50 hover:border-brand-500/30 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      ModelSelector
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      component
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select AI models with visual indicators for speed, cost, and
                    quality
                  </p>
                </Link>

                <Link
                  href="/reference/hooks/use-clarity-chat"
                  className="group p-4 rounded-lg border border-border/50 hover:border-brand-500/30 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      useClarityChat
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      hook
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Core chat hook with support for system prompts and
                    configuration
                  </p>
                </Link>

                <Link
                  href="/reference/components/settings-panel"
                  className="group p-4 rounded-lg border border-border/50 hover:border-brand-500/30 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      SettingsPanel
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      component
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive settings panel for AI personality
                    configuration
                  </p>
                </Link>

                <Link
                  href="/reference/types/ai-personality"
                  className="group p-4 rounded-lg border border-border/50 hover:border-brand-500/30 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      AIPersonality
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                      type
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Type definitions for AI personality and behavior settings
                  </p>
                </Link>
              </div>
            </section>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <nav
              className="sticky top-24 space-y-1"
              aria-label="Table of contents"
            >
              <p className="font-semibold text-sm text-foreground mb-3">
                On this page
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#overview"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Live Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#props"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Props
                  </a>
                </li>
                <li>
                  <a
                    href="#types"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Type Definitions
                  </a>
                </li>
                <li>
                  <a
                    href="#examples"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Examples
                  </a>
                </li>
                <li>
                  <a
                    href="#accessibility"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Accessibility
                  </a>
                </li>
                <li>
                  <a
                    href="#best-practices"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Best Practices
                  </a>
                </li>
                <li>
                  <a
                    href="#related"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Related
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </div>
  )
}
