import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { AgentOrchestrationDiagram } from '@/components/Diagrams/AgentOrchestrationDiagram';
export const metadata = {
    title: 'AI Agents Guide - Clarity Chat',
    description: 'Build AI agents that can use tools, make decisions, and complete multi-step tasks.',
};
export default function AgentsGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "AI Agents & Tool Use" }), _jsx("p", { className: "docs-lead", children: "Give AI the ability to DO things, not just talk. Agents can call APIs, search databases, send emails - anything you can code." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Chatbot vs Agent" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 my-6", children: [_jsxs("div", { className: "p-4 border-2 rounded-xl", children: [_jsx("div", { className: "font-semibold mb-3", children: "\uD83D\uDCAC Chatbot (Simple)" }), _jsxs("div", { className: "text-sm space-y-2", children: [_jsx("div", { children: "User: \"What's the weather?\"" }), _jsx("div", { className: "text-muted-foreground", children: "Bot: \"I don't have access to real-time weather data.\"" }), _jsx("div", { className: "mt-4 text-xs text-destructive", children: "\u274C Can only respond with training data" })] })] }), _jsxs("div", { className: "p-4 border-2 border-primary/20 bg-primary/5 rounded-xl", children: [_jsx("div", { className: "font-semibold mb-3", children: "\uD83E\uDD16 Agent (Powerful)" }), _jsxs("div", { className: "text-sm space-y-2", children: [_jsx("div", { children: "User: \"What's the weather?\"" }), _jsx("div", { className: "text-muted-foreground italic", children: "*calls weather API*" }), _jsx("div", { className: "text-muted-foreground", children: "Agent: \"It's 72\u00B0F and sunny in San Francisco.\"" }), _jsx("div", { className: "mt-4 text-xs text-success", children: "\u2705 Can take actions and get real data" })] })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "How Agents Work" }), _jsx("p", { children: "The agent loop (ReAct pattern):" }), _jsx(CodeBlock, { language: "text", code: `1. THINK: "I need current weather data"
2. ACT: Calls get_weather("San Francisco")
3. OBSERVE: Gets { temp: 72, condition: "sunny" }
4. THINK: "Now I can answer"
5. RESPOND: "It's 72°F and sunny"` }), _jsx("p", { className: "mt-4", children: "This loop can repeat multiple times for complex tasks." }), _jsx(AgentOrchestrationDiagram, {})] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Defining Tools" }), _jsx("p", { children: "Tell the AI what functions it can call:" }), _jsx(CodeBlock, { language: "typescript", code: `const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City name'
          }
        },
        required: ['city']
      }
    }
  }
]

// The AI can now "see" this function and decide to call it!` }), _jsx(Callout, { type: "tip", title: "Description is Critical", children: "The AI uses your description to decide WHEN to call the function. Be specific: \"Get current weather\" (good) vs \"Weather\" (bad)." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Implementing Tool Execution" }), _jsx(CodeBlock, { language: "typescript", code: `// Your actual functions
async function executeFunction(name: string, args: any) {
  switch (name) {
    case 'get_weather':
      const response = await fetch(
        \`https://api.weather.com/v3/wx/conditions/current?city=\${args.city}\`
      )
      return await response.json()

    case 'search_database':
      const results = await db.query(args.sql)
      return { rows: results }

    case 'send_email':
      await sendgrid.send({
        to: args.to,
        subject: args.subject,
        body: args.body
      })
      return { sent: true }

    default:
      throw new Error(\`Unknown function: \${name}\`)
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "The Agent Loop" }), _jsx(CodeBlock, { language: "typescript", code: `async function runAgent(userQuestion: string) {
  let messages = [{ role: 'user', content: userQuestion }]
  let iterations = 0
  const maxIterations = 10  // Prevent infinite loops!

  while (iterations < maxIterations) {
    // Ask AI what to do next
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      tools: tools
    })

    const message = response.choices[0].message

    // If AI wants to call a function
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        // Execute the function
        const result = await executeFunction(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments)
        )

        // Add to conversation
        messages.push(message)
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        })
      }
      
      // Loop again - let AI process the results
      iterations++
      continue
    }

    // AI is done - return final answer
    return message.content
  }

  throw new Error('Max iterations reached')
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Showing Agent Work to Users" }), _jsx(CodeBlock, { language: "typescript", code: `import { AgentRunFeed } from '@clarity-chat/react'

// Track each step
const [agentSteps, setAgentSteps] = useState([])

// When agent calls a tool
setAgentSteps(prev => [...prev, {
  id: toolCall.id,
  title: \`Calling \${toolCall.function.name}\`,
  detail: toolCall.function.arguments,
  status: 'running',
  tool: toolCall.function.name,
  startedAt: new Date()
}])

// After execution
setAgentSteps(prev => prev.map(step =>
  step.id === toolCall.id
    ? { ...step, status: 'succeeded', completedAt: new Date() }
    : step
))

// Display
<AgentRunFeed steps={agentSteps} />` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Safety & Guardrails" }), _jsx("h3", { children: "1. Require Approval for Dangerous Actions" }), _jsx(CodeBlock, { language: "typescript", code: `const dangerousTools = ['delete_user', 'send_email', 'charge_card']

if (dangerousTools.includes(toolCall.function.name)) {
  // Ask user to approve
  const approved = await askUserApproval(toolCall)
  if (!approved) {
    return { error: 'User rejected action' }
  }
}

// In UI
import { ToolInvocationCard } from '@clarity-chat/react'

<ToolInvocationCard
  toolCall={toolCall}
  requiresApproval={true}
  onApprove={(tool) => executeFunction(tool)}
  onReject={(tool) => cancelExecution(tool)}
/>` }), _jsx("h3", { children: "2. Validate Tool Arguments" }), _jsx(CodeBlock, { language: "typescript", code: `// AI can make mistakes - validate!
function executeFunction(name: string, args: any) {
  if (name === 'send_email') {
    // Validate email
    if (!isValidEmail(args.to)) {
      throw new Error('Invalid email address')
    }
    // Prevent sending to external domains
    if (!args.to.endsWith('@yourcompany.com')) {
      throw new Error('Can only email internal users')
    }
  }
  
  // Validate SQL to prevent injection
  if (name === 'query_database') {
    if (args.sql.toLowerCase().includes('drop')) {
      throw new Error('DROP statements not allowed')
    }
  }
  
  // Execute
  return actuallyExecute(name, args)
}` }), _jsx("h3", { children: "3. Set Iteration Limits" }), _jsx(CodeBlock, { language: "typescript", code: `// Prevent infinite loops
const MAX_ITERATIONS = 10

if (iterations >= MAX_ITERATIONS) {
  return {
    error: 'Agent exceeded maximum steps',
    message: 'Task too complex. Please simplify your request.'
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Start with 2-3 simple tools, add more gradually" }), _jsx("li", { children: "Write clear, specific tool descriptions" }), _jsx("li", { children: "Validate all tool arguments" }), _jsx("li", { children: "Show agent's work to users (transparency)" }), _jsx("li", { children: "Provide retry for failed tool calls" }), _jsx("li", { children: "Set timeout limits (prevent hanging)" }), _jsx("li", { children: "Log all tool executions for debugging" }), _jsx("li", { children: "Test tools independently before giving to agent" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/agent-with-tools", className: "docs-card", children: [_jsx("h3", { children: "Agent Recipe" }), _jsx("p", { children: "Complete implementation" })] }), _jsxs("a", { href: "/reference/components/agent-run-feed", className: "docs-card", children: [_jsx("h3", { children: "Agent Run Feed" }), _jsx("p", { children: "Show agent steps" })] }), _jsxs("a", { href: "/reference/components/tool-invocation-card", className: "docs-card", children: [_jsx("h3", { children: "Tool Invocation Card" }), _jsx("p", { children: "Tool approval UI" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map