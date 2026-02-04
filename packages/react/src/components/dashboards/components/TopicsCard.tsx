'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@clarity-chat/primitives'
import { ANIMATION_PRESETS } from '../../../animations/constants'
import type { TopicCluster } from '../ConversationAnalyticsDashboard.types'

export interface TopicsCardProps {
  /** Topics to display */
  topics: TopicCluster[]
  /** Whether to disable animations (respects reduced motion) */
  prefersReducedMotion?: boolean
}

/**
 * Topics Card Component
 *
 * Displays identified topics with their confidence scores,
 * message counts, and associated keywords.
 */
export function TopicsCard({
  topics,
  prefersReducedMotion = false,
}: TopicsCardProps) {
  if (topics.length === 0) {
    return null
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="">
        <CardTitle className="text-sm">Topics Discussed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topics.map((topic, index) =>
          prefersReducedMotion ? (
            <div
              key={topic.name}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{topic.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {topic.messageCount} messages
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topic.keywords.map((kw) => (
                    <Badge key={kw} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">
                {Math.round(topic.confidence * 100)}%
              </div>
            </div>
          ) : (
            <motion.div
              key={topic.name}
              {...ANIMATION_PRESETS.slideRight}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{topic.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {topic.messageCount} messages
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {topic.keywords.map((kw) => (
                    <Badge key={kw} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">
                {Math.round(topic.confidence * 100)}%
              </div>
            </motion.div>
          )
        )}
      </CardContent>
    </Card>
  )
}

TopicsCard.displayName = 'TopicsCard'
