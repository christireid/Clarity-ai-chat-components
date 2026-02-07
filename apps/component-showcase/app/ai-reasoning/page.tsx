'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import { aiReasoningDocs } from '@/data/docs/ai-reasoning-docs'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Search,
  Code,
  FileText,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Eye,
  EyeOff,
  Layers,
  GitBranch,
  Target,
  Sparkles,
} from 'lucide-react'

// ============================================================================
// THINKING INDICATOR DEMO
// ============================================================================
function ThinkingIndicatorDemo() {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Thinking Indicators</CardTitle>
        <CardDescription>Show AI reasoning in progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pulsing Brain */}
          <div>
            <h4 className="text-sm font-medium mb-3">Pulsing Brain</h4>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg w-fit">
              <div className="relative">
                <Brain className="h-6 w-6 text-primary" />
                <span className="absolute inset-0 animate-ping">
                  <Brain className="h-6 w-6 text-primary/30" />
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                AI is thinking...
              </span>
            </div>
          </div>

          {/* Thinking Bar */}
          <div>
            <h4 className="text-sm font-medium mb-3">Thinking Progress Bar</h4>
            <div className="space-y-2 p-4 bg-muted/50 rounded-lg max-w-md">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary animate-pulse" />
                  Analyzing your request
                </span>
                <span className="text-muted-foreground">2s</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full animate-pulse"
                  style={{ width: '60%' }}
                />
              </div>
            </div>
          </div>

          {/* Step Progress */}
          <div>
            <h4 className="text-sm font-medium mb-3">Step-by-Step Progress</h4>
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg max-w-md">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Understanding context</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Analyzing requirements</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Generating response...
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Formatting output</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CHAIN OF THOUGHT DEMO
// ============================================================================
function ChainOfThoughtDemo() {
  const [expanded, setExpanded] = useState<string[]>(['step-1'])

  const toggleExpand = (step: string) => {
    setExpanded((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    )
  }

  const steps = [
    {
      id: 'step-1',
      title: 'Understanding the Question',
      status: 'complete',
      content:
        'The user is asking about React hooks, specifically how useState works with complex objects.',
      duration: '0.3s',
    },
    {
      id: 'step-2',
      title: 'Retrieving Relevant Knowledge',
      status: 'complete',
      content:
        'Found 5 relevant code examples and documentation references about useState with objects and arrays.',
      duration: '0.8s',
    },
    {
      id: 'step-3',
      title: 'Analyzing Code Patterns',
      status: 'complete',
      content:
        'Identified best practices: immutable updates, spread operators, and functional updates for complex state.',
      duration: '1.2s',
    },
    {
      id: 'step-4',
      title: 'Formulating Response',
      status: 'active',
      content:
        'Combining examples with explanations to create a comprehensive answer...',
      duration: '...',
    },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Chain of Thought</CardTitle>
        <CardDescription>
          Visualize the AI&apos;s reasoning process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.id}>
              <button className="w-full" onClick={() => toggleExpand(step.id)}>
                <div
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-colors',
                    step.status === 'active'
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50 hover:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {step.status === 'complete' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                    )}
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  <div className="flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {step.duration}
                  </span>
                  {expanded.includes(step.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>
              {expanded.includes(step.id) && (
                <div className="pl-9 pr-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    {step.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// AGENT PANEL DEMO
// ============================================================================
function AgentPanelDemo() {
  const agents = [
    {
      id: 'researcher',
      name: 'Research Agent',
      icon: <Search className="h-4 w-4" />,
      status: 'active',
      task: 'Searching documentation...',
    },
    {
      id: 'coder',
      name: 'Code Agent',
      icon: <Code className="h-4 w-4" />,
      status: 'waiting',
      task: 'Ready to generate code',
    },
    {
      id: 'writer',
      name: 'Writer Agent',
      icon: <FileText className="h-4 w-4" />,
      status: 'idle',
      task: 'Waiting for input',
    },
  ]

  const tools = [
    { name: 'web_search', calls: 3, status: 'success' },
    { name: 'read_file', calls: 5, status: 'success' },
    { name: 'write_code', calls: 2, status: 'pending' },
  ]

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Agent Panel</CardTitle>
        <CardDescription>Multi-agent orchestration view</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Agents */}
          <div>
            <h4 className="text-sm font-medium mb-3">Active Agents</h4>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border',
                    agent.status === 'active' && 'border-primary bg-primary/5'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      agent.status === 'active'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {agent.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          agent.status === 'active' &&
                            'bg-green-500/20 text-green-600'
                        )}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {agent.task}
                    </p>
                  </div>
                  {agent.status === 'active' && (
                    <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-medium mb-3">Tool Usage</h4>
            <div className="space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-mono flex-1">{tool.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tool.calls} calls
                  </Badge>
                  {tool.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// THINKING BLOCK DEMO
// ============================================================================
function ThinkingBlockDemo() {
  const [showThinking, setShowThinking] = useState(true)

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Thinking Block</CardTitle>
            <CardDescription>Expandable reasoning section</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowThinking(!showThinking)}
            className="gap-2"
          >
            {showThinking ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showThinking ? 'Hide' : 'Show'} Thinking
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showThinking && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Thinking
                </span>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Let me analyze this step by step:</p>
                <ol className="list-decimal list-inside space-y-1 pl-2">
                  <li>
                    First, I need to understand the user&apos;s requirements
                  </li>
                  <li>The question involves React state management</li>
                  <li>I should provide a practical example</li>
                  <li>Include best practices and common pitfalls</li>
                </ol>
              </div>
            </div>
          )}

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              Here&apos;s the response after thinking through the problem...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// REASONING TREE DEMO
// ============================================================================
function ReasoningTreeDemo() {
  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle className="text-lg">Reasoning Tree</CardTitle>
        <CardDescription>Branching thought visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="space-y-4">
            {/* Root Node */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">
                User Query: &quot;How to optimize React renders?&quot;
              </span>
            </div>

            {/* Branches */}
            <div className="pl-4 border-l-2 border-muted-foreground/20 ml-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <GitBranch className="h-3 w-3 text-blue-500" />
                </div>
                <div>
                  <span className="text-sm font-medium">Branch 1: useMemo</span>
                  <p className="text-xs text-muted-foreground">
                    Memoize expensive calculations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center mt-0.5">
                  <GitBranch className="h-3 w-3 text-green-500" />
                </div>
                <div>
                  <span className="text-sm font-medium">
                    Branch 2: useCallback
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Prevent unnecessary function recreations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center mt-0.5">
                  <GitBranch className="h-3 w-3 text-purple-500" />
                </div>
                <div>
                  <span className="text-sm font-medium">
                    Branch 3: React.memo
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Skip re-renders for unchanged props
                  </p>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">
                Synthesized Answer Ready
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function AIReasoningPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-violet -top-40 -left-40 opacity-30" />
        <div className="orb-primary bottom-20 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="AI & Reasoning"
        description="Thinking indicators, chain of thought, and agent panels"
        icon={Brain}
        badge="15+ Components"
      />

      <Tabs defaultValue="thinking" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger
            value="thinking"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Brain className="h-4 w-4" />
            Thinking Indicators
          </TabsTrigger>
          <TabsTrigger
            value="chain"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Layers className="h-4 w-4" />
            Chain of Thought
          </TabsTrigger>
          <TabsTrigger
            value="agents"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Zap className="h-4 w-4" />
            Agent Panel
          </TabsTrigger>
          <TabsTrigger
            value="blocks"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Eye className="h-4 w-4" />
            Thinking Blocks
          </TabsTrigger>
          <TabsTrigger
            value="tree"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <GitBranch className="h-4 w-4" />
            Reasoning Tree
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thinking">
          <ComponentSection
            title="Thinking Indicators"
            description="Various styles of AI thinking visualizations"
            icon={Brain}
            docs={aiReasoningDocs['Thinking Indicators']}
          >
            <ThinkingIndicatorDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="chain">
          <ComponentSection
            title="Chain of Thought"
            description="Step-by-step reasoning visualization"
            icon={Layers}
            docs={aiReasoningDocs['Chain of Thought']}
          >
            <ChainOfThoughtDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="agents">
          <ComponentSection
            title="Agent Panel"
            description="Multi-agent system monitoring"
            icon={Zap}
            docs={aiReasoningDocs['Agent Panel']}
          >
            <AgentPanelDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="blocks">
          <ComponentSection
            title="Thinking Blocks"
            description="Toggleable reasoning sections"
            icon={Eye}
            docs={aiReasoningDocs['Thinking Blocks']}
          >
            <ThinkingBlockDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tree">
          <ComponentSection
            title="Reasoning Tree"
            description="Branching thought visualization"
            icon={GitBranch}
            docs={aiReasoningDocs['Reasoning Tree']}
          >
            <ReasoningTreeDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
