'use client'

import { StreamingChat } from '@/components/streaming-chat'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <StreamingChat />
      </ErrorBoundary>
    </main>
  )
}
