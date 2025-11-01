import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feedback Animation | Clarity Chat',
  description: 'Delightful animated feedback for success, error, warning, and info states.'
}

export default function FeedbackAnimationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Feedback Animation</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Beautiful animated feedback component for user action confirmations with auto-hide and custom durations.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Four feedback types: success, error, warning, info</li>
          <li>Animated entrance/exit with scale and opacity transitions</li>
          <li>Auto-hide with configurable duration (default: 2000ms)</li>
          <li>Icon animations with rotation and scale effects</li>
          <li>Custom messages for each feedback type</li>
          <li>Completion callbacks for chaining actions</li>
          <li>Framer Motion powered animations</li>
          <li>Color-coded by feedback type</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { FeedbackAnimation } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const [show, setShow] = useState(false)
  
  return (
    <>
      <button onClick={() => setShow(true)}>Save</button>
      
      <FeedbackAnimation
        type="success"
        show={show}
        message="Saved successfully!"
        duration={2000}
        onComplete={() => setShow(false)}
      />
    </>
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}