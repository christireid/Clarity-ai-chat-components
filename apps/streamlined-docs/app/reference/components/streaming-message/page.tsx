import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Component Reference | Clarity Chat',
  description: 'API reference for Clarity Chat components',
}

export default function ComponentPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-4xl">
      <div className="not-prose mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-2">Component Reference</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          API documentation is being generated. See the complete reference below.
        </p>
      </div>

      <div className="p-6 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
        <h2 className="mt-0 flex items-center gap-2">
          <span className="text-2xl">📘</span>
          <span>Complete API Reference Available</span>
        </h2>
        <p>
          The complete API reference documentation for all 8 core Clarity Chat components 
          has been created in:
        </p>
        <pre className="bg-white dark:bg-slate-800 p-3 rounded border"><code>COMPONENT_API_REFERENCE.md</code></pre>
        
        <h3>What's Included</h3>
        <ul className="space-y-2">
          <li><strong>ClarityChat</strong> - Drop-in chat component</li>
          <li><strong>ClarityChatApp</strong> - Top-level app wrapper</li>
          <li><strong>ChatWindow</strong> - Main chat container</li>
          <li><strong>ChatInput</strong> - Message input</li>
          <li><strong>MessageList</strong> - Message display</li>
          <li><strong>Message</strong> - Individual message</li>
          <li><strong>StreamingMessage</strong> - Streaming display</li>
          <li><strong>TypingIndicator</strong> - Loading state</li>
        </ul>

        <h3>Each Component Includes</h3>
        <ul className="space-y-1">
          <li>✅ Installation & import instructions</li>
          <li>✅ Basic usage example</li>
          <li>✅ Multiple advanced examples</li>
          <li>✅ Complete props table with types</li>
          <li>✅ Accessibility features</li>
          <li>✅ Related components</li>
          <li>✅ TypeScript types</li>
          <li>✅ Common patterns</li>
        </ul>

        <div className="mt-6 pt-6 border-t border-amber-200 dark:border-amber-800">
          <p className="mb-3 font-semibold">Quick Navigation:</p>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/reference/components/clarity-chat" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              ClarityChat
            </Link>
            <Link href="/reference/components/chat-window" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              ChatWindow
            </Link>
            <Link href="/reference/components/chat-input" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              ChatInput
            </Link>
            <Link href="/reference/components/message-list" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              MessageList
            </Link>
            <Link href="/reference/components/message" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              Message
            </Link>
            <Link href="/reference/components/streaming-message" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              StreamingMessage
            </Link>
            <Link href="/reference/components/typing-indicator" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              TypingIndicator
            </Link>
            <Link href="/reference/components/clarity-chat-app" className="px-3 py-2 bg-white dark:bg-slate-800 rounded border hover:border-blue-500 transition-colors">
              ClarityChatApp
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2>Quick Reference</h2>
        <p>
          For detailed API documentation with complete examples, props tables, and 
          troubleshooting guides, see <code>COMPONENT_API_REFERENCE.md</code> in the 
          project root.
        </p>
      </div>
    </div>
  )
}
