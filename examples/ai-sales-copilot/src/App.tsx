import { useState, useEffect } from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  useChat,
  useAssistant,
  // useSentimentAnalysis, // TODO: Hook not implemented yet
  // useAnalytics, // TODO: Hook not implemented yet
  // useTokenOptimization, // TODO: Hook not implemented yet
  // AnalyticsDashboard, // TODO: Component not implemented yet
  ConversationTimeline,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import { SalesHeader } from './components/SalesHeader'
import { LeadProfile } from './components/LeadProfile'
import { PipelineView } from './components/PipelineView'
import { QuickActions } from './components/QuickActions'
import { LeadScoreCard } from './components/LeadScoreCard'
import { ActivityFeed } from './components/ActivityFeed'
import { EmailComposer } from './components/EmailComposer'
import { mockLeads, mockDeals } from './lib/mock-data'
import type { Lead, Deal } from './types'

function App() {
  const [theme, setTheme] = useState('ocean')
  const [currentLead, setCurrentLead] = useState<Lead | null>(mockLeads[0])
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Analytics & tracking (mocked for demo)
  const analytics = {
    track: (event: string, props: any) => console.log('Track:', event, props),
  }

  // Token optimization (mocked for demo)
  const tokenOpt = {
    stats: { tokensSaved: 0, costSaved: 0 },
  }

  // Sentiment analysis (mocked for demo)
  const analyzeSentiment = async (text: string) => ({ score: 0.7, label: 'positive' })
  const currentSentiment = { score: 0.7, label: 'positive' as const }

  // Main chat interface
  const {
    messages,
    isLoading,
    sendMessage,
    input,
    setInput,
  } = useChat({
    api: '/api/sales-chat',
    onMessage: async (message) => {
      // Track conversation
      analytics.track('message_sent', {
        leadId: currentLead?.id,
        messageLength: message.content.length,
      })

      // Analyze sentiment
      const sentiment = await analyzeSentiment(message.content)
      
      // Update lead score based on conversation
      if (currentLead) {
        const updatedScore = calculateLeadScore(currentLead, message, sentiment)
        setCurrentLead({
          ...currentLead,
          score: updatedScore,
          lastContact: new Date(),
        })
      }

      return message
    },
  })

  // Auto-qualify leads with AI assistant
  const {
    status,
    submitMessage,
    toolInvocations,
  } = useAssistant({
    api: '/api/sales-assistant',
    assistantId: 'lead-qualifier',
    onToolCall: (toolCall) => {
      console.log('🔧 Tool called:', toolCall.toolName)
      
      if (toolCall.toolName === 'update_lead_score') {
        const { leadId, score } = toolCall.args
        // Update lead in state
        analytics.track('lead_scored', { leadId, score })
      }
    },
  })

  // Calculate lead score
  const calculateLeadScore = (lead: Lead, message: any, sentiment: any): number => {
    let score = lead.score

    // Positive sentiment increases score
    if (sentiment.score > 0.5) score += 2
    if (sentiment.score < -0.5) score -= 2

    // Budget signals
    if (message.content.toLowerCase().includes('budget')) score += 5
    if (message.content.toLowerCase().includes('price')) score += 3

    // Authority signals
    if (message.content.toLowerCase().includes('decision')) score += 5
    if (message.content.toLowerCase().includes('approve')) score += 4

    // Need signals
    if (message.content.toLowerCase().includes('need')) score += 4
    if (message.content.toLowerCase().includes('problem')) score += 3

    // Timeline signals
    if (message.content.toLowerCase().includes('asap')) score += 5
    if (message.content.toLowerCase().includes('urgent')) score += 5
    if (message.content.toLowerCase().includes('next quarter')) score += 3

    return Math.min(100, Math.max(0, score))
  }

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate pipeline updates
      setDeals((prev) =>
        prev.map((deal) => ({
          ...deal,
          value: deal.value + Math.random() * 1000 - 500,
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ThemeProvider theme={themes[theme as keyof typeof themes]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-slate-900">
        {/* Header */}
        <SalesHeader
          onThemeChange={setTheme}
          currentTheme={theme}
          onShowAnalytics={() => setShowAnalytics(!showAnalytics)}
          totalPipeline={deals.reduce((sum, d) => sum + d.value, 0)}
        />

        <div className="container mx-auto px-4 py-6">
          {/* Pipeline Summary */}
          <PipelineView deals={deals} />

          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Left Sidebar - Lead Profile */}
            <div className="col-span-3 space-y-6">
              {currentLead && (
                <>
                  <LeadProfile lead={currentLead} />
                  <LeadScoreCard
                    score={currentLead.score}
                    sentiment={currentSentiment}
                    factors={[
                      { name: 'Budget', score: 80 },
                      { name: 'Authority', score: 60 },
                      { name: 'Need', score: 90 },
                      { name: 'Timeline', score: 70 },
                    ]}
                  />
                </>
              )}
            </div>

            {/* Main Chat Area */}
            <div className="col-span-6">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 h-[calc(100vh-300px)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    💬 Conversation
                  </h2>
                  
                  {/* Sentiment Indicator */}
                  {currentSentiment && (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentSentiment.label === 'positive'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : currentSentiment.label === 'negative'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {currentSentiment.label === 'positive' ? '😊' : currentSentiment.label === 'negative' ? '😟' : '😐'} {currentSentiment.label}
                    </div>
                  )}
                </div>

                <ChatWindow
                  messages={messages}
                  onSendMessage={sendMessage}
                  placeholder="Chat with your prospect..."
                  isLoading={isLoading}
                  showVoiceInput
                  className="h-[calc(100%-120px)]"
                />

                {/* Quick Actions */}
                <QuickActions
                  onScheduleMeeting={() => console.log('Schedule meeting')}
                  onSendEmail={() => setShowEmailComposer(true)}
                  onCreateProposal={() => console.log('Create proposal')}
                  onLogActivity={() => console.log('Log activity')}
                />
              </div>
            </div>

            {/* Right Sidebar - Activity & Insights */}
            <div className="col-span-3 space-y-6">
              {/* AI Insights */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-xl p-4 border border-purple-300/30 dark:border-purple-700/30">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                  ✨ AI Insights
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100">
                        High Intent Detected
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        Prospect mentioned "budget approved" - excellent buying signal!
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💡</span>
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100">
                        Recommendation
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        Send pricing and schedule demo within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-medium text-purple-900 dark:text-purple-100">
                        Potential Objection
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        Mentioned competitor - prepare comparison doc
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <ActivityFeed
                activities={[
                  {
                    type: 'call',
                    description: 'Called lead',
                    time: new Date(Date.now() - 3600000),
                    user: 'You',
                  },
                  {
                    type: 'email',
                    description: 'Sent follow-up email',
                    time: new Date(Date.now() - 7200000),
                    user: 'You',
                  },
                  {
                    type: 'meeting',
                    description: 'Demo scheduled',
                    time: new Date(Date.now() - 86400000),
                    user: 'System',
                  },
                ]}
              />

              {/* Token Savings */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  💰 Cost Savings
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tokens Saved</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {tokenOpt.tokensSaved.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cost Saved</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ${tokenOpt.costSaved.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Savings</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {tokenOpt.savingsPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Composer Modal */}
        {showEmailComposer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full">
              <EmailComposer
                lead={currentLead}
                onClose={() => setShowEmailComposer(false)}
                onSend={(email) => {
                  console.log('Sending email:', email)
                  analytics.track('email_sent', { leadId: currentLead?.id })
                  setShowEmailComposer(false)
                }}
              />
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">📊 Sales Analytics</h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <AnalyticsDashboard
                metrics={{
                  totalRevenue: deals.reduce((sum, d) => sum + d.value, 0),
                  conversionRate: 28,
                  averageDealSize: deals.reduce((sum, d) => sum + d.value, 0) / deals.length,
                  averageSalesCycle: 45,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
