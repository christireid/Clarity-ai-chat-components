import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { ArrowLeft, Cpu } from 'lucide-react';
export const metadata = {
    title: 'AI Agents Workflow Example',
    description: 'Multi-agent orchestration with custom tools and task decomposition',
};
export default function AIAgentsWorkflowPage() {
    return (_jsxs("div", { className: "container-docs py-12", children: [_jsxs(Link, { href: "/examples", className: "inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Examples"] }), _jsxs("div", { className: "max-w-4xl", children: [_jsxs("div", { className: "flex items-start gap-4 mb-8", children: [_jsx("div", { className: "p-3 bg-gradient-to-br from-violet-500 to-purple-500 text-white rounded-xl", children: _jsx(Cpu, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-5xl font-bold mb-4", children: "AI Agents Workflow" }), _jsx("p", { className: "text-xl text-text-secondary", children: "Multi-agent orchestration system for complex task automation" })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-8", children: [_jsx("span", { className: "px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium", children: "Advanced" }), _jsx("span", { className: "px-3 py-1 bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 rounded-full text-sm", children: "Multi-Agent" })] }), _jsxs("div", { className: "prose prose-lg dark:prose-invert max-w-none", children: [_jsx("h2", { children: "\u2728 Features" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Agent Orchestration" }), " - Coordinate multiple specialized agents"] }), _jsxs("li", { children: [_jsx("strong", { children: "Custom Tools" }), " - Define domain-specific agent capabilities"] }), _jsxs("li", { children: [_jsx("strong", { children: "Task Decomposition" }), " - Break complex tasks into subtasks"] }), _jsxs("li", { children: [_jsx("strong", { children: "Agent Memory" }), " - Shared context across agents"] }), _jsxs("li", { children: [_jsx("strong", { children: "Tool Invocation Tracking" }), " - Monitor agent actions in real-time"] }), _jsxs("li", { children: [_jsx("strong", { children: "Error Recovery" }), " - Automatic retry and fallback strategies"] })] }), _jsx("h2", { children: "\uD83E\uDD16 Agent Types" }), _jsx("div", { className: "grid md:grid-cols-3 gap-4 not-prose my-6", children: [
                                    { name: 'Researcher', icon: '🔍', description: 'Gathers information from multiple sources' },
                                    { name: 'Analyst', icon: '📊', description: 'Analyzes data and identifies patterns' },
                                    { name: 'Strategist', icon: '🎯', description: 'Creates actionable plans and strategies' },
                                    { name: 'Writer', icon: '✍️', description: 'Generates content and documentation' },
                                    { name: 'Reviewer', icon: '👁️', description: 'Quality checks and validation' },
                                    { name: 'Executor', icon: '⚡', description: 'Performs actions and API calls' },
                                ].map((agent) => (_jsxs("div", { className: "p-4 border border-border rounded-lg", children: [_jsx("div", { className: "text-3xl mb-2", children: agent.icon }), _jsx("h3", { className: "font-semibold mb-1", children: agent.name }), _jsx("p", { className: "text-sm text-text-secondary", children: agent.description })] }, agent.name))) }), _jsx("h2", { children: "\uD83D\uDCAC Example Workflow" }), _jsx("h3", { children: "Sales Strategy Creation" }), _jsxs("div", { className: "bg-surface-elevated p-6 rounded-lg border border-border not-prose mb-6", children: [_jsx("p", { className: "font-medium mb-4", children: "\uD83D\uDC64 User: \"Analyze our sales and create a marketing strategy\"" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold", children: "1" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sm mb-1", children: "\uD83D\uDCCA Data Analyst Agent" }), _jsx("div", { className: "text-sm text-text-secondary", children: "Analyzes sales data \u2192 Revenue \u219115% YoY, Top products identified" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold", children: "2" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sm mb-1", children: "\uD83D\uDD0D Market Research Agent" }), _jsx("div", { className: "text-sm text-text-secondary", children: "Studies competitors \u2192 Pricing analyzed, growth opportunities found" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold", children: "3" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-sm mb-1", children: "\uD83C\uDFAF Strategy Agent" }), _jsx("div", { className: "text-sm text-text-secondary", children: "Generates strategy \u2192 3 campaigns with ROI projections" })] })] }), _jsx("div", { className: "mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800", children: _jsx("div", { className: "text-sm font-medium text-green-800 dark:text-green-200", children: "\u2705 Complete: Marketing strategy with projected 30% revenue increase" }) })] })] }), _jsx("h2", { children: "\uD83C\uDFD7\uFE0F Implementation" }), _jsx("h3", { children: "Define Agents" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `import { createAgent } from '@clarity-chat/react'

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
})` }) }), _jsx("h3", { children: "Orchestrate Workflow" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `const result = await orchestrator.run({
  task: 'Create marketing strategy',
  agents: [dataAnalyst, researcher, strategist],
  workflow: 'sequential', // or 'parallel', 'hierarchical'
  context: { salesData, budget: 10000 }
})

console.log(result.strategy)
console.log(result.agentChain) // Shows which agents ran` }) }), _jsx("h2", { children: "\uD83D\uDEE0\uFE0F Custom Tools" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `const customTools = [
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
]` }) }), _jsx("h2", { children: "\uD83D\uDCC8 Benefits" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Specialization" }), " - Each agent excels at specific tasks"] }), _jsxs("li", { children: [_jsx("strong", { children: "Scalability" }), " - Add more agents without complexity"] }), _jsxs("li", { children: [_jsx("strong", { children: "Reliability" }), " - Redundancy and fallback options"] }), _jsxs("li", { children: [_jsx("strong", { children: "Transparency" }), " - See exactly what each agent does"] })] }), _jsx("h2", { children: "\uD83D\uDD17 Related Resources" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx(Link, { href: "/guides/agents", className: "text-brand-600 dark:text-brand-400 hover:underline", children: "AI Agents Guide" }), ' ', "- Complete agent documentation"] }), _jsxs("li", { children: [_jsx(Link, { href: "/reference/components/tool-invocation-card", className: "text-brand-600 dark:text-brand-400 hover:underline", children: "Tool Invocation Card" }), ' ', "- Display agent actions"] })] })] }), _jsxs("div", { className: "mt-12 p-8 bg-gradient-to-r from-brand-50 to-violet-50 dark:from-brand-950 dark:to-violet-950 rounded-xl border border-brand-200 dark:border-brand-800", children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "\uD83E\uDD16 Build Multi-Agent Systems" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Create sophisticated AI workflows with coordinated agents." }), _jsx("a", { href: "https://github.com/clarity-chat/ui/tree/main/examples/ai-agents-workflow", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors", children: "Explore Full Example \u2192" })] })] })] }));
}
//# sourceMappingURL=page.js.map