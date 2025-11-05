import { useState, useEffect } from 'react'
import {
  ChatWindow,
  ThemeProvider,
  themes,
  CommandPalette,
  useChat,
  useAssistant,
  usePromptCompression,
  useSmartCache,
  useModelRouter,
  useTokenTracker,
  TokenOptimizationDashboard,
  AgentRunFeed,
  UsageDashboard,
  VoiceInput,
  ContextManager,
  SafetyStatusCard,
  AuditLogViewer,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import { DevOpsHeader } from './components/DevOpsHeader'
import { InfrastructureMetrics } from './components/InfrastructureMetrics'
import { AgentStatusPanel } from './components/AgentStatusPanel'
import { CommandHistory } from './components/CommandHistory'
import { devOpsAgents } from './agents'
import { mockInfrastructureData } from './lib/mock-data'
import type { InfrastructureMetrics as IMetrics } from './types'

function App() {
  const [theme, setTheme] = useState('ocean')
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showTokenDashboard, setShowTokenDashboard] = useState(false)
  const [showAuditLog, setShowAuditLog] = useState(false)
  const [metrics, setMetrics] = useState<IMetrics>(mockInfrastructureData)

  // Token optimization hooks
  const compression = usePromptCompression({ 
    removeFillers: true,
    useAbbreviations: true 
  })
  const cache = useSmartCache({ enableSemanticMatching: true })
  const router = useModelRouter()
  const tokenTracker = useTokenTracker()

  // Multi-agent assistant
  const {
    status,
    messages,
    submitMessage,
    input,
    setInput,
    isLoading,
    toolInvocations,
  } = useAssistant({
    api: '/api/devops-assistant',
    assistantId: 'devops-command-center',
    onToolCall: (toolCall) => {
      console.log('🔧 Tool called:', toolCall.toolName, toolCall.args)
      // Track tool usage for analytics
      tokenTracker.trackToolCall(toolCall)
    },
  })

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      // Token Dashboard: Cmd+T
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault()
        setShowTokenDashboard(!showTokenDashboard)
      }
      // Audit Log: Cmd+L
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault()
        setShowAuditLog(!showAuditLog)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showTokenDashboard, showAuditLog])

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        servers: {
          ...prev.servers,
          cpuUsage: Math.min(100, Math.max(0, prev.servers.cpuUsage + (Math.random() - 0.5) * 10)),
          memoryUsage: Math.min(100, Math.max(0, prev.servers.memoryUsage + (Math.random() - 0.5) * 8)),
        },
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle optimized message sending
  const handleSendMessage = async (content: string) => {
    try {
      // 1. Compress prompt
      const { compressed, savingsPercent } = compression.compress(content)
      console.log(`💰 Compressed prompt: ${savingsPercent}% savings`)

      // 2. Check cache
      const cached = await cache.get(compressed)
      if (cached) {
        console.log('⚡ Cache hit! Using cached response')
        tokenTracker.trackCacheHit()
        return cached
      }

      // 3. Route to best model
      const { model } = router.route(compressed)
      console.log(`🎯 Routing to: ${model.name}`)

      // 4. Submit to AI
      const result = await submitMessage(compressed)

      // 5. Cache result
      await cache.set(compressed, result)
      tokenTracker.trackCompletion(model.id, compressed, result)

      return result
    } catch (error) {
      console.error('❌ Error:', error)
      throw error
    }
  }

  // Handle voice input
  const handleVoiceInput = (transcript: string) => {
    console.log('🎤 Voice input:', transcript)
    setInput(transcript)
  }

  // Command palette commands
  const commands = [
    {
      id: 'scale-up',
      label: 'Scale Up Production',
      icon: '🚀',
      action: () => handleSendMessage('Scale up production servers by 50%'),
    },
    {
      id: 'health-check',
      label: 'Run Health Check',
      icon: '🏥',
      action: () => handleSendMessage('Run complete health check on all servers'),
    },
    {
      id: 'security-scan',
      label: 'Security Scan',
      icon: '🔒',
      action: () => handleSendMessage('Scan all services for vulnerabilities'),
    },
    {
      id: 'cost-analysis',
      label: 'Cost Analysis',
      icon: '💰',
      action: () => handleSendMessage('Analyze current infrastructure costs and suggest optimizations'),
    },
    {
      id: 'deploy',
      label: 'Deploy to Staging',
      icon: '🚢',
      action: () => handleSendMessage('Deploy latest version to staging environment'),
    },
    {
      id: 'rollback',
      label: 'Rollback Production',
      icon: '⏪',
      action: () => handleSendMessage('Rollback production to previous stable version'),
    },
  ]

  return (
    <ThemeProvider theme={themes[theme as keyof typeof themes]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <DevOpsHeader
          onThemeChange={setTheme}
          currentTheme={theme}
          onShowTokens={() => setShowTokenDashboard(!showTokenDashboard)}
          onShowAudit={() => setShowAuditLog(!showAuditLog)}
          tokensSaved={tokenTracker.totalTokensSaved}
        />

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Metrics */}
            <div className="col-span-3 space-y-6">
              <InfrastructureMetrics metrics={metrics} />
              <AgentStatusPanel agents={devOpsAgents} />
            </div>

            {/* Main Chat Area */}
            <div className="col-span-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 h-[calc(100vh-180px)]">
                <ChatWindow
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  placeholder="Ask me to manage your infrastructure... (e.g., 'Scale up production' or 'Run security scan')"
                  isLoading={isLoading}
                  showVoiceInput
                  onVoiceInput={handleVoiceInput}
                  toolInvocations={toolInvocations}
                  className="h-full"
                />

                {/* Agent Status */}
                {status !== 'idle' && (
                  <div className="mt-4 px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                      <span className="text-sm text-blue-200">
                        {status === 'in_progress' ? 'Agents working...' : 'Processing...'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Activity */}
            <div className="col-span-3 space-y-6">
              {/* Agent Activity Feed */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 max-h-[400px] overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-4">🤖 Agent Activity</h3>
                <AgentRunFeed 
                  runs={toolInvocations}
                  className="space-y-2"
                />
              </div>

              {/* Command History */}
              <CommandHistory messages={messages} />

              {/* Usage Stats */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">📊 Usage</h3>
                <UsageDashboard
                  metrics={{
                    totalRequests: tokenTracker.totalRequests,
                    totalTokens: tokenTracker.totalTokens,
                    averageLatency: tokenTracker.averageLatency,
                    cacheHitRate: tokenTracker.cacheHitRate,
                  }}
                  compact
                />
              </div>
            </div>
          </div>
        </div>

        {/* Command Palette */}
        {showCommandPalette && (
          <CommandPalette
            commands={commands}
            onClose={() => setShowCommandPalette(false)}
            onSelect={(command) => {
              command.action()
              setShowCommandPalette(false)
            }}
          />
        )}

        {/* Token Optimization Dashboard */}
        {showTokenDashboard && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">💰 Token Optimization</h2>
                  <button
                    onClick={() => setShowTokenDashboard(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <TokenOptimizationDashboard
                  metrics={{
                    totalTokens: tokenTracker.totalTokens,
                    tokensSaved: tokenTracker.totalTokensSaved,
                    costSaved: tokenTracker.costSaved,
                    savingsPercent: tokenTracker.savingsPercent,
                    compressionSavings: compression.totalSavings,
                    cacheSavings: cache.totalSavings,
                    routingSavings: router.totalSavings,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Audit Log */}
        {showAuditLog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">📋 Audit Log</h2>
                  <button
                    onClick={() => setShowAuditLog(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <AuditLogViewer
                  logs={messages.map((msg, i) => ({
                    id: String(i),
                    timestamp: new Date(),
                    user: msg.role === 'user' ? 'DevOps Engineer' : 'AI Assistant',
                    action: msg.content.substring(0, 50),
                    resource: 'Infrastructure',
                    result: 'success',
                  }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Safety Status (bottom-left corner) */}
        <div className="fixed bottom-4 left-4">
          <SafetyStatusCard
            status="active"
            checks={[
              { name: 'PII Detection', status: 'pass' },
              { name: 'Content Filter', status: 'pass' },
              { name: 'Rate Limiting', status: 'pass' },
            ]}
          />
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg">
          <div className="space-y-1">
            <div><kbd className="px-1 bg-white/20 rounded">⌘K</kbd> Command Palette</div>
            <div><kbd className="px-1 bg-white/20 rounded">⌘T</kbd> Token Dashboard</div>
            <div><kbd className="px-1 bg-white/20 rounded">⌘L</kbd> Audit Log</div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
