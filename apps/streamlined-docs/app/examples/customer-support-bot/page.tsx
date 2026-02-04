'use client'

/**
 * Customer Support Chatbot Example
 *
 * Complete implementation showing:
 * - Automated ticket triage
 * - Sentiment analysis
 * - Suggested responses
 * - Escalation workflows
 * - Knowledge base integration
 * - Multi-language support
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClarityChatApp,
  type UseClarityChatReturn,
  useClarityChat,
  ChatWindow,
  MessageList,
  ChatInput,
  TypingIndicator,
} from '@clarity-chat/react'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@clarity-chat/primitives'
import {
  Headphones,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Mail,
  MessageSquare,
  Phone,
  ArrowUp,
  Smile,
  Meh,
  Frown,
} from 'lucide-react'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
} from '../../../lib/animations'
import { useReducedMotion } from '@clarity-chat/react'

// ============================================================================
// Types
// ============================================================================

type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
type TicketStatus = 'new' | 'in_progress' | 'waiting' | 'resolved'
type SentimentType = 'positive' | 'neutral' | 'negative'

interface Ticket {
  id: string
  subject: string
  priority: TicketPriority
  status: TicketStatus
  sentiment: SentimentType
  category: string
  assignedTo?: string
  createdAt: Date
  estimatedResponseTime: string
}

interface SupportStats {
  activeTickets: number
  avgResponseTime: string
  satisfactionScore: number
  resolvedToday: number
}

// ============================================================================
// Components
// ============================================================================

function TicketCard({
  ticket,
  onClick,
}: {
  ticket: Ticket
  onClick?: () => void
}) {
  const prefersReducedMotion = useReducedMotion()

  const priorityColors: Record<TicketPriority, string> = {
    low: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    medium:
      'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20',
    high: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
    urgent: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  }

  const statusColors: Record<TicketStatus, string> = {
    new: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    in_progress: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    waiting: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
    resolved: 'bg-green-500/10 text-green-700 dark:text-green-300',
  }

  const SentimentIcon =
    ticket.sentiment === 'positive'
      ? Smile
      : ticket.sentiment === 'negative'
        ? Frown
        : Meh

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
      transition={{
        duration: durations.fast,
        ease: EASING_FRAMER.default,
      }}
      viewport={{ once: true }}
    >
      <Card
        className="cursor-pointer hover:shadow-md transition-all duration-200"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-semibold text-sm line-clamp-1">
              {ticket.subject}
            </h3>
            <Badge
              variant="outline"
              className={priorityColors[ticket.priority]}
            >
              {ticket.priority.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={statusColors[ticket.status]}>
              {ticket.status.replace('_', ' ')}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <SentimentIcon className="w-3 h-3" />
              {ticket.sentiment}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {ticket.estimatedResponseTime}
            </span>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {ticket.category} • {ticket.createdAt.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StatsPanel({ stats }: { stats: SupportStats }) {
  const statItems = [
    {
      label: 'Active Tickets',
      value: stats.activeTickets,
      icon: MessageSquare,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Avg Response',
      value: stats.avgResponseTime,
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Satisfaction',
      value: `${stats.satisfactionScore}%`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Resolved Today',
      value: stats.resolvedToday,
      icon: CheckCircle,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn('w-4 h-4', stat.color)} />
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function SuggestedResponses({
  responses,
  onSelect,
}: {
  responses: string[]
  onSelect: (response: string) => void
}) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">
        Suggested Responses:
      </h4>
      <div className="space-y-2">
        {responses.map((response, index) => (
          <button
            key={index}
            onClick={() => onSelect(response)}
            className="w-full text-left p-3 text-sm border rounded-lg hover:bg-muted/50 transition-colors"
          >
            {response}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Main Page
// ============================================================================

export default function CustomerSupportBotPage() {
  const [tickets, setTickets] = React.useState<Ticket[]>([
    {
      id: '1',
      subject: 'Unable to login to my account',
      priority: 'high',
      status: 'new',
      sentiment: 'negative',
      category: 'Authentication',
      createdAt: new Date(Date.now() - 300000),
      estimatedResponseTime: '5 min',
    },
    {
      id: '2',
      subject: 'How to upgrade my subscription?',
      priority: 'medium',
      status: 'in_progress',
      sentiment: 'neutral',
      category: 'Billing',
      assignedTo: 'AI Assistant',
      createdAt: new Date(Date.now() - 600000),
      estimatedResponseTime: '10 min',
    },
    {
      id: '3',
      subject: 'Feature request: Dark mode',
      priority: 'low',
      status: 'waiting',
      sentiment: 'positive',
      category: 'Feature Request',
      createdAt: new Date(Date.now() - 1200000),
      estimatedResponseTime: '2 hours',
    },
  ])

  const [stats, setStats] = React.useState<SupportStats>({
    activeTickets: 15,
    avgResponseTime: '8 min',
    satisfactionScore: 94,
    resolvedToday: 42,
  })

  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(
    tickets[0]
  )

  const [showSuggestions, setShowSuggestions] = React.useState(true)

  const suggestedResponses = [
    "I understand you're having trouble logging in. Let me help you reset your password.",
    'Can you provide more details about the error message you see?',
    "I'll escalate this to our technical team for immediate assistance.",
  ]

  // Simulate ticket updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeTickets: prev.activeTickets + Math.floor(Math.random() * 3) - 1,
        resolvedToday: prev.resolvedToday + Math.floor(Math.random() * 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleResponseSelect = (response: string) => {
    // In real app, this would send the response
    console.log('Selected response:', response)
    setShowSuggestions(false)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Examples</span>
          <span>/</span>
          <span className="text-foreground">Customer Support Bot</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Headphones className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Customer Support Chatbot</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Complete AI-powered customer support system with automated triage,
          sentiment analysis, suggested responses, and escalation workflows.
          Perfect for SaaS companies, e-commerce, and service businesses.
        </p>
      </div>

      {/* Stats Dashboard */}
      <section className="mb-8">
        <StatsPanel stats={stats} />
      </section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ticket Queue */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Active Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => setSelectedTicket(ticket)}
                  />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {selectedTicket?.subject}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ticket #{selectedTicket?.id} • {selectedTicket?.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-6 overflow-hidden">
              <ClarityChatApp
                api="/api/chat"
                placeholder="Type your message to help the customer..."
                features={{
                  memory: true,
                  streaming: true,
                }}
                appearance={{
                  theme: 'auto',
                  showHeader: false,
                }}
              />

              {showSuggestions && (
                <div className="mt-4">
                  <SuggestedResponses
                    responses={suggestedResponses}
                    onSelect={handleResponseSelect}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Installation */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
          <code>npm install @clarity-chat/react</code>
        </pre>
      </section>

      {/* Implementation */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Implementation</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`import { ClarityChatApp } from '@clarity-chat/react'

function CustomerSupportChat() {
  return (
    <ClarityChatApp
      api="/api/support-chat"
      features={{
        memory: true,
        streaming: true,
      }}
      systemPrompt={\`You are a helpful customer support agent.
        Analyze sentiment, suggest solutions, and escalate when needed.\`}
      onMessage={(message) => {
        // Automatic ticket triage
        const priority = analyzePriority(message)
        const sentiment = analyzeSentiment(message)

        if (sentiment === 'negative' && priority === 'high') {
          notifyHumanAgent(message)
        }
      }}
    />
  )
}`}</code>
        </pre>
      </section>

      {/* Features */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Automated Triage</h3>
                  <p className="text-sm text-muted-foreground">
                    AI automatically categorizes and prioritizes tickets based
                    on content, sentiment, and urgency keywords.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time emotion detection helps identify frustrated
                    customers for immediate escalation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Smart Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Context-aware response templates speed up agent replies
                    while maintaining quality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Auto-Escalation</h3>
                  <p className="text-sm text-muted-foreground">
                    High-priority or complex issues are automatically routed to
                    human agents with full context.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Use Cases</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">SaaS Support</h3>
              <p className="text-sm text-muted-foreground">
                Handle account issues, billing questions, and feature requests
                with automated responses and smart routing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">E-commerce Returns</h3>
              <p className="text-sm text-muted-foreground">
                Process returns, track shipments, and resolve order issues with
                instant AI responses backed by your knowledge base.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Technical Support</h3>
              <p className="text-sm text-muted-foreground">
                Troubleshoot common issues, provide documentation links, and
                escalate complex problems to engineering teams.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related */}
      <section className="mt-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related Examples</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/examples/enterprise-dashboard"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Enterprise Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Analytics and monitoring for enterprise deployments.
            </p>
          </a>
          <a
            href="/cookbook/authentication"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Authentication & Authorization</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Secure user authentication and role-based access control.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}
