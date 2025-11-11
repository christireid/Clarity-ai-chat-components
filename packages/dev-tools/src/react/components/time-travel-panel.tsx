/**
 * Time-Travel Debugging Panel Component
 * React 19 component using useOptimistic for state snapshots
 */

'use client'

import * as React from 'react'
import { useTimeTravel } from '../hooks/use-time-travel'
import { TimeTravelDebugger } from '../../debug/time-travel'

export interface TimeTravelPanelProps {
  className?: string
  timeTravelDebugger?: TimeTravelDebugger
}

/**
 * Time-Travel Debugging Panel Component
 * Displays state snapshots with optimistic updates
 */
export function TimeTravelPanel({ className, timeTravelDebugger }: TimeTravelPanelProps) {
  const {
    snapshots,
    currentIndex,
    current,
    timeline,
    stats,
    record,
    jumpTo,
    goBack,
    goForward,
    clear,
  } = useTimeTravel(timeTravelDebugger)

  return (
    <div className={className} data-testid="time-travel-panel">
      <div className="time-travel-header">
        <h2>Time-Travel Debugger</h2>
        <div className="time-travel-controls">
          <button onClick={() => goBack(1)} disabled={currentIndex <= 0}>
            ← Back
          </button>
          <button onClick={() => goForward(1)} disabled={currentIndex >= snapshots.length - 1}>
            Forward →
          </button>
          <button onClick={clear}>Clear</button>
        </div>
      </div>

      {stats.totalSnapshots > 0 && (
        <div className="time-travel-stats">
          <div className="stat">
            <span className="stat-label">Total Snapshots:</span>
            <span className="stat-value">{stats.totalSnapshots}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time Span:</span>
            <span className="stat-value">{Math.round(stats.timeSpan / 1000)}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">Avg Messages:</span>
            <span className="stat-value">{stats.averageMessageCount.toFixed(1)}</span>
          </div>
        </div>
      )}

      <div className="time-travel-timeline">
        {snapshots.length === 0 ? (
          <div className="empty-state">No snapshots recorded yet</div>
        ) : (
          <div className="timeline-list">
            {timeline.map((entry, index) => (
              <TimelineItem
                key={entry.snapshot.id}
                entry={entry}
                index={index}
                isCurrent={index === currentIndex}
                onJump={() => jumpTo(entry.snapshot.id)}
              />
            ))}
          </div>
        )}
      </div>

      {current && (
        <div className="current-snapshot">
          <h3>Current Snapshot</h3>
          <div className="snapshot-details">
            <div className="detail-item">
              <span>Label:</span>
              <span>{current.label || 'Unlabeled'}</span>
            </div>
            <div className="detail-item">
              <span>Messages:</span>
              <span>{current.messages.length}</span>
            </div>
            <div className="detail-item">
              <span>Timestamp:</span>
              <span>{current.timestamp.toLocaleTimeString()}</span>
            </div>
            {timeline.find(e => e.snapshot.id === current.id)?.transition && (
              <div className="detail-item">
                <span>Action:</span>
                <span>{timeline.find(e => e.snapshot.id === current.id)?.transition?.action}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface TimelineItemProps {
  entry: {
    snapshot: any
    transition?: any
    isCurrent: boolean
  }
  index: number
  isCurrent: boolean
  onJump: () => void
}

function TimelineItem({ entry, index, isCurrent, onJump }: TimelineItemProps) {
  return (
    <div
      className={`timeline-item ${isCurrent ? 'current' : ''}`}
      onClick={onJump}
    >
      <div className="timeline-marker">
        {isCurrent ? '▶' : '○'}
      </div>
      <div className="timeline-content">
        <div className="timeline-header">
          <span className="timeline-index">#{index}</span>
          <span className="timeline-label">{entry.snapshot.label || entry.snapshot.id.substring(0, 12)}</span>
          <span className="timeline-time">{entry.snapshot.timestamp.toLocaleTimeString()}</span>
        </div>
        <div className="timeline-info">
          <span>Messages: {entry.snapshot.messages.length}</span>
          {entry.transition && (
            <span>Action: {entry.transition.action}</span>
          )}
        </div>
      </div>
    </div>
  )
}
