import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thinking Indicator | Clarity Chat',
  description: 'AI thinking indicator with animated stages and progress tracking.'
}

export default function ThinkingIndicatorPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Thinking Indicator</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Animated AI thinking indicator showing processing stages, progress, and estimated completion time.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Stage-based status display (thinking, researching, compiling, etc.)</li>
          <li>Animated icon for current stage</li>
          <li>Pulsing dot animation</li>
          <li>Progress bar with smooth animation</li>
          <li>Estimated completion time</li>
          <li>Optional topic/detail text</li>
          <li>Smooth enter/exit transitions</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { ThinkingIndicator } from '@clarity-chat/react'
import type { AIStatus } from '@clarity-chat/types'

function ChatMessages() {
  const [aiStatus, setAIStatus] = useState<AIStatus>({
    stage: 'thinking',
    topic: 'Analyzing your question',
    progress: 25,
    estimatedCompletion: new Date(Date.now() + 5000)
  })

  return (
    <>
      {messages.map(msg => <Message key={msg.id} {...msg} />)}
      {isAIProcessing && <ThinkingIndicator status={aiStatus} />}
    </>
  )
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 font-semibold">Prop</th>
                <th className="p-2 font-semibold">Type</th>
                <th className="p-2 font-semibold">Default</th>
                <th className="p-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">status</td>
                <td className="p-2 font-mono text-sm">AIStatus</td>
                <td className="p-2">-</td>
                <td className="p-2">AI processing status object</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">-</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">AIStatus Interface</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`interface AIStatus {
  stage: 'thinking' | 'researching' | 'compiling' | 'generating' | 'finalizing'
  topic?: string                // Description of current task
  progress?: number             // 0-100 completion percentage
  estimatedCompletion?: Date    // Expected completion time
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Processing Stages</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <strong className="text-foreground">🤖 Thinking:</strong> Initial processing and understanding
          </div>
          <div>
            <strong className="text-foreground">🔍 Researching:</strong> Searching knowledge base or web
          </div>
          <div>
            <strong className="text-foreground">📄 Compiling:</strong> Gathering and organizing information
          </div>
          <div>
            <strong className="text-foreground">✨ Generating:</strong> Creating response content
          </div>
          <div>
            <strong className="text-foreground">✓ Finalizing:</strong> Final formatting and review
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Examples</h2>
        
        <h3 className="text-2xl font-semibold mb-3">With Progress</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`<ThinkingIndicator
  status={{
    stage: 'researching',
    topic: 'Searching documentation',
    progress: 60
  }}
/>`}</code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Simple Usage</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`<ThinkingIndicator 
  status={{ stage: 'thinking' }}
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Update status in real-time as AI progresses</li>
          <li>Provide meaningful topic descriptions</li>
          <li>Show progress bar for long-running operations</li>
          <li>Use appropriate stages for your workflow</li>
          <li>Remove indicator when AI completes</li>
          <li>Consider accessibility with ARIA labels</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><a href="/reference/components/streaming-message" className="text-primary hover:underline">Streaming Message</a> - Display AI responses</li>
          <li><a href="/reference/components/message-list" className="text-primary hover:underline">Message List</a> - Message container</li>
        </ul>
      </section>
    </div>
  )
}
