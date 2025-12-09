'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { ExperimentCard } from './experiment-card'

/**
 * Experiment data for the list
 */
export interface ExperimentListItem {
  /** Unique experiment ID */
  experimentId: string
  /** Experiment name */
  experimentName: string
  /** Optional description */
  description?: string
  /** Experiment status */
  status: 'draft' | 'running' | 'paused' | 'completed'
  /** Number of variants */
  variantCount: number
  /** Whether a winner has been found */
  hasWinner?: boolean
}

/**
 * Props for ExperimentList component
 */
export interface ExperimentListProps {
  /** List of experiments to display */
  experiments: ExperimentListItem[]
  /** Currently selected experiment ID */
  selectedId?: string | null
  /** Callback when an experiment is selected */
  onSelect?: (experiment: ExperimentListItem) => void
  /** Title for the list section */
  title?: string
  /** Empty state message */
  emptyMessage?: string
  /** Custom className for the container */
  className?: string
}

/**
 * List of experiment cards with selection support.
 *
 * @example
 * ```tsx
 * <ExperimentList
 *   experiments={experiments.map(exp => ({
 *     experimentId: exp.experimentId,
 *     experimentName: exp.experimentName,
 *     description: exp.description,
 *     status: exp.status,
 *     variantCount: exp.variants.length,
 *     hasWinner: !!exp.winner,
 *   }))}
 *   selectedId={selectedExperiment?.experimentId}
 *   onSelect={handleSelectExperiment}
 * />
 * ```
 */
export function ExperimentList({
  experiments,
  selectedId,
  onSelect,
  title = 'Experiments',
  emptyMessage = 'No experiments yet. Create your first A/B test to get started.',
  className,
}: ExperimentListProps): React.ReactElement {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {experiments.map((experiment) => (
            <ExperimentCard
              key={experiment.experimentId}
              id={experiment.experimentId}
              name={experiment.experimentName}
              description={experiment.description}
              status={experiment.status}
              variantCount={experiment.variantCount}
              hasWinner={experiment.hasWinner}
              isSelected={selectedId === experiment.experimentId}
              onSelect={() => onSelect?.(experiment)}
            />
          ))}

          {experiments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {emptyMessage}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

ExperimentList.displayName = 'ExperimentList'
