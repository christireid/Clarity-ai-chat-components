import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Mail, Send, Inbox, Archive } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Email Assistant Example',
  description: 'Smart email composition and response suggestions',
}

export default function EmailAssistantPage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-4xl">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl">
            <Mail className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Email Assistant</h1>
            <p className="text-xl text-text-secondary">
              AI-powered email composition, smart replies, and inbox management
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium">
            Intermediate
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
            Productivity
          </span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Smart Compose</strong> - AI-generated email drafts
            </li>
            <li>
              <strong>Quick Replies</strong> - Suggested responses based on
              email content
            </li>
            <li>
              <strong>Tone Adjustment</strong> - Formal, casual, friendly, or
              professional
            </li>
            <li>
              <strong>Grammar Check</strong> - Automatic proofreading
            </li>
            <li>
              <strong>Email Summarization</strong> - TL;DR for long emails
            </li>
            <li>
              <strong>Priority Detection</strong> - Identify urgent messages
            </li>
            <li>
              <strong>Template Library</strong> - Common email templates
            </li>
            <li>
              <strong>Follow-up Reminders</strong> - Track responses needed
            </li>
          </ul>

          <h2>💬 Example Workflow</h2>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">
              👤 User: "Write a professional follow-up email to John about the
              project proposal"
            </p>
            <p className="text-text-secondary text-sm mb-3">
              🤖 Assistant generates:
            </p>
            <div className="bg-white dark:bg-slate-900 p-4 rounded border border-border text-sm">
              <p className="font-medium mb-2">
                Subject: Following Up on Project Proposal
              </p>
              <div className="text-text-secondary space-y-2">
                <p>Hi John,</p>
                <p>
                  I hope this message finds you well. I wanted to follow up on
                  the project proposal we discussed last week.
                </p>
                <p>
                  I'd love to hear your thoughts and answer any questions you
                  might have. Would you be available for a quick call this week
                  to discuss next steps?
                </p>
                <p>Looking forward to hearing from you.</p>
                <p>
                  Best regards,
                  <br />
                  [Your Name]
                </p>
              </div>
            </div>
          </div>

          <h2>🎯 Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-4 border border-border rounded-lg">
              <Send className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Compose Emails</h3>
              <p className="text-sm text-text-secondary">
                Generate professional emails from brief descriptions
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Inbox className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Smart Replies</h3>
              <p className="text-sm text-text-secondary">
                Get 3 suggested replies for any email
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Archive className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Email Triage</h3>
              <p className="text-sm text-text-secondary">
                Automatically categorize and prioritize emails
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Mail className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Templates</h3>
              <p className="text-sm text-text-secondary">
                Pre-built templates for common scenarios
              </p>
            </div>
          </div>

          <h2>🚀 Quick Start</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`cd examples/email-assistant
npm install
npm run dev`}</code>
          </pre>

          <h2>🔗 Related</h2>
          <ul>
            <li>
              <Link
                href="/reference/components/prompt-library"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                Prompt Library
              </Link>{' '}
              - For email templates
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
