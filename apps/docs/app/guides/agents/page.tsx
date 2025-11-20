import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { AgentOrchestrationDiagram } from '@/components/Diagrams/AgentOrchestrationDiagram'

export const metadata: Metadata = {
  title: 'AI Agents Guide - Clarity Chat',
  description:
    'Build AI agents that can use tools, make decisions, and complete multi-step tasks.',
}

export default function AgentsGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>AI Agents & Tool Use</h1>
        <p className="docs-lead">
          Give AI the ability to DO things, not just talk. Agents can call APIs,
          search databases, send emails - anything you can code.
        </p>
      </div>

      <section className="docs-section">
        <h2>Chatbot vs Agent</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 border-2 rounded-xl">
            <div className="font-semibold mb-3">💬 Chatbot (Simple)</div>
            <div className="text-sm space-y-2">
              <div>User: "What's the weather?"</div>
              <div className="text-muted-foreground">
                Bot: "I don't have access to real-time weather data."
              </div>
              <div className="mt-4 text-xs text-destructive">
                ❌ Can only respond with training data
              </div>
            </div>
          </div>

          <div className="p-4 border-2 border-primary/20 bg-primary/5 rounded-xl">
            <div className="font-semibold mb-3">🤖 Agent (Powerful)</div>
            <div className="text-sm space-y-2">
              <div>User: "What's the weather?"</div>
              <div className="text-muted-foreground italic">
                *calls weather API*
              </div>
              <div className="text-muted-foreground">
                Agent: "It's 72°F and sunny in San Francisco."
              </div>
              <div className="mt-4 text-xs text-success">
                ✅ Can take actions and get real data
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="docs-section">
        <h2>How Agents Work</h2>
        <p>The agent loop (ReAct pattern):</p>

        <CodeBlock
          language="text"
          code={`1. THINK: "I need current weather data"
2. ACT: Calls get_weather("San Francisco")
3. OBSERVE: Gets { temp: 72, condition: "sunny" }
4. THINK: "Now I can answer"
5. RESPOND: "It's 72°F and sunny"`}
        />

        <p className="mt-4">
          This loop can repeat multiple times for complex tasks.
        </p>

        <AgentOrchestrationDiagram />
      </section>

      <section className="docs-section">
        <h2>Defining Tools</h2>
        <p>Tell the AI what functions it can call:</p>

        <CodeBlock
          language="typescript"
          code={`const tools = [
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

// The AI can now "see" this function and decide to call it!`}
        />

        <Callout type="tip" title="Description is Critical">
          The AI uses your description to decide WHEN to call the function. Be
          specific: "Get current weather" (good) vs "Weather" (bad).
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Implementing Tool Execution</h2>
        <CodeBlock
          language="typescript"
          code={`// Your actual functions
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>The Agent Loop</h2>
        <CodeBlock
          language="typescript"
          code={`async function runAgent(userQuestion: string) {
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Showing Agent Work to Users</h2>
        <CodeBlock
          language="typescript"
          code={`import { AgentRunFeed } from '@clarity-chat/react'

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
<AgentRunFeed steps={agentSteps} />`}
        />
      </section>

      <section className="docs-section">
        <h2>Safety & Guardrails</h2>

        <h3>1. Require Approval for Dangerous Actions</h3>
        <CodeBlock
          language="typescript"
          code={`const dangerousTools = ['delete_user', 'send_email', 'charge_card']

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
/>`}
        />

        <h3>2. Validate Tool Arguments</h3>
        <CodeBlock
          language="typescript"
          code={`// AI can make mistakes - validate!
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
}`}
        />

        <h3>3. Set Iteration Limits</h3>
        <CodeBlock
          language="typescript"
          code={`// Prevent infinite loops
const MAX_ITERATIONS = 10

if (iterations >= MAX_ITERATIONS) {
  return {
    error: 'Agent exceeded maximum steps',
    message: 'Task too complex. Please simplify your request.'
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Start with 2-3 simple tools, add more gradually</li>
          <li>Write clear, specific tool descriptions</li>
          <li>Validate all tool arguments</li>
          <li>Show agent's work to users (transparency)</li>
          <li>Provide retry for failed tool calls</li>
          <li>Set timeout limits (prevent hanging)</li>
          <li>Log all tool executions for debugging</li>
          <li>Test tools independently before giving to agent</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/agent-with-tools" className="docs-card">
            <h3>Agent Recipe</h3>
            <p>Complete implementation</p>
          </a>
          <a href="/reference/components/agent-run-feed" className="docs-card">
            <h3>Agent Run Feed</h3>
            <p>Show agent steps</p>
          </a>
          <a
            href="/reference/components/tool-invocation-card"
            className="docs-card"
          >
            <h3>Tool Invocation Card</h3>
            <p>Tool approval UI</p>
          </a>
        </div>
      </section>
    </div>
  )
}
