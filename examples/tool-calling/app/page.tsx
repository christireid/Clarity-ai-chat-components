'use client'

import { ToolCallingChat } from '@/components/tool-calling-chat'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary>
        <ToolCallingChat />
      </ErrorBoundary>
    </main>
  )
}
