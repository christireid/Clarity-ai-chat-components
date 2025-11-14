import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support Bot Template | Clarity Chat',
  description: 'Automated support bot template with FAQ handling and ticket routing.'
}

export default function SupportBotTemplatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Support Bot Template</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Automated support chatbot with FAQ handling, intent detection, and smart ticket routing.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Intent classification</li>
          <li>FAQ auto-responses</li>
          <li>Smart ticket routing</li>
          <li>Business hours detection</li>
          <li>Multi-language support</li>
          <li>Sentiment analysis</li>
          <li>Escalation triggers</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { SupportBot } from '@clarity-chat/react/templates'

function App() {
  return (
    <SupportBot
      apiEndpoint="/api/bot"
      faqDatabase="/faqs"
      businessHours={{ start: 9, end: 17 }}
      enableSentimentAnalysis
    />
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
