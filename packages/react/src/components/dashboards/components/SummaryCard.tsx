'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import type { ConversationSummary } from '../ConversationAnalyticsDashboard.types'
import { glass, GLASS_PRESETS } from '../../../utils/glassmorphism'

export interface SummaryCardProps {
  /** Summary data to display */
  summary: ConversationSummary
}

/**
 * Summary Card Component
 *
 * Displays conversation summary with key points,
 * next steps, and open questions.
 */
export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className={glass(GLASS_PRESETS.dashboardCard)}>
      <CardHeader className="">
        <CardTitle className="text-sm">Conversation Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.keyPoints.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Key Points</h4>
            <ul className="space-y-1 text-sm">
              {summary.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.nextSteps.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Next Steps</h4>
            <ul className="space-y-1 text-sm">
              {summary.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.openQuestions.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Open Questions</h4>
            <ul className="space-y-1 text-sm">
              {summary.openQuestions.map((question, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">?</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

SummaryCard.displayName = 'SummaryCard'
