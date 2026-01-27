'use client'

/**
 * PollCreator Component - API Reference Documentation
 *
 * Interactive poll creation with multiple choice, rating scales, and real-time result visualization
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BarChart3,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Shield,
  Accessibility,
  TrendingUp,
  Vote,
  Lock,
  Settings,
  Play,
  Star,
  ThumbsUp,
  AlertTriangle,
  HelpCircle,
  Keyboard,
  Eye,
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
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
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
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [pollType, setPollType] = React.useState<'multiple' | 'rating' | 'ranking'>('multiple')
  const [pollQuestion, setPollQuestion] = React.useState('What is your favorite programming language?')
  const [options, setOptions] = React.useState(['JavaScript', 'TypeScript', 'Python', 'Rust'])
  const [votes, setVotes] = React.useState<Record<string, number>>({})
  const [hasVoted, setHasVoted] = React.useState(false)
  const [userVote, setUserVote] = React.useState<string | null>(null)
  const [showResults, setShowResults] = React.useState(false)

  const handleVote = (option: string) => {
    if (hasVoted) return
    setVotes((prev) => ({ ...prev, [option]: (prev[option] || 0) + 1 }))
    setUserVote(option)
    setHasVoted(true)
    setShowResults(true)
  }

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0)

  const resetPoll = () => {
    setVotes({})
    setHasVoted(false)
    setUserVote(null)
    setShowResults(false)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Poll Type:</label>
          <select
            value={pollType}
            onChange={(e) => setPollType(e.target.value as any)}
            className="px-3 py-1 rounded border border-border/50 bg-background text-sm"
          >
            <option value="multiple">Multiple Choice</option>
            <option value="rating">Rating Scale</option>
            <option value="ranking">Ranking</option>
          </select>
        </div>
        <button
          onClick={resetPoll}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Reset Votes
        </button>
        <label className="flex items-center gap-2 text-sm ml-auto">
          <input
            type="checkbox"
            checked={showResults}
            onChange={(e) => setShowResults(e.target.checked)}
            className="rounded"
          />
          Show Results
        </label>
      </div>

      {/* Demo Component */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-brand-500 shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {pollQuestion}
              </h3>
              <p className="text-sm text-muted-foreground">
                {pollType === 'multiple' && 'Select one option'}
                {pollType === 'rating' && 'Rate from 1 to 5'}
                {pollType === 'ranking' && 'Rank your preferences'}
              </p>
            </div>
            {hasVoted && (
              <span className="px-2 py-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                Voted
              </span>
            )}
          </div>

          {/* Poll Options */}
          <div className="space-y-3">
            {options.map((option, index) => {
              const voteCount = votes[option] || 0
              const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0

              return (
                <button
                  key={option}
                  onClick={() => handleVote(option)}
                  disabled={hasVoted}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                    hasVoted
                      ? userVote === option
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-border/50 bg-muted/20 cursor-not-allowed'
                      : 'border-border/50 hover:border-brand-500/50 hover:bg-muted/30 cursor-pointer'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {pollType === 'rating' && (
                        <Star className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-medium text-foreground">
                        {option}
                      </span>
                      {userVote === option && (
                        <Check className="w-4 h-4 text-brand-500" />
                      )}
                    </div>
                    {showResults && (
                      <span className="text-sm text-muted-foreground">
                        {voteCount} {voteCount === 1 ? 'vote' : 'votes'} ({percentage.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                  {showResults && totalVotes > 0 && (
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={cn(
                          'h-full rounded-full',
                          userVote === option
                            ? 'bg-brand-500'
                            : 'bg-muted-foreground/30'
                        )}
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Stats */}
          {showResults && totalVotes > 0 && (
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
              <span>Total votes: {totalVotes}</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Live results</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Poll Types Table
// ============================================================================

function PollTypesTable() {
  const types = [
    {
      type: 'Multiple Choice',
      value: 'multiple-choice',
      description: 'Single selection from list of options',
      useCase: 'Simple yes/no, A/B testing, preference selection',
    },
    {
      type: 'Rating Scale',
      value: 'rating',
      description: 'Numeric rating (1-5 stars, 1-10 scale)',
      useCase: 'Product reviews, satisfaction surveys, quality ratings',
    },
    {
      type: 'Ranking',
      value: 'ranking',
      description: 'Order options by preference',
      useCase: 'Priority voting, feature prioritization, preference order',
    },
    {
      type: 'Multiple Select',
      value: 'multiple-select',
      description: 'Select multiple options from list',
      useCase: 'Feature requests, interests selection, skill assessment',
    },
    {
      type: 'Yes/No',
      value: 'boolean',
      description: 'Binary choice (agree/disagree, yes/no)',
      useCase: 'Quick polls, agreement checks, binary decisions',
    },
  ]

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Poll Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Value
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Best Use Case
            </th>
          </tr>
        </thead>
        <tbody>
          {types.map((type, index) => (
            <tr
              key={type.value}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground">
                {type.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">
                {type.value}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {type.description}
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">
                {type.useCase}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'poll-types', title: 'Poll Types' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'poll-config-props', title: 'Poll Configuration' },
      { id: 'vote-handling-props', title: 'Vote Handling' },
      { id: 'display-props', title: 'Display Options' },
      { id: 'security-props', title: 'Security Options' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Poll' },
      { id: 'example-rating', title: 'Rating Scale' },
      { id: 'example-ranking', title: 'Ranking Poll' },
    ],
  },
  { id: 'result-visualization', title: 'Result Visualization' },
  { id: 'security', title: 'Security' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'pollId',
    type: 'string',
    required: true,
    description: 'Unique identifier for the poll.',
  },
  {
    name: 'question',
    type: 'string',
    required: true,
    description: 'The poll question text.',
  },
  {
    name: 'options',
    type: 'PollOption[]',
    required: true,
    description: 'Array of poll options to display.',
  },
  {
    name: 'pollType',
    type: "'multiple-choice' | 'rating' | 'ranking' | 'multiple-select' | 'boolean'",
    default: "'multiple-choice'",
    description: 'Type of poll to display.',
  },
  {
    name: 'onVote',
    type: '(pollId: string, optionId: string | string[]) => void',
    required: true,
    description: 'Callback when user submits a vote.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the poll container.',
  },
]

const pollConfigProps: PropDefinition[] = [
  {
    name: 'allowMultiple',
    type: 'boolean',
    default: 'false',
    description: 'Allow multiple option selection (for multiple-select type).',
  },
  {
    name: 'minRating',
    type: 'number',
    default: '1',
    description: 'Minimum rating value (for rating type).',
  },
  {
    name: 'maxRating',
    type: 'number',
    default: '5',
    description: 'Maximum rating value (for rating type).',
  },
  {
    name: 'showDescription',
    type: 'boolean',
    default: 'true',
    description: 'Show poll description/subtitle.',
  },
  {
    name: 'allowAnonymous',
    type: 'boolean',
    default: 'false',
    description: 'Allow anonymous voting without authentication.',
  },
  {
    name: 'closeDate',
    type: 'Date',
    description: 'Date when poll closes for voting.',
  },
]

const voteHandlingProps: PropDefinition[] = [
  {
    name: 'hasVoted',
    type: 'boolean',
    default: 'false',
    description: 'Whether the current user has already voted.',
  },
  {
    name: 'userVote',
    type: 'string | string[]',
    description: 'The current user\'s vote selection.',
  },
  {
    name: 'onVoteChange',
    type: '(optionId: string | string[]) => void',
    description: 'Callback when user changes their vote (before submission).',
  },
  {
    name: 'validateVote',
    type: '(optionId: string | string[]) => boolean | string',
    description: 'Custom validation function. Return true or error message.',
  },
  {
    name: 'onError',
    type: '(error: string) => void',
    description: 'Callback when vote validation or submission fails.',
  },
]

const displayProps: PropDefinition[] = [
  {
    name: 'showResults',
    type: 'boolean',
    default: 'false',
    description: 'Show poll results to users.',
  },
  {
    name: 'showResultsAfterVote',
    type: 'boolean',
    default: 'true',
    description: 'Automatically show results after voting.',
  },
  {
    name: 'showVoteCount',
    type: 'boolean',
    default: 'true',
    description: 'Display vote counts for each option.',
  },
  {
    name: 'showPercentages',
    type: 'boolean',
    default: 'true',
    description: 'Display vote percentages for each option.',
  },
  {
    name: 'showChart',
    type: 'boolean',
    default: 'true',
    description: 'Display visual chart/bars for results.',
  },
  {
    name: 'chartType',
    type: "'bar' | 'pie' | 'donut'",
    default: "'bar'",
    description: 'Type of chart to display for results.',
  },
  {
    name: 'showTotalVotes',
    type: 'boolean',
    default: 'true',
    description: 'Display total vote count.',
  },
  {
    name: 'animateResults',
    type: 'boolean',
    default: 'true',
    description: 'Animate result bars/charts.',
  },
]

const securityProps: PropDefinition[] = [
  {
    name: 'requireAuth',
    type: 'boolean',
    default: 'false',
    description: 'Require user authentication to vote.',
  },
  {
    name: 'preventDuplicates',
    type: 'boolean',
    default: 'true',
    description: 'Prevent duplicate votes from same user.',
  },
  {
    name: 'ipTracking',
    type: 'boolean',
    default: 'false',
    description: 'Track IP addresses to prevent duplicate votes.',
  },
  {
    name: 'captchaEnabled',
    type: 'boolean',
    default: 'false',
    description: 'Require CAPTCHA verification before voting.',
  },
  {
    name: 'votingPrivacy',
    type: "'public' | 'private' | 'anonymous'",
    default: "'public'",
    description: 'Privacy level for votes and voters.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { PollCreator } from '@clarity-chat/react'
import type { PollCreatorProps, PollOption } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { PollCreator } from '@clarity-chat/react'
import { useState } from 'react'

function BasicPoll() {
  const [hasVoted, setHasVoted] = useState(false)

  const options = [
    { id: '1', label: 'JavaScript', value: 'javascript' },
    { id: '2', label: 'TypeScript', value: 'typescript' },
    { id: '3', label: 'Python', value: 'python' },
    { id: '4', label: 'Rust', value: 'rust' },
  ]

  const handleVote = (pollId: string, optionId: string) => {
    console.log('Vote submitted:', { pollId, optionId })
    setHasVoted(true)
    // Send to backend API
  }

  return (
    <PollCreator
      pollId="fav-lang-2024"
      question="What is your favorite programming language?"
      options={options}
      pollType="multiple-choice"
      onVote={handleVote}
      hasVoted={hasVoted}
      showResults={hasVoted}
    />
  )
}`

const ratingScaleCode = `import { PollCreator } from '@clarity-chat/react'
import { useState } from 'react'

function RatingPoll() {
  const [userRating, setUserRating] = useState<string | null>(null)

  const ratingOptions = [
    { id: '1', label: '1 Star', value: '1' },
    { id: '2', label: '2 Stars', value: '2' },
    { id: '3', label: '3 Stars', value: '3' },
    { id: '4', label: '4 Stars', value: '4' },
    { id: '5', label: '5 Stars', value: '5' },
  ]

  const handleVote = (pollId: string, optionId: string) => {
    setUserRating(optionId)
    // Submit rating to backend
    fetch('/api/ratings', {
      method: 'POST',
      body: JSON.stringify({ pollId, rating: optionId }),
    })
  }

  return (
    <PollCreator
      pollId="product-rating"
      question="How would you rate our product?"
      options={ratingOptions}
      pollType="rating"
      minRating={1}
      maxRating={5}
      onVote={handleVote}
      userVote={userRating}
      hasVoted={userRating !== null}
      showResults={true}
      showResultsAfterVote={true}
      showPercentages={true}
      animateResults={true}
    />
  )
}`

const rankingPollCode = `import { PollCreator } from '@clarity-chat/react'
import { useState } from 'react'

function RankingPoll() {
  const [rankings, setRankings] = useState<string[]>([])

  const featureOptions = [
    { id: 'dark-mode', label: 'Dark Mode', value: 'dark-mode' },
    { id: 'export', label: 'Data Export', value: 'export' },
    { id: 'analytics', label: 'Advanced Analytics', value: 'analytics' },
    { id: 'api', label: 'Public API', value: 'api' },
  ]

  const handleVote = (pollId: string, rankedIds: string[]) => {
    setRankings(rankedIds)
    // Submit rankings to backend
    fetch('/api/feature-rankings', {
      method: 'POST',
      body: JSON.stringify({ pollId, rankings: rankedIds }),
    })
  }

  const validateRankings = (rankedIds: string | string[]) => {
    if (!Array.isArray(rankedIds) || rankedIds.length < 3) {
      return 'Please rank at least 3 features'
    }
    return true
  }

  return (
    <PollCreator
      pollId="feature-priorities"
      question="Rank these features by priority"
      options={featureOptions}
      pollType="ranking"
      onVote={handleVote}
      userVote={rankings}
      hasVoted={rankings.length > 0}
      validateVote={validateRankings}
      showResults={false}
      showDescription={true}
    />
  )
}`

const typescriptCode = `// Main component props
interface PollCreatorProps {
  /** Unique identifier for the poll */
  pollId: string
  /** The poll question text */
  question: string
  /** Array of poll options */
  options: PollOption[]
  /** Type of poll */
  pollType?: 'multiple-choice' | 'rating' | 'ranking' | 'multiple-select' | 'boolean'
  /** Vote submission callback */
  onVote: (pollId: string, optionId: string | string[]) => void
  /** Whether user has voted */
  hasVoted?: boolean
  /** User's current vote */
  userVote?: string | string[]
  /** Show poll results */
  showResults?: boolean
  /** Additional CSS class */
  className?: string

  // Poll Configuration
  allowMultiple?: boolean
  minRating?: number
  maxRating?: number
  showDescription?: boolean
  allowAnonymous?: boolean
  closeDate?: Date

  // Vote Handling
  onVoteChange?: (optionId: string | string[]) => void
  validateVote?: (optionId: string | string[]) => boolean | string
  onError?: (error: string) => void

  // Display Options
  showResultsAfterVote?: boolean
  showVoteCount?: boolean
  showPercentages?: boolean
  showChart?: boolean
  chartType?: 'bar' | 'pie' | 'donut'
  showTotalVotes?: boolean
  animateResults?: boolean

  // Security Options
  requireAuth?: boolean
  preventDuplicates?: boolean
  ipTracking?: boolean
  captchaEnabled?: boolean
  votingPrivacy?: 'public' | 'private' | 'anonymous'
}

// Poll option interface
interface PollOption {
  id: string
  label: string
  value: string
  description?: string
  icon?: React.ReactNode
}

// Vote result interface
interface PollResult {
  optionId: string
  voteCount: number
  percentage: number
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function PollCreatorPage() {
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
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <BarChart3 className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      Beta
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                PollCreator
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Interactive poll creation component with multiple choice, rating scales,
                and real-time result visualization. Build engaging polls with custom styling,
                vote validation, and comprehensive security features.
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
              {[
                {
                  icon: Vote,
                  label: 'Multiple Types',
                  desc: 'Choice, rating, ranking',
                },
                {
                  icon: TrendingUp,
                  label: 'Real-time Results',
                  desc: 'Live vote counting',
                },
                {
                  icon: Zap,
                  label: 'Custom Styling',
                  desc: 'Themeable appearance',
                },
                {
                  icon: Shield,
                  label: 'Vote Validation',
                  desc: 'Prevent duplicates',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>PollCreator</code> is a versatile component for creating
                  interactive polls in your chat interface. It supports multiple poll
                  types, real-time result visualization, and comprehensive security features.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Multiple Poll Types:</strong> Multiple choice, rating scales,
                    ranking, multi-select, and yes/no polls
                  </li>
                  <li>
                    <strong>Real-time Results:</strong> Live vote counting with animated
                    charts and progress bars
                  </li>
                  <li>
                    <strong>Flexible Display:</strong> Show/hide results, vote counts,
                    percentages, and charts
                  </li>
                  <li>
                    <strong>Vote Validation:</strong> Custom validation, duplicate
                    prevention, and CAPTCHA support
                  </li>
                  <li>
                    <strong>Privacy Controls:</strong> Public, private, or anonymous voting
                    with IP tracking options
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use PollCreator
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>User Feedback:</strong> Collect opinions, ratings, and
                    preferences from users
                  </li>
                  <li>
                    <strong>Feature Prioritization:</strong> Let users vote on which
                    features to build next
                  </li>
                  <li>
                    <strong>Surveys:</strong> Embedded surveys within chat conversations
                  </li>
                  <li>
                    <strong>A/B Testing:</strong> Quick user preference testing
                  </li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/react"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">
                  Import the component and required types:
                </p>

                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="App.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Try the PollCreator component. Switch poll types and cast your vote
                to see real-time results.
              </p>

              <LiveDemo />
            </Section>

            {/* Poll Types Section */}
            <Section id="poll-types" title="Poll Types">
              <p className="text-muted-foreground mb-6">
                PollCreator supports 5 different poll types, each optimized for
                specific use cases:
              </p>

              <PollTypesTable />
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                PollCreator provides a comprehensive API with over 18 props for
                customizing poll behavior, appearance, and security.
              </p>

              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="poll-config-props" title="Poll Configuration">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure poll behavior and options:
                </p>
                <PropsTable props={pollConfigProps} />
              </SubSection>

              <SubSection id="vote-handling-props" title="Vote Handling">
                <p className="text-sm text-muted-foreground mb-4">
                  Handle vote submission, validation, and errors:
                </p>
                <PropsTable props={voteHandlingProps} />
              </SubSection>

              <SubSection id="display-props" title="Display Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Control how results and votes are displayed:
                </p>
                <PropsTable props={displayProps} />
              </SubSection>

              <SubSection id="security-props" title="Security Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure security and privacy settings:
                </p>
                <PropsTable props={securityProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Multiple Choice Poll">
                <p className="text-muted-foreground mb-4">
                  Simple poll with multiple choice options:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicPoll.tsx"
                />
              </SubSection>

              <SubSection id="example-rating" title="Rating Scale Poll">
                <p className="text-muted-foreground mb-4">
                  Product rating with 1-5 star scale:
                </p>
                <CodeBlock
                  code={ratingScaleCode}
                  language="tsx"
                  filename="RatingPoll.tsx"
                />
              </SubSection>

              <SubSection id="example-ranking" title="Ranking Poll">
                <p className="text-muted-foreground mb-4">
                  Feature prioritization with drag-to-rank interface:
                </p>
                <CodeBlock
                  code={rankingPollCode}
                  language="tsx"
                  filename="RankingPoll.tsx"
                />
              </SubSection>
            </Section>

            {/* Result Visualization Section */}
            <Section id="result-visualization" title="Result Visualization">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  PollCreator includes built-in result visualization with multiple
                  chart types and display options.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Chart Types</h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Bar Charts:</strong> Horizontal bars showing vote distribution
                    (default)
                  </li>
                  <li>
                    <strong>Pie Charts:</strong> Circular chart for proportional display
                  </li>
                  <li>
                    <strong>Donut Charts:</strong> Pie chart with center cutout
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Display Options</h4>
                <ul className="space-y-2">
                  <li>Vote counts: Show absolute number of votes</li>
                  <li>Percentages: Show relative vote distribution</li>
                  <li>Total votes: Display overall participation</li>
                  <li>Animations: Smooth transitions for result updates</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Integration with PollResults
                </h4>
                <p>
                  Use the <code>PollResults</code> component for advanced result
                  visualization with filtering, sorting, and export capabilities.
                </p>
              </div>
            </Section>

            {/* Security Section */}
            <Section id="security" title="Security">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  PollCreator includes comprehensive security features to prevent
                  abuse and ensure vote integrity.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                  Vote Validation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Duplicate Prevention:</strong> Prevent users from voting
                    multiple times
                  </li>
                  <li>
                    <strong>IP Tracking:</strong> Track IP addresses to detect duplicate
                    votes
                  </li>
                  <li>
                    <strong>Custom Validation:</strong> Implement custom vote validation
                    logic
                  </li>
                  <li>
                    <strong>CAPTCHA:</strong> Require CAPTCHA verification for voting
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                  Privacy Controls
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Public:</strong> Votes and voters visible to all
                  </li>
                  <li>
                    <strong>Private:</strong> Vote counts visible, voters anonymous
                  </li>
                  <li>
                    <strong>Anonymous:</strong> No voter information collected
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Best Practices
                </h4>
                <ul className="space-y-2">
                  <li>Always validate votes on the backend</li>
                  <li>Use HTTPS for poll submissions</li>
                  <li>Implement rate limiting to prevent spam</li>
                  <li>Store votes securely with encryption</li>
                  <li>Comply with data privacy regulations (GDPR, CCPA)</li>
                </ul>
              </div>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for all props and interfaces:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>PollCreator includes comprehensive accessibility features:</p>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
                    - Navigate between poll options
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Space
                    </kbd>{' '}
                    - Select option
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Submit vote
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Arrow Keys
                    </kbd>{' '}
                    - Navigate options (for rating type)
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Screen Reader Support</h4>
                <ul className="space-y-2">
                  <li>
                    ARIA labels for all interactive elements
                  </li>
                  <li>
                    Live regions announce vote submission and results
                  </li>
                  <li>
                    Semantic HTML with proper role attributes
                  </li>
                  <li>
                    Clear focus indicators for keyboard navigation
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Color Contrast</h4>
                <p>
                  All poll elements meet WCAG 2.1 AA standards with minimum 4.5:1
                  contrast ratio for text and 3:1 for UI components.
                </p>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Votes not submitting
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Vote button clicks not triggering onVote callback.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>onVote</code> is a valid function
                        </li>
                        <li>
                          Check that <code>pollId</code> is unique
                        </li>
                        <li>
                          Verify options have unique <code>id</code> values
                        </li>
                        <li>
                          Check browser console for validation errors
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Results not displaying
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Vote results not showing after submission.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Set <code>showResults={'{'}true{'}'}</code> or{' '}
                          <code>showResultsAfterVote={'{'}true{'}'}</code>
                        </li>
                        <li>
                          Ensure <code>hasVoted</code> is set to true after voting
                        </li>
                        <li>
                          Check that vote data is being stored correctly
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Duplicate votes
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Users able to vote multiple times.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Enable <code>preventDuplicates={'{'}true{'}'}</code>
                        </li>
                        <li>
                          Implement backend validation
                        </li>
                        <li>
                          Use <code>requireAuth</code> with user authentication
                        </li>
                        <li>
                          Consider <code>ipTracking</code> for anonymous polls
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'PollResults',
                    type: 'component',
                    description: 'Advanced poll result visualization and analytics',
                    href: '/reference/components/poll-results',
                  },
                  {
                    name: 'VoteButton',
                    type: 'component',
                    description: 'Standalone vote button for quick polls',
                    href: '/reference/components/vote-button',
                  },
                  {
                    name: 'usePoll',
                    type: 'hook',
                    description: 'Hook for poll state management',
                    href: '/reference/hooks/use-poll',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'Embed polls in chat conversations',
                    href: '/reference/components/chat-window',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components/persona-panel"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      PersonaPanel
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/prompt-library"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      PromptLibrary
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
