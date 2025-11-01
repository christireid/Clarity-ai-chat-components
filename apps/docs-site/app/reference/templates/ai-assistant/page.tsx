import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Assistant Template | Clarity Chat',
  description: 'Pre-built AI assistant chat template with modern UI and full feature set.'
}

export default function AIAssistantTemplatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">AI Assistant Template</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Complete AI assistant chat interface template with streaming, file uploads, and conversation management.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Modern chat UI with message bubbles</li>
          <li>Streaming response support</li>
          <li>File attachment handling</li>
          <li>Code syntax highlighting</li>
          <li>Markdown rendering</li>
          <li>Conversation history</li>
          <li>Model selection dropdown</li>
          <li>Settings panel</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { AIAssistant } from '@clarity-chat/react/templates'

function App() {
  return (
    <AIAssistant
      apiEndpoint="/api/chat"
      defaultModel="gpt-4-turbo"
      enableFileUpload
      enableVoiceInput
    />
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
