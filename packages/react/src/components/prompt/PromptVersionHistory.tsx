'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import type { PromptVersion, PromptEnvironment } from '../../prompts/types'
import {
  useReducedMotion,
  getMotionSafePreset,
  getMotionSafeTransition,
} from '../../animations'

/**
 * Props for PromptVersionHistory component
 */
export interface PromptVersionHistoryProps {
  /** Template ID */
  templateId: string
  /** Template name for display */
  templateName?: string
  /** List of versions */
  versions: PromptVersion[]
  /** Currently active version ID */
  activeVersionId?: string
  /** Deployed versions by environment */
  deployedVersions?: Partial<Record<PromptEnvironment, string>>
  /** Callback when version is selected for viewing */
  onSelectVersion?: (version: PromptVersion) => void
  /** Callback when setting active version */
  onSetActive?: (versionId: string) => void
  /** Callback when rolling back to version */
  onRollback?: (versionId: string) => void
  /** Callback when deploying version */
  onDeploy?: (versionId: string, environment: PromptEnvironment) => void
  /** Callback when comparing versions */
  onCompare?: (versionId1: string, versionId2: string) => void
  /** Enable version comparison */
  enableComparison?: boolean
  /** Show deployment actions */
  showDeployment?: boolean
  /** Max height for the component */
  maxHeight?: string | number
  /** Custom class name */
  className?: string
}

/**
 * Format timestamp to readable date
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format relative time
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

/**
 * PromptVersionHistory Component
 *
 * Displays version history for a prompt template with comparison and rollback capabilities.
 * Shows active/deployed status and allows version management.
 *
 * Features:
 * - Version timeline with notes
 * - Active version indicator
 * - Deployment status per environment
 * - Version comparison selection
 * - Rollback functionality
 * - Deploy to environment
 *
 * @example
 * ```tsx
 * <PromptVersionHistory
 *   templateId="template-1"
 *   templateName="Code Review"
 *   versions={versions}
 *   activeVersionId="v-3"
 *   deployedVersions={{ production: 'v-2', staging: 'v-3' }}
 *   onRollback={(id) => rollbackToVersion(id)}
 *   onDeploy={(id, env) => deployVersion(id, env)}
 *   enableComparison
 * />
 * ```
 */
export function PromptVersionHistory({
  templateId,
  templateName,
  versions,
  activeVersionId,
  deployedVersions = {},
  onSelectVersion,
  onSetActive,
  onRollback,
  onDeploy,
  onCompare,
  enableComparison = true,
  showDeployment = true,
  maxHeight = 500,
  className,
}: PromptVersionHistoryProps) {
  const [selectedForComparison, setSelectedForComparison] = React.useState<
    string[]
  >([])
  const [expandedVersionId, setExpandedVersionId] = React.useState<
    string | null
  >(null)
  const prefersReducedMotion = useReducedMotion()

  // Sort versions by creation date (newest first)
  const sortedVersions = React.useMemo(
    () => [...versions].sort((a, b) => b.createdAt - a.createdAt),
    [versions]
  )

  // Toggle version selection for comparison
  const toggleComparisonSelection = React.useCallback((versionId: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId)
      }
      if (prev.length >= 2) {
        return [prev[1]!, versionId]
      }
      return [...prev, versionId]
    })
  }, [])

  // Handle compare action
  const handleCompare = React.useCallback(() => {
    if (selectedForComparison.length === 2) {
      onCompare?.(selectedForComparison[0]!, selectedForComparison[1]!)
    }
  }, [selectedForComparison, onCompare])

  // Get environment badge for version
  const getEnvironmentBadges = React.useCallback(
    (versionId: string) => {
      const badges: { env: PromptEnvironment; color: string }[] = []
      if (deployedVersions.production === versionId) {
        badges.push({ env: 'production', color: 'bg-green-500' })
      }
      if (deployedVersions.staging === versionId) {
        badges.push({ env: 'staging', color: 'bg-yellow-500' })
      }
      if (deployedVersions.development === versionId) {
        badges.push({ env: 'development', color: 'bg-blue-500' })
      }
      return badges
    },
    [deployedVersions]
  )

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Version History
              <Badge variant="secondary">{versions.length}</Badge>
            </CardTitle>
            <CardDescription>
              {templateName
                ? `History for "${templateName}"`
                : `Template ${templateId}`}
            </CardDescription>
          </div>
          {enableComparison && selectedForComparison.length === 2 && (
            <Button size="sm" onClick={handleCompare}>
              Compare Selected
            </Button>
          )}
        </div>

        {/* Comparison Selection Info */}
        {enableComparison && selectedForComparison.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            {selectedForComparison.length === 1
              ? 'Select one more version to compare'
              : 'Two versions selected for comparison'}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea
          className="h-full px-4"
          style={{
            maxHeight:
              typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          }}
        >
          {sortedVersions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-3">📜</div>
              <p className="text-sm font-medium">No versions yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Versions will appear here when created
              </p>
            </div>
          ) : (
            <div className="relative py-4">
              {/* Timeline line */}
              <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />

              <AnimatePresence>
                {sortedVersions.map((version, index) => {
                  const isActive =
                    version.isActive || version.id === activeVersionId
                  const isExpanded = expandedVersionId === version.id
                  const isSelectedForComparison =
                    selectedForComparison.includes(version.id)
                  const envBadges = getEnvironmentBadges(version.id)

                  return (
                    <motion.div
                      key={version.id}
                      {...getMotionSafePreset(
                        prefersReducedMotion,
                        'slideRight'
                      )}
                      transition={getMotionSafeTransition(
                        prefersReducedMotion,
                        'normal',
                        'out',
                        { delay: index * 0.05 }
                      )}
                      className="relative pl-10 pb-6 last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div
                        aria-hidden="true"
                        className={cn(
                          'absolute left-2.5 w-3 h-3 rounded-full border-2',
                          'transition-all duration-200',
                          isActive
                            ? 'bg-primary border-primary scale-125'
                            : 'bg-background border-muted-foreground',
                          isSelectedForComparison &&
                            'ring-2 ring-primary ring-offset-2'
                        )}
                      />

                      {/* Version Card */}
                      <Card
                        role="button"
                        tabIndex={0}
                        aria-label={`Version ${version.version}${isActive ? ', Active' : ''}${version.notes ? `, ${version.notes}` : ''}`}
                        className={cn(
                          'cursor-pointer transition-all duration-200',
                          'hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          isActive && 'border-primary/50',
                          isSelectedForComparison &&
                            'border-primary ring-1 ring-primary/30'
                        )}
                        onClick={() => onSelectVersion?.(version)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSelectVersion?.(version)
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                v{version.version}
                              </span>
                              {isActive && (
                                <Badge variant="default" className="text-xs">
                                  Active
                                </Badge>
                              )}
                              {envBadges.map(({ env, color }) => (
                                <Badge
                                  key={env}
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  <span
                                    className={cn(
                                      'w-1.5 h-1.5 rounded-full mr-1.5',
                                      color
                                    )}
                                  />
                                  {env}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(version.createdAt)}
                            </span>
                          </div>

                          {/* Notes */}
                          {version.notes && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {version.notes}
                            </p>
                          )}

                          {/* Timestamp */}
                          <p className="text-xs text-muted-foreground mb-3">
                            {formatDate(version.createdAt)}
                          </p>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                {...getMotionSafePreset(
                                  prefersReducedMotion,
                                  'fadeIn'
                                )}
                                transition={getMotionSafeTransition(
                                  prefersReducedMotion,
                                  'fast',
                                  'out'
                                )}
                                className="mt-3 pt-3 border-t"
                              >
                                <pre className="text-xs bg-muted/50 p-3 rounded overflow-auto scrollbar-hide max-h-40">
                                  {version.template}
                                </pre>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedVersionId(
                                  isExpanded ? null : version.id
                                )
                              }}
                              aria-expanded={isExpanded}
                              aria-label={`${isExpanded ? 'Hide' : 'Show'} template for version ${version.version}`}
                            >
                              {isExpanded ? '▲ Hide' : '▼ Show'} Template
                            </Button>

                            {enableComparison && (
                              <Button
                                variant={
                                  isSelectedForComparison
                                    ? 'secondary'
                                    : 'outline'
                                }
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleComparisonSelection(version.id)
                                }}
                                aria-pressed={isSelectedForComparison}
                                aria-label={`${isSelectedForComparison ? 'Deselect' : 'Select'} version ${version.version} for comparison`}
                              >
                                {isSelectedForComparison
                                  ? '✓ Selected'
                                  : 'Compare'}
                              </Button>
                            )}

                            {!isActive && onSetActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSetActive(version.id)
                                }}
                                aria-label={`Set version ${version.version} as active`}
                              >
                                Set Active
                              </Button>
                            )}

                            {!isActive && onRollback && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onRollback(version.id)
                                }}
                                aria-label={`Rollback to version ${version.version}`}
                              >
                                Rollback
                              </Button>
                            )}

                            {showDeployment && onDeploy && (
                              <div
                                className="ml-auto flex gap-1"
                                role="group"
                                aria-label="Deploy to environment"
                              >
                                {(
                                  [
                                    'development',
                                    'staging',
                                    'production',
                                  ] as const
                                ).map((env) => {
                                  const isDeployed =
                                    deployedVersions[env] === version.id
                                  return (
                                    <Button
                                      key={env}
                                      variant={
                                        isDeployed ? 'secondary' : 'ghost'
                                      }
                                      size="sm"
                                      className="text-xs px-2"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (!isDeployed) {
                                          onDeploy(version.id, env)
                                        }
                                      }}
                                      disabled={isDeployed}
                                      aria-label={
                                        isDeployed
                                          ? `Already deployed to ${env}`
                                          : `Deploy version ${version.version} to ${env}`
                                      }
                                    >
                                      {env[0]?.toUpperCase()}
                                    </Button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

PromptVersionHistory.displayName = 'PromptVersionHistory'
