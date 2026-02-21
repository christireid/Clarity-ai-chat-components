'use client'

import React, { useState } from 'react'
import { MessageBranch } from '@/components/AI/MessageBranch'

export default function MessageBranchPage() {
  const [currentVersion, setCurrentVersion] = useState(2)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      setIsRegenerating(false)
      setCurrentVersion((prev) => prev + 1)
    }, 1500)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Reference</span>
          <span>/</span>
          <span>Components</span>
          <span>/</span>
          <span className="text-foreground">MessageBranch</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">MessageBranch</h1>
        <p className="text-xl text-muted-foreground">
          Navigate between different versions of regenerated AI responses with
          version history.
        </p>
      </div>

      {/* Live Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Live Demo</h2>
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center justify-center">
            <MessageBranch
              currentIndex={currentVersion}
              totalVersions={currentVersion}
              onNavigate={setCurrentVersion}
              onRegenerate={handleRegenerate}
              isRegenerating={isRegenerating}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Try navigating between versions or clicking regenerate to add a new
            version.
          </p>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">CLI Installation</h3>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
              <code>npx clarity-chat add message-branch</code>
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Manual Installation</h3>
            <p className="text-muted-foreground mb-2">
              Copy the component to your project:
            </p>
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{`// components/AI/MessageBranch.tsx
import { MessageBranch } from '@clarity/react';

// Or copy from the source below`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Usage</h2>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`import { MessageBranch } from '@clarity/react';

function ChatMessage({ message }) {
  const [currentVersion, setCurrentVersion] = useState(1);

  return (
    <div className="message">
      <div className="message-content">
        {message.versions[currentVersion - 1].content}
      </div>

      <MessageBranch
        currentIndex={currentVersion}
        totalVersions={message.versions.length}
        onNavigate={setCurrentVersion}
        onRegenerate={() => regenerateMessage(message.id)}
      />
    </div>
  );
}`}</code>
        </pre>
      </section>

      {/* Props Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Prop</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Default</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>currentIndex</code>
                </td>
                <td className="py-3 px-4">
                  <code>number</code>
                </td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4">Current version index (1-based)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>totalVersions</code>
                </td>
                <td className="py-3 px-4">
                  <code>number</code>
                </td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4">
                  Total number of versions available
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onNavigate</code>
                </td>
                <td className="py-3 px-4">
                  <code>(index: number) =&gt; void</code>
                </td>
                <td className="py-3 px-4">Required</td>
                <td className="py-3 px-4">Callback when navigating versions</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>onRegenerate</code>
                </td>
                <td className="py-3 px-4">
                  <code>() =&gt; void</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">
                  Callback to regenerate the message
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>isRegenerating</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>false</code>
                </td>
                <td className="py-3 px-4">
                  Whether regeneration is in progress
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>size</code>
                </td>
                <td className="py-3 px-4">
                  <code>{`'sm' | 'md' | 'lg'`}</code>
                </td>
                <td className="py-3 px-4">
                  <code>{`'md'`}</code>
                </td>
                <td className="py-3 px-4">Size variant</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>showRegenerate</code>
                </td>
                <td className="py-3 px-4">
                  <code>boolean</code>
                </td>
                <td className="py-3 px-4">
                  <code>true</code>
                </td>
                <td className="py-3 px-4">Show the regenerate button</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">
                  <code>pt</code>
                </td>
                <td className="py-3 px-4">
                  <code>object</code>
                </td>
                <td className="py-3 px-4">-</td>
                <td className="py-3 px-4">Pass Through API for styling</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Accessibility */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>

        <h3 className="text-lg font-medium mb-3">WCAG Compliance</h3>
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Standard</th>
              <th className="text-left py-2 px-4">Level</th>
              <th className="text-left py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">WCAG 2.2</td>
              <td className="py-2 px-4">AA</td>
              <td className="py-2 px-4">✅ Compliant</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">Section 508</td>
              <td className="py-2 px-4">-</td>
              <td className="py-2 px-4">✅ Compliant</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-lg font-medium mb-3">Keyboard Navigation</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Key</th>
              <th className="text-left py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Tab</kbd>
              </td>
              <td className="py-2 px-4">Move focus between buttons</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <kbd>Enter</kbd> / <kbd>Space</kbd>
              </td>
              <td className="py-2 px-4">Activate focused button</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Pass Through API */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Pass Through (PT) API</h2>
        <p className="text-muted-foreground mb-4">
          Customize the internal elements using the Pass Through API:
        </p>
        <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
          <code>{`<MessageBranch
  pt={{
    root: { className: 'custom-root' },
    prevButton: { className: 'custom-prev' },
    nextButton: { className: 'custom-next' },
    counter: { className: 'custom-counter' },
    regenerateButton: { className: 'custom-regenerate' },
  }}
/>`}</code>
        </pre>

        <h3 className="text-lg font-medium mt-6 mb-3">PT Sections</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Section</th>
              <th className="text-left py-2 px-4">Element</th>
              <th className="text-left py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4">
                <code>root</code>
              </td>
              <td className="py-2 px-4">Container div</td>
              <td className="py-2 px-4">Root container element</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <code>prevButton</code>
              </td>
              <td className="py-2 px-4">Button</td>
              <td className="py-2 px-4">Previous version button</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <code>nextButton</code>
              </td>
              <td className="py-2 px-4">Button</td>
              <td className="py-2 px-4">Next version button</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <code>counter</code>
              </td>
              <td className="py-2 px-4">Span</td>
              <td className="py-2 px-4">Version counter display</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">
                <code>regenerateButton</code>
              </td>
              <td className="py-2 px-4">Button</td>
              <td className="py-2 px-4">Regenerate button</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Size Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Size Variants</h2>
        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Small:</span>
            <MessageBranch
              currentIndex={2}
              totalVersions={3}
              onNavigate={() => {}}
              size="sm"
              showRegenerate={false}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Medium:</span>
            <MessageBranch
              currentIndex={2}
              totalVersions={3}
              onNavigate={() => {}}
              size="md"
              showRegenerate={false}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-muted-foreground">Large:</span>
            <MessageBranch
              currentIndex={2}
              totalVersions={3}
              onNavigate={() => {}}
              size="lg"
              showRegenerate={false}
            />
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Related</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/reference/hooks/use-clarity-chat"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">useClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Main hook for chat state management including message versions.
            </p>
          </a>
          <a
            href="/reference/components/streaming-message"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">StreamingMessage</h3>
            <p className="text-sm text-muted-foreground">
              Display streaming AI responses with typing effects.
            </p>
          </a>
        </div>
      </section>
    </main>
  )
}
