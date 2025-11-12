import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useAutoScroll | Clarity Chat',
  description: 'Auto-scroll to bottom of container when new content added.'
}

export default function UseAutoScrollPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useAutoScroll</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Automatically scroll to bottom when new content is added, with smart detection to avoid disrupting manual scrolling.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useAutoScroll } from '@clarity-chat/react'

const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
  dependencies: [messages],
  threshold: 100,
  behavior: 'smooth'
})

return (
  <div ref={scrollRef} className="overflow-y-auto h-96">
    {messages.map(msg => <Message key={msg.id} {...msg} />)}
    {!isNearBottom && (
      <button onClick={scrollToBottom}>
        Scroll to bottom ↓
      </button>
    )}
  </div>
)`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Parameters</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>enabled:</strong> Enable/disable auto-scroll (default: true)</li>
          <li><strong>behavior:</strong> 'smooth' or 'instant' (default: 'smooth')</li>
          <li><strong>threshold:</strong> Distance from bottom in px to trigger (default: 100)</li>
          <li><strong>dependencies:</strong> Values that trigger scroll check</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Returns</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>scrollRef:</strong> Ref to attach to scrollable element</li>
          <li><strong>isNearBottom:</strong> Whether user is near bottom</li>
          <li><strong>scrollToBottom:</strong> Function to manually scroll</li>
          <li><strong>setEnabled:</strong> Enable/disable auto-scroll</li>
        </ul>
      </section>
    </div>
  )
}
