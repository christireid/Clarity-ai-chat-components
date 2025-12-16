import { logger } from '@clarity-chat/utils/logger';
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Cpu, Workflow, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Agents Workflow Example',
  description: 'Multi-agent orchestration with custom tools and task decomposition',
}

export default function AIAgentsWorkflowPage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-4xl">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 text-white rounded-xl">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">AI Agents Workflow</h1>
            <p className="text-xl text-text-secondary">
              Multi-agent orchestration system for complex task automation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
            Advanced
          </span>
          <span className="px-3 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 rounded-full text-sm">
            Multi-Agent
          </span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Agent Orchestration</strong> - Coordinate multiple specialized agents
            </li>
            <li>
              <strong>Custom Tools</strong> - Define domain-specific agent capabilities
            </li>
            <li>
              <strong>Task Decomposition</strong> - Break complex tasks into subtasks
            </li>
            <li>
              <strong>Agent Memory</strong> - Shared context across agents
            </li>
            <li>
              <strong>Tool Invocation Tracking</strong> - Monitor agent actions in real-time
            </li>
            <li>
              <strong>Error Recovery</strong> - Automatic retry and fallback strategies
            </li>
          </ul>

          <h2>🤖 Agent Types</h2>
          <div className="grid md:grid-cols-3 gap-4 not-prose my-6">
            {[
              { name: 'Researcher', icon: '🔍', description: 'Gathers information from multiple sources' },
              { name: 'Analyst', icon: '📊', description: 'Analyzes data and identifies patterns' },
              { name: 'Strategist', icon: '🎯', description: 'Creates actionable plans and strategies' },
              { name: 'Writer', icon: '✍️', description: 'Generates content and documentation' },
              { name: 'Reviewer', icon: '👁️', description: 'Quality checks and validation' },
              { name: 'Executor', icon: '⚡', description: 'Performs actions and API calls' },
            ].map((agent) => (
              <div key={agent.name} className="p-4 border border-border rounded-lg">
                <div className="text-3xl mb-2">{agent.icon}</div>
                <h3 className="font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-text-secondary">{agent.description}</p>
              </div>
            ))}
          </div>

          <h2>💬 Example Workflow</h2>

          <h3>Sales Strategy Creation</h3>
          <div className="bg-surface-elevated p-6 rounded-lg border border-border not-prose mb-6">
            <p className="font-medium mb-4">👤 User: "Analyze our sales and create a marketing strategy"</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">📊 Data Analyst Agent</div>
                  <div className="text-sm text-text-secondary">
                    Analyzes sales data → Revenue ↑15% YoY, Top products identified
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">🔍 Market Research Agent</div>
                  <div className="text-sm text-text-secondary">
                    Studies competitors → Pricing analyzed, growth opportunities found
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">🎯 Strategy Agent</div>
                  <div className="text-sm text-text-secondary">
                    Generates strategy → 3 campaigns with ROI projections
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                <div className="text-sm font-medium text-green-800 dark:text-green-200">
                  ✅ Complete: Marketing strategy with projected 30% revenue increase
                </div>
              </div>
            </div>
          </div>

          <h2>🏗️ Implementation</h2>

          <h3>Define Agents</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`import { createAgent } from '@clarity-chat/react'

const dataAnalyst = createAgent({
  name: 'data-analyst',
  role: 'Analyze data and identify trends',
  tools: ['query_database', 'create_chart', 'statistical_analysis'],
  model: 'gpt-4'
})

const strategist = createAgent({
  name: 'strategist',
  role: 'Create actionable strategies',
  tools: ['market_research', 'competitor_analysis', 'swot_analysis'],
  model: 'gpt-4'
})`}</code>
          </pre>

          <h3>Orchestrate Workflow</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`const result = await orchestrator.run({
  task: 'Create marketing strategy',
  agents: [dataAnalyst, researcher, strategist],
  workflow: 'sequential', // or 'parallel', 'hierarchical'
  context: { salesData, budget: 10000 }
})

logger.debug(result.strategy)
logger.debug(result.agentChain) // Shows which agents ran`}</code>
          </pre>

          <h2>🛠️ Custom Tools</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`const customTools = [
  {
    name: 'analyze_sales_data',
    description: 'Analyze sales metrics and trends',
    parameters: {
      timeRange: 'string',
      metrics: 'array'
    },
    execute: async (params) => {
      const data = await fetchSalesData(params)
      return analyzeData(data)
    }
  },
  {
    name: 'send_email_campaign',
    description: 'Create and send marketing emails',
    parameters: {
      segment: 'string',
      template: 'string',
      schedule: 'date'
    },
    execute: async (params) => {
      return await emailService.send(params)
    }
  }
]`}</code>
          </pre>

          <h2>📈 Benefits</h2>
          <ul>
            <li>
              <strong>Specialization</strong> - Each agent excels at specific tasks
            </li>
            <li>
              <strong>Scalability</strong> - Add more agents without complexity
            </li>
            <li>
              <strong>Reliability</strong> - Redundancy and fallback options
            </li>
            <li>
              <strong>Transparency</strong> - See exactly what each agent does
            </li>
          </ul>

          <h2>🔗 Related Resources</h2>
          <ul>
            <li>
              <Link href="/guides/agents" className="text-brand-600 dark:text-brand-400 hover:underline">
                AI Agents Guide
              </Link>{' '}
              - Complete agent documentation
            </li>
            <li>
              <Link href="/reference/components/tool-invocation-card" className="text-brand-600 dark:text-brand-400 hover:underline">
                Tool Invocation Card
              </Link>{' '}
              - Display agent actions
            </li>
          </ul>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-violet-50 dark:from-brand-950 dark:to-violet-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h3 className="text-2xl font-bold mb-4">🤖 Build Multi-Agent Systems</h3>
          <p className="text-text-secondary mb-6">
            Create sophisticated AI workflows with coordinated agents.
          </p>
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/ai-agents-workflow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
          >
            Explore Full Example →
          </a>
        </div>
      </div>
    </div>
  )
}

