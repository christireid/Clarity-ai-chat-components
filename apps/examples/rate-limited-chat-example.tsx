/**
 * Rate-Limited Chat Example
 *
 * Demonstrates rate limiting, request queuing, and queue status display
 * in Clarity Chat components.
 */

'use client'

import React, { useState } from 'react'
import { ClarityChat } from '@clarity-chat/react'
import { Button } from '@clarity-chat/react'
import { RequestQueueStatus } from '@clarity-chat/react'
import { useRateLimitedChat } from '@clarity-chat/react'

export function RateLimitedChatExample() {
  const [showQueueStatus, setShowQueueStatus] = useState(true)
  const [compactMode, setCompactMode] = useState(false)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Rate-Limited Chat Example</h1>
        <p className="text-muted-foreground">
          This example demonstrates automatic rate limiting, request queuing, and user feedback
          when API limits are reached.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={showQueueStatus ? 'default' : 'outline'}
          onClick={() => setShowQueueStatus(!showQueueStatus)}
        >
          {showQueueStatus ? 'Hide' : 'Show'} Queue Status
        </Button>
        <Button
          variant={compactMode ? 'default' : 'outline'}
          onClick={() => setCompactMode(!compactMode)}
        >
          {compactMode ? 'Expanded' : 'Compact'} Mode
        </Button>
      </div>

      {/* Rate-Limited Chat */}
      <ClarityChat
        api="/api/chat"
        enableRateLimiting={true}
        maxConcurrentRequests={2}
        maxQueueSize={5}
        showQueueStatus={showQueueStatus}
        compactQueueStatus={compactMode}
        onRequestQueued={(position, estimatedWaitMs) => {
          console.log(`Request queued at position ${position}, estimated wait: ${Math.ceil(estimatedWaitMs / 1000)}s`)
        }}
        onRateLimited={(resetAt) => {
          console.log(`Rate limited, next request at: ${new Date(resetAt).toLocaleTimeString()}`)
        }}
        onQueueFull={() => {
          console.warn('Request queue is full!')
        }}
        showHeader={true}
        sessionTitle="Rate-Limited AI Assistant"
        sessionSubtitle="With automatic request queuing and rate limit handling"
        className="h-[600px] border rounded-lg"
      />

      {/* Information Panel */}
      <div className="bg-muted/50 p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">How It Works</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium">Rate Limiting</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Maximum 2 concurrent requests</li>
              <li>• Queue up to 5 additional requests</li>
              <li>• Automatic retry on rate limit errors</li>
              <li>• Exponential backoff for retries</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">User Experience</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Real-time queue status display</li>
              <li>• Estimated wait times</li>
              <li>• Rate limit countdown</li>
              <li>• Compact or expanded status modes</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">Try It Out</h3>
          <p className="text-sm text-muted-foreground">
            Send multiple messages quickly to see the rate limiting in action.
            The queue status will show your requests being processed in order,
            with estimated wait times for queued requests.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Advanced example with custom queue status
 */
export function AdvancedRateLimitedChat() {
  const chat = useRateLimitedChat({
    api: '/api/chat',
    enableRateLimiting: true,
    maxConcurrent: 3,
    maxQueueSize: 10,
  })

  return (
    <div className="space-y-4">
      {/* Custom queue status */}
      <RequestQueueStatus
        queueStatus={chat.queueStatus}
        isRateLimited={chat.isRateLimited}
        rateLimitResetAt={chat.rateLimitResetAt}
        onClearQueue={chat.clearQueue}
        showProgress={true}
        showControls={true}
      />

      {/* Your chat UI here */}
      <div className="border rounded-lg p-4 h-96">
        <p className="text-muted-foreground">
          Chat messages would go here. Queue status: {chat.queueStatus.queueLength} queued,
          {chat.queueStatus.activeCount} active.
        </p>
      </div>
    </div>
  )
}

export default RateLimitedChatExample