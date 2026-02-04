'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
} from '../../../animations/constants'
import type { QualityMetrics } from '../ConversationAnalyticsDashboard.types'

export interface QualityScoreCardProps {
  /** Quality metrics to display */
  quality: QualityMetrics
  /** Whether to disable animations (respects reduced motion) */
  prefersReducedMotion?: boolean
}

/**
 * Quality Score Card Component
 *
 * Displays conversation quality metrics with a visual progress bar
 * and breakdown of individual quality factors.
 */
export function QualityScoreCard({
  quality,
  prefersReducedMotion = false,
}: QualityScoreCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="">
        <CardTitle className="text-sm">Conversation Quality</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold" aria-hidden="true">
            {Math.round(quality.score)}
          </div>
          <div className="flex-1">
            <div
              className="h-2 w-full rounded-full bg-muted overflow-hidden"
              role="progressbar"
              aria-label="Conversation quality score"
              aria-valuenow={Math.round(quality.score)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`Quality score: ${Math.round(quality.score)} out of 100`}
            >
              {prefersReducedMotion ? (
                <div
                  className="h-full bg-primary"
                  style={{ width: `${quality.score}%` }}
                />
              ) : (
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${quality.score}%` }}
                  transition={{
                    duration: durations.slower,
                    ease: 'easeOut',
                  }}
                  viewport={{ once: true }}
                />
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 text-xs">
              {Object.entries(quality.factors).map(([key, value]) => (
                <div key={key}>
                  <div className="text-muted-foreground capitalize">{key}</div>
                  <div className="font-semibold">{Math.round(value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

QualityScoreCard.displayName = 'QualityScoreCard'
