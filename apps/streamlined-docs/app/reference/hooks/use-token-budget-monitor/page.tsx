'use client'

/**
 * useTokenBudgetMonitor Hook - API Reference Documentation
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Copy, Check, ChevronRight, DollarSign, AlertTriangle, Gauge, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

export const revalidate = 3600

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className={cn('p-2 rounded-md hover:bg-muted/50 transition-colors', 'text-muted-foreground hover:text-foreground', className)} aria-label={copied ? 'Copied' : 'Copy to clipboard'}>
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

interface PropDefinition { name: string; type: string; default?: string; required?: boolean; description: string }

function PropsTable({ props, title }: { props: PropDefinition[]; title?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && <div className="px-4 py-3 bg-muted/30 border-b border-border/50"><h4 className="font-semibold text-foreground">{title}</h4></div>}
      <table className="w-full text-sm">
        <thead><tr className="border-b border-border/50 bg-muted/20"><th className="px-4 py-3 text-left font-semibold text-foreground">Name</th><th className="px-4 py-3 text-left font-semibold text-foreground">Type</th><th className="px-4 py-3 text-left font-semibold text-foreground">Default</th><th className="px-4 py-3 text-left font-semibold text-foreground">Description</th></tr></thead>
        <tbody>
          {props.map((prop, index) => (
            <tr key={prop.name} className={cn('border-b border-border/30 last:border-b-0', index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10')}>
              <td className="px-4 py-3 font-mono text-sm"><span className="text-brand-600 dark:text-brand-400">{prop.name}</span>{prop.required && <span className="ml-1 text-red-500" title="Required">*</span>}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">{prop.default || '-'}</td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={cn('scroll-mt-24', className)}><h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><a href={`#${id}`} className="hover:text-brand-500 transition-colors group">{title}<span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">#</span></a></h2>{children}</section>
}

function SubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <div id={id} className="scroll-mt-24 mt-8"><h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2"><a href={`#${id}`} className="hover:text-brand-500 transition-colors group">{title}<span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">#</span></a></h3>{children}</div>
}

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  { id: 'parameters', title: 'Parameters' },
  { id: 'returns', title: 'Return Value' },
  { id: 'examples', title: 'Examples', children: [
      { id: 'example-basic', title: 'Basic Monitoring' },
      { id: 'example-warnings', title: 'Threshold Warnings' },
      { id: 'example-autotrim', title: 'Automatic Trimming' },
      { id: 'example-cost', title: 'Cost Estimation' },
      { id: 'example-presets', title: 'Model Presets' },
    ]},
  { id: 'advanced', title: 'Advanced Usage' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'related', title: 'Related APIs' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { setActiveId(entry.target.id) } })
    }, { rootMargin: '-100px 0px -66%' })
    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [])
  return (
    <nav className="sticky top-24 space-y-1 text-sm" aria-label="Table of contents">
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a href={`#${item.id}`} className={cn('block py-1 px-2 rounded transition-colors', activeId === item.id ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10' : 'text-muted-foreground hover:text-foreground')}>{item.title}</a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => <a key={child.id} href={`#${child.id}`} className={cn('block py-0.5 text-xs transition-colors', activeId === child.id ? 'text-brand-600 dark:text-brand-400' : 'text-muted-foreground hover:text-foreground')}>{child.title}</a>)}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

const optionsProps: PropDefinition[] = [
  { name: 'maxInputTokens', type: 'number', required: true, description: 'Maximum input tokens for the model (e.g., 128000 for GPT-4)' },
  { name: 'warningThreshold', type: 'number', default: '0.8', description: 'Warning threshold as decimal (0.8 = 80%)' },
  { name: 'criticalThreshold', type: 'number', default: '0.95', description: 'Critical threshold as decimal (0.95 = 95%)' },
  { name: 'reservedForOutput', type: 'number', default: '4096', description: 'Tokens reserved for model output response' },
  { name: 'model', type: 'ModelId', description: 'Model name for accurate token counting' },
  { name: 'onWarning', type: '(usage: TokenBudgetUsage) => void', description: 'Callback when warning threshold is crossed' },
  { name: 'onCritical', type: '(usage: TokenBudgetUsage) => void', description: 'Callback when critical threshold is crossed' },
  { name: 'onExceeded', type: '(usage: TokenBudgetUsage) => void', description: 'Callback when budget is exceeded (over 100%)' },
  { name: 'autoTrim', type: 'boolean', default: 'false', description: 'Automatically trigger trimming at critical threshold' },
  { name: 'onAutoTrim', type: '(result: TrimResult) => void', description: 'Callback after auto-trim occurs' },
  { name: 'debounceMs', type: 'number', default: '300', description: 'Debounce delay for token counting in milliseconds' },
  { name: 'useAccurateTokenization', type: 'boolean', default: 'false', description: 'Use accurate tokenization (slower but precise)' },
]

const returnProps: PropDefinition[] = [
  { name: 'usage', type: 'TokenBudgetUsage', description: 'Current token usage metrics' },
  { name: 'isWarning', type: 'boolean', description: 'Whether currently in warning state' },
  { name: 'isCritical', type: 'boolean', description: 'Whether currently in critical state' },
  { name: 'isExceeded', type: 'boolean', description: 'Whether budget is exceeded' },
  { name: 'wouldExceed', type: '(additionalTokens: number) => boolean', description: 'Check if adding tokens would exceed budget' },
  { name: 'calculateTokens', type: '(text: string) => Promise<number>', description: 'Calculate tokens for text' },
  { name: 'updateMessages', type: '(messages: BudgetMessage[]) => void', description: 'Update messages and recalculate' },
  { name: 'trimToCritical', type: '() => TrimResult | null', description: 'Manually trigger trim' },
  { name: 'reset', type: '() => void', description: 'Reset monitor state' },
  { name: 'lastTrimResult', type: 'TrimResult | null', description: 'Last trim result' },
  { name: 'isCalculating', type: 'boolean', description: 'Whether currently calculating' },
]

const importCode = `import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'`
const signatureCode = `function useTokenBudgetMonitor(config: TokenBudgetConfig): TokenBudgetMonitorReturn`

const basicUsageCode = `import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

function TokenMonitor({ messages }) {
  const { usage, isWarning, isCritical, updateMessages } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    reservedForOutput: 4096,
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
  })

  useEffect(() => {
    updateMessages(messages.map(m => ({ role: m.role, content: m.content })))
  }, [messages])

  return (
    <div>
      <div className="token-bar">
        <div style={{ width: \`\${usage.utilizationPercent}%\`, backgroundColor: isCritical ? 'red' : isWarning ? 'orange' : 'green' }} />
      </div>
      <div>{usage.current.toLocaleString()} / {usage.effectiveMax.toLocaleString()} tokens ({usage.utilizationPercent.toFixed(1)}%)</div>
    </div>
  )
}`

const warningsCode = `import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

function ThresholdWarnings() {
  const { usage, trimToCritical } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    onWarning: (usage) => toast.warning(\`Token usage at \${usage.utilizationPercent.toFixed(0)}%\`),
    onCritical: (usage) => toast.error('Critical context level'),
    onExceeded: (usage) => toast.error(\`Over budget by \${usage.exceededPercent.toFixed(0)}%\`),
  })
  return <div className="progress-bar"><div className={usage.status} style={{ width: \`\${Math.min(usage.utilizationPercent, 100)}%\` }} /></div>
}`

const autotrimCode = `import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

function AutoTrimming() {
  const { usage, lastTrimResult } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    autoTrim: true,
    onAutoTrim: (result) => {
      toast.info(\`Removed \${result.removedItems.length} messages (\${result.tokensRemoved} tokens)\`)
    },
  })
  return lastTrimResult ? <div>Last trim removed {lastTrimResult.tokensRemoved} tokens</div> : null
}`

const costCode = `import { useTokenBudgetMonitor, estimateTokenCost } from '@clarity-chat/token-optimization'

function CostEstimation() {
  const { usage } = useTokenBudgetMonitor({ maxInputTokens: 128000, model: 'gpt-4o' })
  const cost = estimateTokenCost(usage, 'gpt-4o')
  return cost ? <div>Estimated cost: {cost.formattedCost}</div> : null
}`

const presetsCode = `import { useTokenBudgetMonitor, createModelBudgetMonitor } from '@clarity-chat/token-optimization'

const config = createModelBudgetMonitor('gpt-4o')
const monitor = useTokenBudgetMonitor(config)`

const advancedCode = `import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

function Advanced() {
  const { usage, wouldExceed, calculateTokens } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    useAccurateTokenization: true,
  })
  
  const canSend = async (content: string) => {
    const tokens = await calculateTokens(content)
    return !wouldExceed(tokens)
  }
  
  return <div>Current: {usage.current}, Available: {usage.available}</div>
}`

const bestPracticesCode = `// ✅ Update messages in useEffect
useEffect(() => {
  updateMessages(messages.map(m => ({ role: m.role, content: m.content })))
}, [messages])

// ✅ Use model presets
const config = createModelBudgetMonitor('gpt-4o')

// ❌ Not updating messages
const { usage } = useTokenBudgetMonitor(config) // usage.current will be 0`

const typesCode = `type TokenUsageStatus = 'safe' | 'warning' | 'critical' | 'exceeded'

interface TokenBudgetUsage {
  current: number
  max: number
  available: number
  utilizationPercent: number
  exceededPercent: number
  status: TokenUsageStatus
  reservedForOutput: number
  effectiveMax: number
}`

export default function UseTokenBudgetMonitorPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          <main className="flex-1 min-w-0 space-y-12">
            <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: durations.moderate, ease: [0.25, 0.1, 0.25, 1] }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"><Gauge className="w-6 h-6" /></div>
                <div><div className="flex items-center gap-2"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Deprecated</span><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">Hook</span><span className="text-xs text-muted-foreground">@clarity-chat/token-optimization</span></div></div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">useTokenBudgetMonitor</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">Real-time token usage monitoring with threshold-based warnings, automatic trimming, and cost estimation. Prevents context overflow and provides immediate cost awareness. Will be renamed to useTokenBudgetTracking in v3.0.0.</p>
              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800"><p className="text-sm text-amber-700 dark:text-amber-300"><strong>Deprecation Notice:</strong> This hook will be renamed to <code>useTokenBudgetTracking</code> in v3.0.0 for naming clarity.</p></div>
            </motion.header>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: durations.slow, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ icon: Gauge, label: 'Real-time', desc: 'Live monitoring' }, { icon: AlertTriangle, label: 'Thresholds', desc: 'Early warnings' }, { icon: Scissors, label: 'Auto-trim', desc: 'Context management' }, { icon: DollarSign, label: 'Cost tracking', desc: 'Immediate awareness' }].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-4 rounded-lg bg-muted/30 border border-border/50"><Icon className="w-5 h-5 text-brand-500 mb-2" /><p className="font-medium text-foreground text-sm">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
              ))}
            </motion.div>

            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p><code>useTokenBudgetMonitor</code> provides real-time token usage monitoring with configurable thresholds, automatic trimming, and cost estimation.</p>
                <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  <li><strong>Real-time Monitoring:</strong> Debounced token counting with accurate or fast estimation</li>
                  <li><strong>Threshold Warnings:</strong> Configurable warning and critical thresholds with callbacks</li>
                  <li><strong>Automatic Trimming:</strong> Auto-remove oldest messages when reaching critical threshold</li>
                  <li><strong>Cost Estimation:</strong> Real-time cost tracking for input and output tokens</li>
                  <li><strong>Model Presets:</strong> Pre-configured budgets for 20+ popular models</li>
                </ul>
              </div>
            </Section>

            <Section id="import" title="Import"><CodeBlock code={importCode} language="tsx" filename="Import" showDownloadButton={false} /></Section>
            <Section id="signature" title="Signature"><CodeBlock code={signatureCode} language="tsx" filename="Signature" showDownloadButton={false} /></Section>
            <Section id="parameters" title="Parameters"><PropsTable props={optionsProps} /></Section>
            <Section id="returns" title="Return Value"><PropsTable props={returnProps} /></Section>

            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Monitoring"><CodeBlock code={basicUsageCode} language="tsx" filename="BasicMonitoring.tsx" /></SubSection>
              <SubSection id="example-warnings" title="Threshold Warnings"><CodeBlock code={warningsCode} language="tsx" filename="ThresholdWarnings.tsx" /></SubSection>
              <SubSection id="example-autotrim" title="Automatic Trimming"><CodeBlock code={autotrimCode} language="tsx" filename="AutoTrimming.tsx" /></SubSection>
              <SubSection id="example-cost" title="Cost Estimation"><CodeBlock code={costCode} language="tsx" filename="CostEstimation.tsx" /></SubSection>
              <SubSection id="example-presets" title="Model Presets"><CodeBlock code={presetsCode} language="tsx" filename="ModelPresets.tsx" /></SubSection>
            </Section>

            <Section id="advanced" title="Advanced Usage"><CodeBlock code={advancedCode} language="tsx" filename="Advanced.tsx" /></Section>
            <Section id="best-practices" title="Best Practices"><CodeBlock code={bestPracticesCode} language="tsx" filename="BestPractices.tsx" /></Section>
            <Section id="typescript" title="TypeScript"><CodeBlock code={typesCode} language="tsx" filename="types.ts" showLineNumbers /></Section>

            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'TokenOptimizationPanel', type: 'component', description: 'UI component for token optimization controls', href: '/reference/components/token-optimization-panel' },
                  { name: 'useTokenCounter', type: 'hook', description: 'Basic token counting hook', href: '/reference/hooks/use-token-counter' },
                  { name: 'useClarityChat', type: 'hook', description: 'High-level chat hook with token optimization', href: '/reference/hooks/use-clarity-chat' },
                  { name: 'TokenBudgetBar', type: 'component', description: 'Visual token budget display', href: '/reference/components/token-budget-bar' },
                ].map((api) => (
                  <Link key={api.name} href={api.href} className={cn('group p-4 rounded-lg border border-border/50', 'hover:border-brand-500/30 hover:shadow-sm transition-all')}>
                    <div className="flex items-center justify-between mb-2"><span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{api.name}</span><span className={cn('text-xs px-2 py-0.5 rounded-full', api.type === 'hook' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400')}>{api.type}</span></div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </Link>
                ))}
              </div>
            </Section>

            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div><h4 className="font-semibold text-foreground mb-2">usage.current always shows 0</h4><p className="text-muted-foreground">Ensure you're calling <code>updateMessages()</code> when your messages change.</p></div>
                <div><h4 className="font-semibold text-foreground mb-2">Warnings not triggering</h4><p className="text-muted-foreground">Check that <code>onWarning</code>, <code>onCritical</code>, and <code>onExceeded</code> callbacks are defined.</p></div>
                <div><h4 className="font-semibold text-foreground mb-2">Auto-trim not working</h4><p className="text-muted-foreground">Ensure <code>autoTrim: true</code> is set and messages have <code>trimmable: true</code>.</p></div>
              </div>
            </Section>

            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/reference/hooks/use-streaming-websocket" className={cn('group flex items-center gap-3 p-4 rounded-lg border border-border/50')}><ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" /><div><div className="text-xs text-muted-foreground mb-1">Previous</div><div className="font-medium text-foreground">useStreamingWebSocket</div></div></Link>
                <Link href="/reference/hooks/use-memory-store" className={cn('group flex items-center gap-3 p-4 rounded-lg border border-border/50', 'text-right')}><div className="flex-1"><div className="text-xs text-muted-foreground mb-1">Next</div><div className="font-medium text-foreground">useMemoryStore</div></div><ChevronRight className="w-5 h-5 text-muted-foreground" /></Link>
              </div>
            </div>
          </main>
          <aside className="hidden xl:block w-64 shrink-0"><TableOfContents /></aside>
        </div>
      </div>
    </div>
  )
}
