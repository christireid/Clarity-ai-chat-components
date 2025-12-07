import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ApiTable } from '@/components/Demo/ApiTable';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'useModelRouter - Clarity Chat Hooks',
    description: 'Intelligently route requests to different models based on cost, latency, and quality.',
};
export default function UseModelRouterPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Hook" }), _jsx("h1", { children: "useModelRouter" }), _jsx("p", { className: "docs-lead", children: "Route requests to optimal models based on complexity, cost, and performance requirements." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["The ", _jsx("code", { children: "useModelRouter" }), " hook automatically selects the best model for each request based on configurable routing rules, balancing cost, speed, and quality."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Basic Usage" }), _jsx(CodePlayground, { initialCode: `function Chat() {
  const { route, currentModel } = useModelRouter({
    models: [
      { name: 'gpt-4', cost: 0.03, maxTokens: 8192, quality: 'high' },
      { name: 'gpt-3.5-turbo', cost: 0.001, maxTokens: 4096, quality: 'medium' },
      { name: 'claude-3-haiku', cost: 0.00025, maxTokens: 200000, quality: 'medium' }
    ],
    strategy: 'cost-optimized'
  })

  const handleSend = async (message: string) => {
    const model = await route(message)
    console.log(\`Using model: \${model.name}\`)
    // Use selected model for request
  }

  return <div>Current: {currentModel}</div>
}

render(<Chat />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Complexity-Based Routing" }), _jsx(CodePlayground, { initialCode: `function SmartChat() {
  const { route } = useModelRouter({
    models: [
      { name: 'gpt-4', quality: 'high', cost: 0.03 },
      { name: 'gpt-3.5-turbo', quality: 'medium', cost: 0.001 }
    ],
    strategy: 'complexity-based',
    complexityThreshold: 0.7,  // 0-1 scale
    complexityIndicators: [
      'code generation',
      'mathematical reasoning',
      'multi-step planning',
      'creative writing'
    ]
  })

  return <ChatWindow onRoute={route} />
}

render(<SmartChat />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Props" }), _jsx(ApiTable, { title: "useModelRouter Parameters", data: hookParams })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Routing Strategies" }), _jsx("h3", { children: "Cost-Optimized" }), _jsx("p", { children: "Use cheapest model that meets quality requirements:" }), _jsx("pre", { children: _jsx("code", { children: `{
  strategy: 'cost-optimized',
  qualityThreshold: 0.8  // Minimum acceptable quality
}` }) }), _jsx("h3", { children: "Latency-Optimized" }), _jsx("p", { children: "Use fastest model:" }), _jsx("pre", { children: _jsx("code", { children: `{
  strategy: 'latency-optimized',
  maxLatencyMs: 2000
}` }) }), _jsx("h3", { children: "Quality-Optimized" }), _jsx("p", { children: "Use highest quality model:" }), _jsx("pre", { children: _jsx("code", { children: `{
  strategy: 'quality-optimized',
  maxCostPer1kTokens: 0.05  // Cost ceiling
}` }) }), _jsx("h3", { children: "Complexity-Based" }), _jsx("p", { children: "Route based on task complexity:" }), _jsx("pre", { children: _jsx("code", { children: `{
  strategy: 'complexity-based',
  simpleTaskModel: 'gpt-3.5-turbo',
  complexTaskModel: 'gpt-4',
  complexityThreshold: 0.7
}` }) }), _jsx("h3", { children: "Custom Rules" }), _jsx("p", { children: "Define custom routing logic:" }), _jsx("pre", { children: _jsx("code", { children: `{
  strategy: 'custom',
  routingFn: async (message, models) => {
    if (message.includes('translate')) {
      return models.find(m => m.name === 'gpt-4')
    }
    if (message.length < 100) {
      return models.find(m => m.cost < 0.001)
    }
    return models.find(m => m.quality === 'high')
  }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Example" }), _jsx("pre", { children: _jsx("code", { children: `import { useModelRouter } from '@clarity-chat/react/hooks'

function ProductionChat() {
  const { route, stats, override } = useModelRouter({
    models: [
      {
        name: 'gpt-4-turbo',
        cost: 0.01,
        latencyMs: 1500,
        quality: 0.95,
        contextWindow: 128000
      },
      {
        name: 'gpt-3.5-turbo',
        cost: 0.0015,
        latencyMs: 800,
        quality: 0.85,
        contextWindow: 16385
      },
      {
        name: 'claude-3-haiku',
        cost: 0.00025,
        latencyMs: 500,
        quality: 0.80,
        contextWindow: 200000
      }
    ],
    strategy: 'adaptive',
    
    // Fallback chain
    fallbacks: [
      { from: 'gpt-4-turbo', to: 'gpt-3.5-turbo' },
      { from: 'gpt-3.5-turbo', to: 'claude-3-haiku' }
    ],
    
    // A/B testing
    experimentalRouting: {
      enabled: true,
      trafficSplit: { 'gpt-4-turbo': 0.2, 'gpt-3.5-turbo': 0.8 }
    },
    
    // Budget constraints
    budget: {
      maxCostPerUser: 10.0,
      maxCostPerDay: 1000.0,
      onBudgetExceeded: (user) => {
        console.warn(\`Budget exceeded for \${user}\`)
      }
    },
    
    // Monitoring
    onRoute: (model, message, decision) => {
      analytics.track('model_routed', {
        model: model.name,
        reason: decision.reason,
        estimatedCost: decision.estimatedCost
      })
    }
  })

  // Manual override for specific cases
  const handleSend = async (message: string) => {
    const model = message.startsWith('/gpt4')
      ? override('gpt-4-turbo')
      : await route(message)
    
    // Send with selected model
  }

  return (
    <div>
      <div className="stats">
        <p>Total cost: \${stats.totalCost.toFixed(4)}</p>
        <p>Avg latency: {stats.avgLatency}ms</p>
        <p>Model usage: {JSON.stringify(stats.modelUsage)}</p>
      </div>
      <ChatWindow onSend={handleSend} />
    </div>
  )
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Start with cost-optimized strategy and monitor quality metrics" }), _jsx("li", { children: "Set up fallback chains for reliability" }), _jsx("li", { children: "Track routing decisions for analysis and optimization" }), _jsx("li", { children: "A/B test different strategies with a subset of traffic" }), _jsx("li", { children: "Set budget limits to prevent runaway costs" }), _jsx("li", { children: "Cache routing decisions for similar queries" }), _jsx("li", { children: "Consider context window limits when routing long conversations" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/hooks/use-token-optimization", className: "docs-card", children: [_jsx("h3", { children: "useTokenOptimization" }), _jsx("p", { children: "Reduce token usage" })] }), _jsxs("a", { href: "/reference/components/usage-dashboard", className: "docs-card", children: [_jsx("h3", { children: "UsageDashboard" }), _jsx("p", { children: "Monitor costs" })] })] })] })] }));
}
const hookParams = [
    {
        name: 'config',
        type: 'ModelRouterConfig',
        required: true,
        description: 'Router configuration'
    },
    {
        name: 'config.models',
        type: 'Model[]',
        required: true,
        description: 'Available models'
    },
    {
        name: 'config.strategy',
        type: "'cost-optimized' | 'latency-optimized' | 'quality-optimized' | 'complexity-based' | 'adaptive' | 'custom'",
        required: true,
        description: 'Routing strategy'
    },
    {
        name: 'config.fallbacks',
        type: 'Fallback[]',
        required: false,
        description: 'Fallback model chain'
    },
    {
        name: 'config.budget',
        type: 'BudgetConfig',
        required: false,
        description: 'Cost constraints'
    },
    {
        name: 'config.onRoute',
        type: '(model: Model, message: string, decision: Decision) => void',
        required: false,
        description: 'Callback after routing decision'
    }
];
//# sourceMappingURL=page.js.map