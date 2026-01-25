/**
 * Chat Synchronization Status Component
 *
 * Displays sync status, allows manual sync, shows conflicts, and manages
 * real-time sync settings.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import {
  SyncIcon,
  WifiIcon,
  WifiSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
} from '../ui/icons'
import { formatRelativeTime } from '../../internal/helpers'
import { ANIMATION_PRESETS } from '../../animations/constants'
import type { ChatSyncReturn } from '../../hooks/chat/use-chat-sync'

export interface ChatSyncStatusProps {
  /** Sync hook return value */
  sync: ChatSyncReturn
  /** Show detailed sync information */
  showDetails?: boolean
  /** Show real-time sync toggle */
  showRealtimeToggle?: boolean
  /** Show manual sync button */
  showManualSync?: boolean
  /** Custom class name */
  className?: string
  /** Compact mode */
  compact?: boolean
}

/**
 * Chat Sync Status Component
 */
export function ChatSyncStatus({
  sync,
  showDetails = true,
  showRealtimeToggle = true,
  showManualSync = true,
  className,
  compact = false,
}: ChatSyncStatusProps) {
  const { status, actions, lastSyncResult, errors } = sync
  const [showErrors, setShowErrors] = React.useState(false)
  const [isManualSyncing, setIsManualSyncing] = React.useState(false)

  const handleManualSync = async () => {
    setIsManualSyncing(true)
    try {
      await actions.syncNow()
    } finally {
      setIsManualSyncing(false)
    }
  }

  const getStatusIcon = () => {
    if (!status.isOnline)
      return <WifiSlashIcon className="w-4 h-4 text-muted-foreground" />
    if (status.isSyncing)
      return <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />
    if (errors.length > 0)
      return <ExclamationTriangleIcon className="w-4 h-4 text-destructive" />
    return <CheckCircleIcon className="w-4 h-4 text-green-500" />
  }

  const getStatusText = () => {
    if (!status.isOnline) return 'Offline'
    if (status.isSyncing) return 'Syncing...'
    if (errors.length > 0) return 'Sync Error'
    if (status.lastSyncTime > 0) return 'Synced'
    return 'Not Synced'
  }

  const getStatusColor = () => {
    if (!status.isOnline) return 'text-muted-foreground'
    if (status.isSyncing) return 'text-blue-500'
    if (errors.length > 0) return 'text-destructive'
    return 'text-green-500'
  }

  if (compact) {
    return (
      <motion.div
        {...ANIMATION_PRESETS.scale}
        viewport={{ once: true }}
        className={`flex items-center gap-2 px-3 py-2 bg-muted/50 border rounded-lg ${className}`}
      >
        {getStatusIcon()}
        <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span>
        {status.pendingChanges > 0 && (
          <Badge variant="secondary" className="text-xs">
            {status.pendingChanges} pending
          </Badge>
        )}
        {showManualSync && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManualSync}
            disabled={!status.isOnline || isManualSyncing}
            className="ml-auto"
          >
            <ArrowPathIcon
              className={`w-3 h-3 ${isManualSyncing ? 'animate-spin' : ''}`}
            />
          </Button>
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        {...ANIMATION_PRESETS.slideDown}
        viewport={{ once: true }}
        className={className}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <SyncIcon className="w-4 h-4" />
                Sync Status
                <Badge
                  variant={status.isOnline ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {status.isOnline ? (
                    <WifiIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <WifiSlashIcon className="w-3 h-3 mr-1" />
                  )}
                  {status.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Sync Statistics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Last Sync</div>
                <div className="font-medium">
                  {status.lastSyncTime > 0
                    ? formatRelativeTime(new Date(status.lastSyncTime))
                    : 'Never'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Pending Changes</div>
                <div className="font-medium">
                  {status.pendingChanges}
                  {status.pendingChanges > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Queued
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time Sync Toggle */}
            {showRealtimeToggle && (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label
                    htmlFor="realtime-sync"
                    className="text-sm font-medium"
                  >
                    Real-time Sync
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Sync changes instantly across devices
                  </p>
                </div>
                <Switch
                  id="realtime-sync"
                  checked={status.realtimeEnabled}
                  onCheckedChange={(enabled: boolean) => {
                    if (enabled) {
                      actions.enableRealtime()
                    } else {
                      actions.disableRealtime()
                    }
                  }}
                />
              </div>
            )}

            {/* Last Sync Result */}
            {lastSyncResult && showDetails && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Last Sync Result</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-green-600">
                      {lastSyncResult.syncedItems}
                    </div>
                    <div className="text-muted-foreground">Synced</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">
                      {lastSyncResult.conflictsResolved}
                    </div>
                    <div className="text-muted-foreground">Conflicts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">
                      {lastSyncResult.errors.length}
                    </div>
                    <div className="text-muted-foreground">Errors</div>
                  </div>
                </div>
              </div>
            )}

            {/* Sync Errors */}
            {errors.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowErrors(!showErrors)}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  {showErrors ? (
                    <EyeSlashIcon className="w-3 h-3" />
                  ) : (
                    <EyeIcon className="w-3 h-3" />
                  )}
                  {errors.length} Sync Error{errors.length !== 1 ? 's' : ''}
                </Button>

                <AnimatePresence>
                  {showErrors && (
                    <motion.div
                      {...ANIMATION_PRESETS.collapse}
                      viewport={{ once: true }}
                      className="space-y-2"
                    >
                      {errors.slice(-3).map((error, index) => (
                        <div
                          key={index}
                          className="text-xs p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive"
                        >
                          <div className="font-medium">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </div>
                          <div>{error.error}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Manual Sync */}
            {showManualSync && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleManualSync}
                  disabled={
                    !status.isOnline || isManualSyncing || status.isSyncing
                  }
                  className="flex-1"
                >
                  {isManualSyncing ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <SyncIcon className="w-4 h-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Sync Progress Indicator */}
            {status.isSyncing && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Syncing changes...
                </div>
                <Progress value={undefined} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

ChatSyncStatus.displayName = 'ChatSyncStatus'
