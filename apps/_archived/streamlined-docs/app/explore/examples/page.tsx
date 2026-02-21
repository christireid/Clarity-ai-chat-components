'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import {
  Search,
  Code2,
  Play,
  MessageSquare,
  Zap,
  Brain,
  Palette,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Filter,
  Star,
  Clock,
  Tag,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

interface Example {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  tags: string[]
  category: string
  featured?: boolean
  preview: React.ReactNode
  gradient: string
  codeUrl: string
  playgroundUrl: string
  estimatedTime: string
}

// Difficulty badge colors
const difficultyColors: Record<DifficultyLevel, { bg: string; text: string; border: string }> = {
  Beginner: {
    bg: 'bg-green-50 dark:bg-green-950/50',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800/50',
  },
  Intermediate: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
  },
  Advanced: {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800/50',
  },
}

// Preview components for each example
function BasicChatPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 max-w-xs w-full mx-auto">
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex-shrink-0" />
          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2 text-sm text-neutral-700 dark:text-neutral-300">
            Hello! How can I help?
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div className="bg-brand-500 text-white rounded-lg p-2 text-sm">
            Hi there!
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

function StreamingChatPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 max-w-xs w-full mx-auto">
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex-shrink-0" />
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-2 text-sm text-neutral-700 dark:text-neutral-300">
          <span>Typing response</span>
          <motion.span
            className="inline-flex ml-1"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mx-0.5" />
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mx-0.5" />
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full mx-0.5" />
          </motion.span>
        </div>
      </div>
    </div>
  )
}

function ToolsChatPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 max-w-xs w-full mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
            Calling: get_weather()
          </span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800/50">
          <span className="text-xs text-green-700 dark:text-green-300">
            Result: 72°F, Sunny
          </span>
        </div>
      </div>
    </div>
  )
}

function MemoryChatPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 max-w-xs w-full mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Clock className="w-3 h-3" />
          <span>Session: 5 messages</span>
        </div>
        <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Remembers context
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              User preferences saved
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThemedChatPreview() {
  return (
    <div className="flex gap-2 max-w-xs mx-auto">
      <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 p-2">
        <div className="w-full h-2 bg-white/30 rounded mb-1" />
        <div className="w-3/4 h-2 bg-white/30 rounded" />
      </div>
      <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 p-2">
        <div className="w-full h-2 bg-white/30 rounded mb-1" />
        <div className="w-3/4 h-2 bg-white/30 rounded" />
      </div>
      <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-2">
        <div className="w-full h-2 bg-white/30 rounded mb-1" />
        <div className="w-3/4 h-2 bg-white/30 rounded" />
      </div>
    </div>
  )
}

function EnterpriseChatPreview() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 max-w-xs w-full mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-semibold">Enterprise</span>
        </div>
        <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
          Active
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          SSO Enabled
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Audit Logging
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Rate Limiting
        </div>
      </div>
    </div>
  )
}

// Example data
const examples: Example[] = [
  {
    id: 'basic-chat',
    title: 'Basic Chat',
    description: 'Minimal setup to get started with Clarity Chat. Perfect for learning the fundamentals of chat interfaces.',
    difficulty: 'Beginner',
    tags: ['chat', 'quickstart', 'minimal'],
    category: 'Getting Started',
    featured: true,
    preview: <BasicChatPreview />,
    gradient: 'from-brand-400 to-blue-500',
    codeUrl: '/api/components/chat',
    playgroundUrl: '/playground?template=basic-chat',
    estimatedTime: '5 min',
  },
  {
    id: 'streaming-chat',
    title: 'Streaming Chat',
    description: 'Real-time streaming responses with typing indicators. Build responsive chat experiences with instant feedback.',
    difficulty: 'Beginner',
    tags: ['streaming', 'real-time', 'typing-indicator'],
    category: 'Core Features',
    featured: true,
    preview: <StreamingChatPreview />,
    gradient: 'from-cyan-400 to-blue-500',
    codeUrl: '/api/hooks/use-streaming',
    playgroundUrl: '/playground?template=streaming-chat',
    estimatedTime: '10 min',
  },
  {
    id: 'chat-with-tools',
    title: 'Chat with Tools',
    description: 'Integrate function calling and tool usage. Enable your AI to interact with external services and APIs.',
    difficulty: 'Intermediate',
    tags: ['tools', 'function-calling', 'api', 'actions'],
    category: 'Advanced',
    featured: true,
    preview: <ToolsChatPreview />,
    gradient: 'from-amber-400 to-orange-500',
    codeUrl: '/api/hooks/use-tools',
    playgroundUrl: '/playground?template=tools-chat',
    estimatedTime: '20 min',
  },
  {
    id: 'chat-with-memory',
    title: 'Chat with Memory',
    description: 'Conversation persistence and context management. Build stateful conversations that remember user preferences.',
    difficulty: 'Intermediate',
    tags: ['memory', 'persistence', 'context', 'state'],
    category: 'Advanced',
    preview: <MemoryChatPreview />,
    gradient: 'from-purple-400 to-violet-500',
    codeUrl: '/api/hooks/use-memory',
    playgroundUrl: '/playground?template=memory-chat',
    estimatedTime: '25 min',
  },
  {
    id: 'themed-chat',
    title: 'Themed Chat',
    description: 'Custom styling and theming options. Create beautiful, branded chat experiences with full design control.',
    difficulty: 'Beginner',
    tags: ['themes', 'styling', 'customization', 'design'],
    category: 'Customization',
    preview: <ThemedChatPreview />,
    gradient: 'from-pink-400 to-rose-500',
    codeUrl: '/guides/theming',
    playgroundUrl: '/playground?template=themed-chat',
    estimatedTime: '15 min',
  },
  {
    id: 'enterprise-chat',
    title: 'Enterprise Chat',
    description: 'Full-featured setup with SSO, audit logging, and rate limiting. Robust for enterprise deployments.',
    difficulty: 'Advanced',
    tags: ['enterprise', 'sso', 'security', 'audit', 'rate-limiting'],
    category: 'Enterprise',
    preview: <EnterpriseChatPreview />,
    gradient: 'from-slate-500 to-slate-700',
    codeUrl: '/guides/enterprise-setup',
    playgroundUrl: '/playground?template=enterprise-chat',
    estimatedTime: '45 min',
  },
]

// Categories for filtering
const categories = ['All', 'Getting Started', 'Core Features', 'Advanced', 'Customization', 'Enterprise']

// All unique tags
const allTags = Array.from(new Set(examples.flatMap((e) => e.tags)))

export default function ExamplesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All')

  // Filter examples
  const filteredExamples = useMemo(() => {
    return examples.filter((example) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        example.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === 'All' || example.category === selectedCategory

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some((tag) => example.tags.includes(tag))

      // Difficulty filter
      const matchesDifficulty =
        selectedDifficulty === 'All' || example.difficulty === selectedDifficulty

      return matchesSearch && matchesCategory && matchesTags && matchesDifficulty
    })
  }, [searchQuery, selectedCategory, selectedTags, selectedDifficulty])

  // Featured examples
  const featuredExamples = examples.filter((e) => e.featured)

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedTags([])
    setSelectedDifficulty('All')
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedTags.length > 0 ||
    selectedDifficulty !== 'All'

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 border-b border-neutral-200/60 dark:border-neutral-800/60">
        {/* Background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-brand-500/5 to-pink-500/5"
          aria-hidden="true"
        />

        {/* Animated background pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        <div className="container-docs relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal direction="down" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
                <Code2 className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Robust Examples
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Code{' '}
                <KineticText
                  gradient={true}
                  className="inline-block bg-gradient-to-r from-purple-500 via-brand-500 to-pink-500 bg-clip-text text-transparent"
                >
                  Examples
                </KineticText>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
                Explore our collection of chat examples with live previews. Copy, customize, and
                build complete chat experiences in minutes.
              </p>
            </ScrollReveal>

            {/* Search Bar */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search examples by name, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-lg shadow-neutral-200/50 dark:shadow-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-neutral-400" />
                    </button>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Featured Examples Section */}
      <section className="container-docs py-12 sm:py-16">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 text-amber-500">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Featured Examples</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Most popular examples to get you started
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger staggerDelay={0.08}>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredExamples.map((example) => (
              <ScrollRevealStaggerItem key={example.id}>
                <ExampleCard example={example} featured />
              </ScrollRevealStaggerItem>
            ))}
          </div>
        </ScrollRevealStagger>
      </section>

      {/* Filter Section */}
      <section className="container-docs pb-8">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-neutral-500" />
                <span className="font-semibold">Filter Examples</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-500 hover:text-brand-600 font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Category filters */}
            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      selectedCategory === category
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filters */}
            <div className="mb-6">
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3 block">
                Difficulty
              </label>
              <div className="flex flex-wrap gap-2">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                      selectedDifficulty === level
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag filters */}
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                      selectedTags.includes(tag)
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-brand-300 dark:hover:border-brand-700'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* All Examples Grid */}
      <section className="container-docs py-8 sm:py-12">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {hasActiveFilters ? 'Filtered Results' : 'All Examples'}
            </h2>
            <span className="text-sm text-neutral-500">
              {filteredExamples.length} example{filteredExamples.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          {filteredExamples.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollRevealStagger staggerDelay={0.06}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExamples.map((example) => (
                    <ScrollRevealStaggerItem key={example.id}>
                      <ExampleCard example={example} />
                    </ScrollRevealStaggerItem>
                  ))}
                </div>
              </ScrollRevealStagger>
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Search className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No examples found</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA Section */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="container-docs pb-16 sm:pb-24">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50 p-8 sm:p-12">
            {/* Background decoration */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.2) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Ready to Build?</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                Jump into the playground and start experimenting with these examples.
                No setup required - just code and see results instantly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/playground"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <Play className="w-4 h-4" />
                  Open Playground
                </Link>
                <Link
                  href="/get-started"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  Get Started Guide
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}

// Example Card Component
interface ExampleCardProps {
  example: Example
  featured?: boolean
}

function ExampleCard({ example, featured = false }: ExampleCardProps) {
  const difficultyStyle = difficultyColors[example.difficulty]

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:shadow-xl',
        featured && 'ring-2 ring-amber-200/50 dark:ring-amber-800/30'
      )}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-20">
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
            <Star className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Preview */}
      <div
        className={cn(
          'relative h-48 bg-gradient-to-br p-6 flex items-center justify-center overflow-hidden',
          example.gradient
        )}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />

        {/* Preview content */}
        <div className="relative z-10 w-full">{example.preview}</div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            href={example.codeUrl}
            className="px-4 py-2 bg-white text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            View Code
          </Link>
          <Link
            href={example.playgroundUrl}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Playground
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="p-6">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {/* Difficulty badge */}
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded border',
              difficultyStyle.bg,
              difficultyStyle.text,
              difficultyStyle.border
            )}
          >
            {example.difficulty}
          </span>

          {/* Time estimate */}
          <span className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded">
            <Clock className="w-3 h-3" />
            {example.estimatedTime}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-500 transition-colors">
          {example.title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {example.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {example.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {example.tags.length > 4 && (
            <span className="px-2 py-0.5 text-neutral-400 text-xs">
              +{example.tags.length - 4} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href={example.codeUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors group/link"
          >
            View Code
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={example.playgroundUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Playground
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
