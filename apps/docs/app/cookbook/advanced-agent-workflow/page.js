import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Advanced Agent Workflow - Cookbook',
    description: 'Build multi-step agent workflows with tool calling and decision trees.',
};
export default function AdvancedAgentWorkflowCookbook() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Advanced Agent Workflow" }), _jsx("p", { className: "docs-lead", children: "Create sophisticated AI agents with tool calling, parallel execution, and error recovery." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Build agents that can use multiple tools, reason about their actions, and execute complex multi-step workflows with proper error handling." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Complete Example" }), _jsx(CodePlayground, { initialCode: `function ResearchAgent() {
  const tools = [
    {
      name: 'web_search',
      description: 'Search the web for information',
      parameters: {
        query: { type: 'string', required: true }
      }
    },
    {
      name: 'calculator',
      description: 'Perform calculations',
      parameters: {
        expression: { type: 'string', required: true }
      }
    },
    {
      name: 'get_weather',
      description: 'Get weather for a location',
      parameters: {
        location: { type: 'string', required: true }
      }
    }
  ]

  const { messages, isRunning, currentStep, sendMessage } = useAgent({
    endpoint: '/api/agent',
    tools,
    maxIterations: 10,
    onToolCall: (tool, args) => {
      console.log(\`Calling \${tool}:\`, args)
    }
  })

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isRunning}
        />
      </div>
      <div>
        <AgentRunFeed
          currentStep={currentStep}
          showLogs={true}
        />
      </div>
    </div>
  )
}

render(<ResearchAgent />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Agent API Implementation" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/agent/route.ts
import { ReactAgent } from '@clarity-chat/react/agents'
import { tools } from './tools'

export async function POST(req: Request) {
  const { messages, userId } = await req.json()
  
  const agent = new ReactAgent({
    model: 'gpt-4',
    tools,
    maxIterations: 10,
    systemPrompt: \`You are a helpful research assistant.
Think step by step and use tools when needed.\`
  })
  
  try {
    const result = await agent.run({
      input: messages[messages.length - 1].content,
      userId
    })
    
    return Response.json({
      message: result.output,
      steps: result.steps,
      toolCalls: result.toolCalls
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Tool Definitions" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/agent/tools.ts
export const tools = {
  web_search: async ({ query }: { query: string }) => {
    const response = await fetch(
      \`https://api.tavily.com/search\`,
      {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { 
          'Authorization': \`Bearer \${process.env.TAVILY_API_KEY}\` 
        }
      }
    )
    const data = await response.json()
    return data.results.slice(0, 5).map(r => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet
    }))
  },

  calculator: async ({ expression }: { expression: string }) => {
    // Safe eval implementation
    const result = evalMathExpression(expression)
    return { result, expression }
  },

  get_weather: async ({ location }: { location: string }) => {
    const response = await fetch(
      \`https://api.openweathermap.org/data/2.5/weather?q=\${location}\`,
      { headers: { 'X-API-Key': process.env.WEATHER_API_KEY } }
    )
    return await response.json()
  }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Parallel Tool Execution" }), _jsx(Callout, { type: "tip", title: "Performance", children: "Execute independent tool calls in parallel to reduce total latency." }), _jsx("pre", { children: _jsx("code", { children: `const agent = new ReactAgent({
  model: 'gpt-4',
  tools,
  parallelExecution: true, // Enable parallel tool calls
  maxConcurrency: 3 // Limit concurrent tools
})

// The agent will automatically parallelize independent tool calls
const result = await agent.run({
  input: 'Get weather for SF, NYC, and Boston'
})
// All 3 weather calls execute in parallel` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Error Recovery" }), _jsx("pre", { children: _jsx("code", { children: `const agent = new ReactAgent({
  model: 'gpt-4',
  tools,
  errorRecovery: {
    maxRetries: 3,
    backoffMs: 1000,
    fallbackStrategy: 'skip' // or 'retry', 'fail'
  },
  onError: (error, toolName, attempt) => {
    console.error(\`Tool \${toolName} failed (attempt \${attempt}):\`, error)
  }
})` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Provide clear, specific tool descriptions for better agent reasoning" }), _jsxs("li", { children: ["Set ", _jsx("code", { children: "maxIterations" }), " to prevent infinite loops"] }), _jsx("li", { children: "Implement timeout and rate limiting for tool calls" }), _jsx("li", { children: "Log all tool executions for debugging and audit trails" }), _jsx("li", { children: "Use parallel execution for independent tools" }), _jsx("li", { children: "Handle partial failures gracefully with fallback strategies" }), _jsx("li", { children: "Validate tool parameters before execution" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Recipes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/agent-with-tools", className: "docs-card", children: [_jsx("h3", { children: "Simple Agent with Tools" }), _jsx("p", { children: "Getting started with agents" })] }), _jsxs("a", { href: "/guides/agents", className: "docs-card", children: [_jsx("h3", { children: "Agent Guide" }), _jsx("p", { children: "Complete agent documentation" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map