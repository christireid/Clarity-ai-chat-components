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
import { glass, GLASS_PRESETS } from '../../../utils/glassmorphism'
import { cn } from '../../../utils/cn'

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
    <Card className={glass(GLASS_PRESETS.dashboardCard)}>
      <CardHeader className="">
        <CardTitle className="text-sm">Key Moments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {keyMoments.map((moment, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3 p-2',
              glass({ intensity: 'subtle', border: 'light' })
            )}
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
