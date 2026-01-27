'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@clarity-chat/primitives'
import type { KeyMoment } from '../ConversationAnalyticsDashboard.types'

export interface KeyMomentsCardProps {
  /** Key moments to display */
  keyMoments: KeyMoment[]
}

/**
 * Get badge variant for key moment type
 */
function getKeyMomentVariant(
  type: KeyMoment['type']
): 'success' | 'default' | 'secondary' {
  if (type === 'breakthrough') return 'success'
  if (type === 'decision') return 'default'
  return 'secondary'
}

/**
 * Key Moments Card Component
 *
 * Displays important moments in the conversation
 * such as breakthroughs, decisions, and questions.
 */
export function KeyMomentsCard({ keyMoments }: KeyMomentsCardProps) {
  if (keyMoments.length === 0) {
    return null
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="">
        <CardTitle className="text-sm">Key Moments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {keyMoments.map((moment, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-2 rounded-lg border"
          >
            <Badge
              variant={getKeyMomentVariant(moment.type)}
              className="mt-1"
            >
              {moment.type}
            </Badge>
            <div className="flex-1 text-sm">{moment.description}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round(moment.importance * 100)}%
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

KeyMomentsCard.displayName = 'KeyMomentsCard'
