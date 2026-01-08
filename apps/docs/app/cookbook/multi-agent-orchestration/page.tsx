import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Multi-Agent Orchestration Recipe - Clarity Chat Components',
  description:
    'Build multi-agent systems with agent orchestration, tool coordination, and agent communication.',
}

export default function MultiAgentOrchestrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Multi-Agent Orchestration</h1>
        <p className="docs-lead">
          Build multi-agent systems with agent orchestration, tool coordination,
          agent communication, and result aggregation.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Create multiple agents',
          'Orchestrate agent workflows',
          'Coordinate tool usage',
          'Handle agent communication',
          'Aggregate agent results',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This recipe shows how to build multi-agent systems where multiple AI
          agents work together to solve complex tasks.
        </p>
      </section>

      <section className="docs-section">
        <h2>Agent Creation</h2>
        <p>Create multiple specialized agents:</p>
        <CodePlayground
          initialCode={`import { createAgent } from '@clarity-chat/react/internal'

// Research agent
const researchAgent = createAgent({
  name: 'Researcher',
  role: 'Research and gather information',
  tools: [webSearch, documentAnalysis],
})

// Analysis agent
const analysisAgent = createAgent({
  name: 'Analyst',
  role: 'Analyze and synthesize information',
  tools: [dataAnalysis, chartGeneration],
})

// Writing agent
const writingAgent = createAgent({
  name: 'Writer',
  role: 'Write and format content',
  tools: [markdownFormatter, grammarChecker],
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Agent Orchestration</h2>
        <p>Orchestrate agents in a workflow:</p>
        <CodePlayground
          initialCode={`import { createAgent } from '@clarity-chat/react/internal'

async function orchestrateAgents(query: string) {
  // Step 1: Research
  const researchResult = await researchAgent.execute({
    task: \`Research: \${query}\`,
  })

  // Step 2: Analysis
  const analysisResult = await analysisAgent.execute({
    task: \`Analyze: \${researchResult.content}\`,
    context: researchResult,
  })

  // Step 3: Writing
  const finalResult = await writingAgent.execute({
    task: \`Write report based on: \${analysisResult.content}\`,
    context: { research: researchResult, analysis: analysisResult },
  })

  return finalResult
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Parallel Agent Execution</h2>
        <p>Execute agents in parallel:</p>
        <CodePlayground
          initialCode={`async function parallelAgents(query: string) {
  // Execute multiple agents in parallel
  const [research, analysis, writing] = await Promise.all([
    researchAgent.execute({ task: \`Research: \${query}\` }),
    analysisAgent.execute({ task: \`Analyze: \${query}\` }),
    writingAgent.execute({ task: \`Draft: \${query}\` }),
  ])

  // Aggregate results
  const aggregated = aggregateResults([research, analysis, writing])
  
  return aggregated
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Agent Communication</h2>
        <p>Enable agent-to-agent communication:</p>
        <CodePlayground
          initialCode={`function AgentChat() {
  const [agentMessages, setAgentMessages] = useState([])

  const handleAgentMessage = (from: string, to: string, message: string) => {
    setAgentMessages([...agentMessages, {
      from,
      to,
      message,
      timestamp: Date.now(),
    }])
  }

  return (
    <div>
      <AgentOrchestrator
        agents={[researchAgent, analysisAgent, writingAgent]}
        onAgentMessage={handleAgentMessage}
      />
      <AgentMessageList messages={agentMessages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Multi-Agent System</h2>
        <p>Complete multi-agent orchestration:</p>
        <CodePlayground
          initialCode={`import { createAgent, AgentOrchestrator } from '@clarity-chat/react/internal'

function MultiAgentSystem() {
  const agents = [
    researchAgent,
    analysisAgent,
    writingAgent,
  ]

  const handleTask = async (task: string) => {
    // Orchestrate agents
    const result = await AgentOrchestrator.execute({
      agents,
      task,
      workflow: 'sequential', // or 'parallel' or 'custom'
    })

    return result
  }

  return (
    <div>
      <ChatInput onSend={handleTask} />
      <AgentStatus agents={agents} />
      <AgentResults results={results} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Create specialized agents for specific tasks</li>
          <li>Use sequential workflows for dependent tasks</li>
          <li>Use parallel execution for independent tasks</li>
          <li>Enable agent communication for coordination</li>
          <li>Aggregate results from multiple agents</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/agent-run-feed">AgentRunFeed</a> -
            Agent execution feed
          </li>
          <li>
            <a href="/reference/hooks/use-agent">useAgent</a> - Agent hook
          </li>
        </ul>
      </section>
    </div>
  )
}
