'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import type { ConversationAnalytics } from '../ConversationAnalyticsDashboard.types'
import { glass, GLASS_PRESETS } from '../../../utils/glassmorphism'

export interface SentimentCardProps {
  /** Sentiment data to display */
  sentiment: ConversationAnalytics['sentiment']
  /** Whether to show detailed timeline */
  detailed?: boolean
}

/**
 * Sentiment Card Component
 *
 * Displays sentiment analysis with overall classification,
 * confidence score, and optional timeline visualization.
 */
export function SentimentCard({ sentiment, detailed = false }: SentimentCardProps) {
  return (
    <Card className={glass(GLASS_PRESETS.metricsPanel)}>
      <CardHeader className="">
        <CardTitle className="text-sm">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex items-center gap-4 mb-4">
          <Badge
            variant={
              sentiment.overall === 'positive'
                ? 'success'
                : sentiment.overall === 'negative'
                  ? 'destructive'
                  : 'secondary'
            }
            className="text-lg px-4 py-2"
          >
            {sentiment.overall}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {Math.round(sentiment.confidence * 100)}% confidence
          </div>
        </div>

        {detailed && (
          <div
            className="h-20 flex items-end gap-1"
            role="img"
            aria-label={`Sentiment timeline showing ${sentiment.timeline.length} data points with overall ${sentiment.overall} sentiment`}
          >
            {sentiment.timeline.map((point, index) => (
              <div
                key={index}
                className={cn(
                  'flex-1 rounded-t',
                  point.label === 'positive' && 'bg-green-500',
                  point.label === 'neutral' && 'bg-gray-400',
                  point.label === 'negative' && 'bg-red-500'
                )}
                style={{
                  height: `${((point.score + 1) / 2) * 100}%`,
                }}
                title={`${point.label}: ${point.score.toFixed(2)}`}
                role="presentation"
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

SentimentCard.displayName = 'SentimentCard'
