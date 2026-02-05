/**
 * PromptSuggestions Interactive Demonstration
 *
 * Features:
 * - Context-aware prompt suggestions
 * - Category-based prompts
 * - Interactive prompt insertion
 * - Glassmorphism styled suggestion cards
 * - Smooth animations
 */

import React, { useState, useCallback } from 'react'
import {
  PromptSuggestions,
  type PromptSuggestion,
  ChatInput,
} from '@clarity-chat/react'
import {
  Card,
  CardContent,
  Badge,
  Button,
} from '@clarity-chat/primitives'
import type { Message } from '@clarity-chat/types'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  CodeIcon,
  FileTextIcon,
  MessageSquareIcon,
  BrainCircuitIcon,
  TrendingUpIcon,
  SearchIcon,
  SettingsIcon,
  HelpCircleIcon,
  ZapIcon,
  BookOpenIcon,
  LightbulbIcon,
  RocketIcon,
  TargetIcon,
  WandIcon,
} from 'lucide-react'

// Category-based prompt suggestions
const starterPromptsByCategory: Record<string, PromptSuggestion[]> = {
  'Getting Started': [
    {
      id: 'start-1',
      text: "What's the best way to get started with this library?",
      label: 'Quick Start Guide',
      description: 'Learn the basics and get up and running quickly',
      type: 'starter',
      icon: <RocketIcon className="w-4 h-4" />,
      category: 'Getting Started',
      usageCount: 245,
    },
    {
      id: 'start-2',
      text: 'Show me a simple example',
      label: 'Basic Example',
      description: 'See a minimal working implementation',
      type: 'starter',
      icon: <SparklesIcon className="w-4 h-4" />,
      category: 'Getting Started',
      usageCount: 189,
    },
    {
      id: 'start-3',
      text: 'What are the key features?',
      label: 'Feature Overview',
      description: 'Explore available capabilities',
      type: 'starter',
      icon: <TargetIcon className="w-4 h-4" />,
      category: 'Getting Started',
      usageCount: 167,
    },
  ],
  'Development': [
    {
      id: 'dev-1',
      text: 'Write a function to handle user authentication',
      label: 'Auth Implementation',
      description: 'Create secure authentication logic',
      type: 'starter',
      icon: <CodeIcon className="w-4 h-4" />,
      category: 'Development',
      usageCount: 312,
    },
    {
      id: 'dev-2',
      text: 'Optimize this code for better performance',
      label: 'Code Optimization',
      description: 'Improve efficiency and speed',
      type: 'starter',
      icon: <ZapIcon className="w-4 h-4" />,
      category: 'Development',
      usageCount: 278,
    },
    {
      id: 'dev-3',
      text: 'Debug this error and suggest a fix',
      label: 'Error Resolution',
      description: 'Identify and solve issues',
      type: 'starter',
      icon: <SettingsIcon className="w-4 h-4" />,
      category: 'Development',
      usageCount: 203,
    },
  ],
  'Learning': [
    {
      id: 'learn-1',
      text: 'Explain this concept in simple terms',
      label: 'Concept Explanation',
      description: 'Break down complex ideas',
      type: 'starter',
      icon: <BookOpenIcon className="w-4 h-4" />,
      category: 'Learning',
      usageCount: 156,
    },
    {
      id: 'learn-2',
      text: 'What are the best practices for this?',
      label: 'Best Practices',
      description: 'Learn recommended approaches',
      type: 'starter',
      icon: <LightbulbIcon className="w-4 h-4" />,
      category: 'Learning',
      usageCount: 134,
    },
    {
      id: 'learn-3',
      text: 'Compare different approaches',
      label: 'Comparison Analysis',
      description: 'Evaluate options side by side',
      type: 'starter',
      icon: <TrendingUpIcon className="w-4 h-4" />,
      category: 'Learning',
      usageCount: 98,
    },
  ],
  'Analysis': [
    {
      id: 'analysis-1',
      text: 'Summarize this document',
      label: 'Document Summary',
      description: 'Extract key points and insights',
      type: 'starter',
      icon: <FileTextIcon className="w-4 h-4" />,
      category: 'Analysis',
      usageCount: 201,
    },
    {
      id: 'analysis-2',
      text: 'Analyze the sentiment of this text',
      label: 'Sentiment Analysis',
      description: 'Detect emotional tone and context',
      type: 'starter',
      icon: <BrainCircuitIcon className="w-4 h-4" />,
      category: 'Analysis',
      usageCount: 145,
    },
    {
      id: 'analysis-3',
      text: 'Find patterns in this data',
      label: 'Pattern Recognition',
      description: 'Identify trends and correlations',
      type: 'starter',
      icon: <SearchIcon className="w-4 h-4" />,
      category: 'Analysis',
      usageCount: 112,
    },
  ],
}

// Context-aware follow-up suggestions
const generateFollowUpPrompts = (
  messages: Message[],
  context: string
): PromptSuggestion[] => {
  const lastMessage = messages[messages.length - 1]
  const content = lastMessage?.content.toLowerCase() || ''

  const prompts: PromptSuggestion[] = []

  // Code-related context
  if (content.includes('code') || content.includes('function') || context.includes('code')) {
    prompts.push(
      {
        id: 'follow-code-1',
        text: 'Can you explain this code line by line?',
        label: 'Detailed Explanation',
        type: 'follow-up',
        confidence: 0.92,
        icon: <CodeIcon className="w-4 h-4" />,
        keywords: ['code', 'explain', 'detail'],
      },
      {
        id: 'follow-code-2',
        text: 'Show me how to test this',
        label: 'Add Tests',
        type: 'follow-up',
        confidence: 0.85,
        icon: <ZapIcon className="w-4 h-4" />,
        keywords: ['test', 'testing'],
      },
      {
        id: 'follow-code-3',
        text: 'What are potential edge cases?',
        label: 'Edge Cases',
        type: 'follow-up',
        confidence: 0.78,
        icon: <TargetIcon className="w-4 h-4" />,
        keywords: ['edge', 'cases'],
      }
    )
  }

  // Documentation/Learning context
  if (content.includes('explain') || content.includes('how') || context.includes('learn')) {
    prompts.push(
      {
        id: 'follow-learn-1',
        text: 'Show me a practical example',
        label: 'Show Example',
        type: 'follow-up',
        confidence: 0.88,
        icon: <SparklesIcon className="w-4 h-4" />,
        keywords: ['example', 'practical'],
      },
      {
        id: 'follow-learn-2',
        text: 'What are the common mistakes to avoid?',
        label: 'Common Pitfalls',
        type: 'follow-up',
        confidence: 0.82,
        icon: <HelpCircleIcon className="w-4 h-4" />,
        keywords: ['mistakes', 'avoid'],
      },
      {
        id: 'follow-learn-3',
        text: 'Can you compare this with alternatives?',
        label: 'Compare Approaches',
        type: 'follow-up',
        confidence: 0.75,
        icon: <TrendingUpIcon className="w-4 h-4" />,
        keywords: ['compare', 'alternatives'],
      }
    )
  }

  // Error/Problem-solving context
  if (content.includes('error') || content.includes('fix') || content.includes('debug')) {
    prompts.push(
      {
        id: 'follow-debug-1',
        text: 'What caused this error?',
        label: 'Root Cause',
        type: 'follow-up',
        confidence: 0.90,
        icon: <SearchIcon className="w-4 h-4" />,
        keywords: ['error', 'cause'],
      },
      {
        id: 'follow-debug-2',
        text: 'How can I prevent this in the future?',
        label: 'Prevention',
        type: 'follow-up',
        confidence: 0.86,
        icon: <LightbulbIcon className="w-4 h-4" />,
        keywords: ['prevent', 'future'],
      },
      {
        id: 'follow-debug-3',
        text: 'Are there better error handling patterns?',
        label: 'Better Patterns',
        type: 'follow-up',
        confidence: 0.79,
        icon: <SettingsIcon className="w-4 h-4" />,
        keywords: ['error', 'handling', 'patterns'],
      }
    )
  }

  // Generic follow-ups if no specific context
  if (prompts.length === 0) {
    prompts.push(
      {
        id: 'follow-generic-1',
        text: 'Tell me more about this',
        label: 'More Details',
        type: 'follow-up',
        confidence: 0.70,
        icon: <MessageSquareIcon className="w-4 h-4" />,
      },
      {
        id: 'follow-generic-2',
        text: 'Can you provide an example?',
        label: 'Show Example',
        type: 'follow-up',
        confidence: 0.65,
        icon: <SparklesIcon className="w-4 h-4" />,
      },
      {
        id: 'follow-generic-3',
        text: 'What else should I know?',
        label: 'Additional Info',
        type: 'follow-up',
        confidence: 0.60,
        icon: <HelpCircleIcon className="w-4 h-4" />,
      }
    )
  }

  return prompts.slice(0, 6)
}

// Quick reply templates
const quickReplyPrompts: PromptSuggestion[] = [
  {
    id: 'quick-1',
    text: 'Yes, that works perfectly',
    label: 'Approve',
    type: 'quick-reply',
    icon: <SparklesIcon className="w-4 h-4" />,
  },
  {
    id: 'quick-2',
    text: 'Can you modify this approach?',
    label: 'Modify',
    type: 'quick-reply',
    icon: <WandIcon className="w-4 h-4" />,
  },
  {
    id: 'quick-3',
    text: "Let's try a different approach",
    label: 'Try Again',
    type: 'quick-reply',
    icon: <RocketIcon className="w-4 h-4" />,
  },
  {
    id: 'quick-4',
    text: 'I need more information',
    label: 'Need More',
    type: 'quick-reply',
    icon: <HelpCircleIcon className="w-4 h-4" />,
  },
]

export function PromptSuggestionsDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [selectedContext, setSelectedContext] = useState<string>('general')
  const [activeView, setActiveView] = useState<'chips' | 'cards' | 'list'>('cards')
  const [showCategories, setShowCategories] = useState(true)

  // Get all starter prompts flattened
  const allStarterPrompts = Object.values(starterPromptsByCategory).flat()

  // Generate context-aware follow-ups
  const followUpPrompts = generateFollowUpPrompts(messages, selectedContext)

  // Handle prompt selection
  const handlePromptSelect = useCallback((suggestion: PromptSuggestion) => {
    // Insert into input
    setInputValue(suggestion.text)

    // Simulate sending the message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: suggestion.text,
      timestamp: new Date(),
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Great question! You selected: "${suggestion.label}". This demonstrates context-aware prompt suggestions with category: ${suggestion.category || 'General'}${suggestion.confidence ? ` (${Math.round(suggestion.confidence * 100)}% confidence match)` : ''}.`,
      timestamp: new Date(),
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, userMessage])
      setInputValue('')

      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage])
      }, 800)
    }, 300)
  }, [])

  // Handle manual input
  const handleSend = useCallback((content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Generate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${content}". Try the context-aware follow-up suggestions below!`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 800)
  }, [])

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          PromptSuggestions Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience intelligent, context-aware prompt suggestions with glassmorphism design
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/50 shadow-xl">
          <CardContent className="p-6 space-y-6">
            {/* View Controls */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Layout Style
              </label>
              <div className="flex flex-wrap gap-2">
                {(['chips', 'cards', 'list'] as const).map((view) => (
                  <Button
                    key={view}
                    variant={activeView === view ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveView(view)}
                    className="capitalize"
                  >
                    {view}
                  </Button>
                ))}
              </div>
            </div>

            {/* Context Controls */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BrainCircuitIcon className="w-4 h-4" />
                Context Simulation
              </label>
              <div className="flex flex-wrap gap-2">
                {['general', 'code', 'learn', 'debug'].map((context) => (
                  <Button
                    key={context}
                    variant={selectedContext === context ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedContext(context)}
                    className="capitalize"
                  >
                    {context}
                  </Button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCategories}
                  onChange={(e) => setShowCategories(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Show Categories</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Starter Prompts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <RocketIcon className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Starter Prompts
          </h2>
          <Badge variant="secondary" className="ml-auto">
            {allStarterPrompts.length} Available
          </Badge>
        </div>

        <Card className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <PromptSuggestions
              suggestions={allStarterPrompts}
              onSelect={handlePromptSelect}
              suggestionType="starter"
              layout={activeView}
              showCategories={showCategories}
              maxSuggestions={9}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Conversation Area */}
      <AnimatePresence mode="wait">
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <MessageSquareIcon className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Conversation
              </h2>
              <Badge variant="secondary" className="ml-auto">
                {messages.length} Messages
              </Badge>
            </div>

            <Card className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/50 shadow-xl">
              <CardContent className="p-6">
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground'
                            : 'bg-gradient-to-br from-muted/60 to-muted/40 backdrop-blur-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow-up Prompts */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Context-Aware Follow-ups
            </h2>
            <Badge variant="secondary" className="ml-auto">
              Smart Suggestions
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/50 shadow-xl">
            <CardContent className="p-6">
              <PromptSuggestions
                suggestions={followUpPrompts}
                onSelect={handlePromptSelect}
                suggestionType="follow-up"
                layout={activeView}
                messages={messages}
                maxSuggestions={6}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Replies */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <ZapIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Quick Replies
            </h2>
            <Badge variant="secondary" className="ml-auto">
              Fast Actions
            </Badge>
          </div>

          <Card className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/50 shadow-xl">
            <CardContent className="p-6">
              <PromptSuggestions
                suggestions={quickReplyPrompts}
                onSelect={handlePromptSelect}
                suggestionType="quick-reply"
                layout="chips"
                maxSuggestions={4}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Chat Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/50 shadow-xl">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(inputValue)
                  }
                }}
                placeholder="Type a message or select a suggestion above..."
                className="flex-1 px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Button
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim()}
                className="px-6 rounded-xl"
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            icon: <BrainCircuitIcon className="w-6 h-6" />,
            title: 'Context-Aware',
            description: 'Suggestions adapt based on conversation',
          },
          {
            icon: <TargetIcon className="w-6 h-6" />,
            title: 'Category-Based',
            description: 'Organized prompts by topic',
          },
          {
            icon: <ZapIcon className="w-6 h-6" />,
            title: 'Quick Actions',
            description: 'One-click prompt insertion',
          },
          {
            icon: <SparklesIcon className="w-6 h-6" />,
            title: 'Smart Scoring',
            description: 'Confidence-based ranking',
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
