import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Support Template | Clarity Chat',
  description: 'Customer support chat template with ticket management and knowledge base integration.'
}

export default function CustomerSupportTemplatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Customer Support Template</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Complete customer support chat interface with ticket creation, knowledge base search, and agent handoff.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Ticket creation and tracking</li>
          <li>Knowledge base integration</li>
          <li>Agent handoff capability</li>
          <li>Customer information display</li>
          <li>Canned responses library</li>
          <li>Satisfaction ratings</li>
          <li>Conversation escalation</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { CustomerSupport } from '@clarity-chat/react/templates'

function App() {
  return (
    <CustomerSupport
      apiEndpoint="/api/support"
      knowledgeBaseUrl="/kb"
      enableAgentHandoff
      showCustomerInfo
    />
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
