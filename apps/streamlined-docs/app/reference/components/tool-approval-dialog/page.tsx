'use client'

export const revalidate = 3600

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// =============================================================================
// Demo Types (matching actual component)
// =============================================================================

interface ToolCallRecord {
  id: string
  toolName: string
  args: Record<string, unknown>
  status?: string
}

interface ToolDefinition {
  name: string
  description?: string
  requiresApproval?: boolean
}

// =============================================================================
// Demo ToolApprovalDialog Component
// =============================================================================

interface DemoToolApprovalDialogProps {
  toolCall: ToolCallRecord
  toolDefinition?: ToolDefinition
  onApprove: (callId: string) => void
  onReject: (callId: string, reason: string) => void
  showArguments?: boolean
  showDescription?: boolean
  showRiskLevel?: boolean
  className?: string
  theme?: 'light' | 'dark' | 'auto'
}

function DemoToolApprovalDialog({
  toolCall,
  toolDefinition,
  onApprove,
  onReject,
  showArguments = true,
  showDescription = true,
  showRiskLevel = true,
  theme = 'auto',
}: DemoToolApprovalDialogProps) {
  const [rejectReason, setRejectReason] = React.useState('')
  const [showRejectInput, setShowRejectInput] = React.useState(false)

  const riskLevel = determineRiskLevel(toolCall, toolDefinition)

  const handleApprove = () => {
    onApprove(toolCall.id)
  }

  const handleReject = () => {
    const reason = rejectReason.trim() || 'User declined'
    onReject(toolCall.id, reason)
  }

  const riskColors = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    medium:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowRejectInput(false)}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
          className={cn(
            'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide',
            'bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-border/50'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Tool Approval Required</h2>
            </div>
            {showRiskLevel && (
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold uppercase border',
                  riskColors[riskLevel]
                )}
              >
                {riskLevel} Risk
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Tool Name */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Tool</h3>
              <div className="font-mono text-lg font-semibold text-foreground">{toolCall.toolName}</div>
            </div>

            {/* Description */}
            {showDescription && toolDefinition?.description && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{toolDefinition.description}</p>
              </div>
            )}

            {/* Arguments */}
            {showArguments && Object.keys(toolCall.args).length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Arguments</h3>
                <pre className="p-4 bg-muted/50 border border-border/50 rounded-lg overflow-x-auto scrollbar-hide">
                  <code className="text-xs font-mono text-foreground">
                    {JSON.stringify(toolCall.args, null, 2)}
                  </code>
                </pre>
              </div>
            )}

            {/* Explanation */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">What will this do?</h3>
              <p className="text-sm text-foreground leading-relaxed">{generateExplanation(toolCall, toolDefinition)}</p>
            </div>

            {/* Reject Input */}
            <AnimatePresence>
              {showRejectInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="reject-reason" className="block text-sm font-medium text-foreground mb-2">
                    Reason for rejection (optional):
                  </label>
                  <input
                    id="reject-reason"
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Why are you rejecting this tool?"
                    className={cn(
                      'w-full px-3 py-2 rounded-lg border border-border/50',
                      'bg-background text-foreground placeholder:text-muted-foreground',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',
                      'transition-colors'
                    )}
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-border/50 bg-muted/20">
            {!showRejectInput ? (
              <>
                <button
                  onClick={() => setShowRejectInput(true)}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium text-sm',
                    'bg-red-500 hover:bg-red-600 text-white',
                    'transition-all hover:scale-[1.02] active:scale-[0.98]',
                    'focus:outline-none focus:ring-2 focus:ring-red-500/50'
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </span>
                </button>
                <button
                  onClick={handleApprove}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium text-sm',
                    'bg-emerald-500 hover:bg-emerald-600 text-white',
                    'transition-all hover:scale-[1.02] active:scale-[0.98]',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium text-sm',
                    'bg-muted hover:bg-muted/80 text-foreground',
                    'transition-all hover:scale-[1.02] active:scale-[0.98]',
                    'focus:outline-none focus:ring-2 focus:ring-border'
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium text-sm',
                    'bg-red-500 hover:bg-red-600 text-white',
                    'transition-all hover:scale-[1.02] active:scale-[0.98]',
                    'focus:outline-none focus:ring-2 focus:ring-red-500/50'
                  )}
                >
                  Confirm Rejection
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// =============================================================================
// Helper Functions
// =============================================================================

function determineRiskLevel(toolCall: ToolCallRecord, toolDefinition?: ToolDefinition): 'low' | 'medium' | 'high' {
  const toolName = toolCall.toolName.toLowerCase()

  const highRiskKeywords = ['delete', 'remove', 'drop', 'destroy', 'execute', 'eval', 'system']
  if (highRiskKeywords.some((keyword) => toolName.includes(keyword))) {
    return 'high'
  }

  const mediumRiskKeywords = ['write', 'update', 'modify', 'create', 'send', 'email', 'database']
  if (mediumRiskKeywords.some((keyword) => toolName.includes(keyword))) {
    return 'medium'
  }

  if (toolDefinition?.requiresApproval) {
    return 'medium'
  }

  return 'low'
}

function generateExplanation(toolCall: ToolCallRecord, toolDefinition?: ToolDefinition): string {
  const toolName = toolCall.toolName
  const args = toolCall.args

  if (toolName.includes('weather')) {
    return `This will fetch current weather information for ${args.location || 'the specified location'}.`
  }

  if (toolName.includes('calculate') || toolName.includes('math')) {
    return `This will perform a calculation: ${args.expression || args.operation || 'the requested operation'}.`
  }

  if (toolName.includes('search')) {
    return `This will search for: "${args.query || args.q || 'the specified query'}".`
  }

  if (toolName.includes('database') || toolName.includes('query')) {
    return `This will execute a database query. Please review the arguments carefully.`
  }

  if (toolName.includes('email') || toolName.includes('send')) {
    return `This will send an email to ${args.to || args.recipient || 'the specified recipient'}.`
  }

  if (toolName.includes('file') || toolName.includes('write')) {
    return `This will write to a file: ${args.path || args.filename || 'the specified file'}.`
  }

  if (toolDefinition?.description) {
    return toolDefinition.description
  }

  return `This will execute the "${toolName}" tool with the provided arguments.`
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function ToolApprovalDialogPage() {
  const [showDemo, setShowDemo] = React.useState(false)
  const [selectedExample, setSelectedExample] = React.useState(0)
  const [showArguments, setShowArguments] = React.useState(true)
  const [showDescription, setShowDescription] = React.useState(true)
  const [showRiskLevel, setShowRiskLevel] = React.useState(true)

  const examples = [
    {
      name: 'Weather Query (Low Risk)',
      toolCall: {
        id: '1',
        toolName: 'get_weather',
        args: {
          location: 'San Francisco, CA',
          units: 'fahrenheit',
        },
      },
      toolDefinition: {
        name: 'get_weather',
        description: 'Fetches current weather conditions for a specified location.',
      },
    },
    {
      name: 'Database Query (Medium Risk)',
      toolCall: {
        id: '2',
        toolName: 'update_database',
        args: {
          table: 'users',
          query: "UPDATE users SET status = 'active' WHERE id = 123",
        },
      },
      toolDefinition: {
        name: 'update_database',
        description: 'Executes a database update query.',
        requiresApproval: true,
      },
    },
    {
      name: 'Email Send (Medium Risk)',
      toolCall: {
        id: '3',
        toolName: 'send_email',
        args: {
          to: 'customer@example.com',
          subject: 'Order Status Update',
          body: 'Your order #12345 has been shipped and will arrive in 2-3 business days.',
        },
      },
      toolDefinition: {
        name: 'send_email',
        description: 'Sends an email to the specified recipient.',
        requiresApproval: true,
      },
    },
    {
      name: 'Delete Records (High Risk)',
      toolCall: {
        id: '4',
        toolName: 'delete_records',
        args: {
          table: 'archived_data',
          condition: "created_at < '2023-01-01'",
          limit: 1000,
        },
      },
      toolDefinition: {
        name: 'delete_records',
        description: 'Permanently deletes records from the database matching the specified condition.',
        requiresApproval: true,
      },
    },
  ]

  const currentExample = examples[selectedExample]

  const handleApprove = (callId: string) => {
    console.log('Approved:', callId)
    setShowDemo(false)
  }

  const handleReject = (callId: string, reason: string) => {
    console.log('Rejected:', callId, reason)
    setShowDemo(false)
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">ToolApprovalDialog</h1>
              <p className="text-sm text-muted-foreground mt-1">Tool Approval Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Pre-built modal dialog for human-in-the-loop tool approval flows with risk indicators, detailed argument
            inspection, and customizable theming.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[300px]">
              <button
                onClick={() => setShowDemo(true)}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium text-sm',
                  'bg-blue-500 hover:bg-blue-600 text-white',
                  'transition-all hover:scale-105 active:scale-95',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                )}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Show Approval Dialog
                </span>
              </button>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Example Scenario</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedExample(index)}
                      className={cn(
                        'px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all',
                        selectedExample === index
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showArguments}
                    onChange={(e) => setShowArguments(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Arguments</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDescription}
                    onChange={(e) => setShowDescription(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Description</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRiskLevel}
                    onChange={(e) => setShowRiskLevel(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Risk Level</span>
                </label>
              </div>
            </div>
          </div>

          {/* Demo Dialog */}
          {showDemo && (
            <DemoToolApprovalDialog
              toolCall={currentExample.toolCall}
              toolDefinition={currentExample.toolDefinition}
              onApprove={handleApprove}
              onReject={handleReject}
              showArguments={showArguments}
              showDescription={showDescription}
              showRiskLevel={showRiskLevel}
            />
          )}
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Usage with Lifecycle Events</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { ToolApprovalDialog } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function ChatInterface() {
  const [pendingTool, setPendingTool] = useState(null)

  useEffect(() => {
    orchestrator.lifecycle.on('tool_pending_approval', (event) => {
      setPendingTool(event.call)
    })
  }, [])

  return (
    <>
      <ChatWindow />
      {pendingTool && (
        <ToolApprovalDialog
          toolCall={pendingTool}
          toolDefinition={orchestrator.getTool(pendingTool.toolName)}
          onApprove={(callId) => {
            orchestrator.approveTool(callId, 'user')
            orchestrator.executeApprovedTool(callId)
            setPendingTool(null)
          }}
          onReject={(callId, reason) => {
            orchestrator.rejectTool(callId, reason, 'user')
            setPendingTool(null)
          }}
        />
      )}
    </>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Custom Risk Indicators</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<ToolApprovalDialog
  toolCall={{
    id: '123',
    toolName: 'send_email',
    args: {
      to: 'customer@example.com',
      subject: 'Order Confirmation',
      body: 'Thank you for your order!'
    }
  }}
  toolDefinition={{
    name: 'send_email',
    description: 'Sends an email to the specified recipient',
    requiresApproval: true
  }}
  onApprove={(callId) => executeToolCall(callId)}
  onReject={(callId, reason) => logRejection(callId, reason)}
  showRiskLevel={true}
  showArguments={true}
  showDescription={true}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Minimal Configuration</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<ToolApprovalDialog
  toolCall={toolCall}
  onApprove={handleApprove}
  onReject={handleReject}
  showArguments={false}
  showDescription={false}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Dark Theme</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<ToolApprovalDialog
  toolCall={toolCall}
  toolDefinition={toolDefinition}
  onApprove={handleApprove}
  onReject={handleReject}
  theme="dark"
  className="custom-dialog"
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>toolCall</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ToolCallRecord</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Tool call awaiting approval (required)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>toolDefinition</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">ToolDefinition</td>
                  <td className="py-3 px-4 text-muted-foreground">undefined</td>
                  <td className="py-3 px-4 text-muted-foreground">Tool definition for enhanced UX</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onApprove</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">(callId: string) =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Called when user approves (required)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onReject</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">(callId: string, reason: string) =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Called when user rejects (required)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showArguments</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show detailed arguments section</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showDescription</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show tool description</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showRiskLevel</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show risk level indicator badge</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">''</td>
                  <td className="py-3 px-4 text-muted-foreground">Custom className for styling</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>theme</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'light' | 'dark' | 'auto'</td>
                  <td className="py-3 px-4 text-muted-foreground">'auto'</td>
                  <td className="py-3 px-4 text-muted-foreground">Visual theme preference</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Type Definitions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Type Definitions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">ToolCallRecord</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`interface ToolCallRecord {
  /** Unique identifier for this tool call */
  id: string

  /** Name of the tool being invoked */
  toolName: string

  /** Arguments passed to the tool */
  args: Record<string, unknown>

  /** Current execution status (optional) */
  status?: string
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">ToolDefinition</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`interface ToolDefinition {
  /** Tool identifier */
  name: string

  /** Human-readable description of what the tool does */
  description?: string

  /** Whether this tool requires explicit user approval */
  requiresApproval?: boolean
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Levels */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Risk Level Indicators</h2>

          <p className="text-muted-foreground mb-6">
            The component automatically determines risk levels based on tool name keywords and definition flags:
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">Low Risk</h3>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-3">
                Read-only operations, safe queries, informational tools
              </p>
              <div className="space-y-1 text-xs">
                <div className="font-mono text-emerald-700 dark:text-emerald-300">get_weather</div>
                <div className="font-mono text-emerald-700 dark:text-emerald-300">calculate_math</div>
                <div className="font-mono text-emerald-700 dark:text-emerald-300">search_docs</div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-amber-700 dark:text-amber-300">Medium Risk</h3>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400 mb-3">
                Write operations, updates, communications
              </p>
              <div className="space-y-1 text-xs">
                <div className="font-mono text-amber-700 dark:text-amber-300">send_email</div>
                <div className="font-mono text-amber-700 dark:text-amber-300">update_database</div>
                <div className="font-mono text-amber-700 dark:text-amber-300">create_file</div>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-700 dark:text-red-300">High Risk</h3>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                Destructive operations, system commands, deletions
              </p>
              <div className="space-y-1 text-xs">
                <div className="font-mono text-red-700 dark:text-red-300">delete_records</div>
                <div className="font-mono text-red-700 dark:text-red-300">execute_system</div>
                <div className="font-mono text-red-700 dark:text-red-300">drop_table</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Automated Risk Assessment</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically determines risk levels based on tool name patterns and definition flags
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">Detailed Argument Inspection</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Review tool arguments in formatted JSON with syntax highlighting before approval
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
                <h3 className="font-semibold">Smooth Animations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Framer Motion animations for polished enter/exit transitions with spring physics
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with proper ARIA labels, keyboard navigation, and focus management
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <h3 className="font-semibold">Theme Support</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Light, dark, and auto themes with smooth transitions and proper contrast ratios
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-5 h-5 text-rose-600 dark:text-rose-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="font-semibold">Mobile Responsive</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Adapts seamlessly from mobile (320px) to desktop with hidden scrollbars and viewport-aware sizing
              </p>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/tool-approval"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">ToolApproval</h3>
              <p className="text-sm text-muted-foreground">Inline tool approval component with status states</p>
            </Link>

            <Link
              href="/reference/components/tool-card"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">ToolCard</h3>
              <p className="text-sm text-muted-foreground">Display tool invocations with expandable details</p>
            </Link>

            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">Real-time streaming message display with tool support</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
