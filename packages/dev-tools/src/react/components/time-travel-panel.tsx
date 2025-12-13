/**
 * Time-Travel Debugging Panel Component
 * Premium state debugging with visual timeline and diff visualization
 * React 19 component using useOptimistic for state snapshots
 */

'use client'

import * as React from 'react'
import { useTimeTravel } from '../hooks/use-time-travel'
import { TimeTravelDebugger } from '../../debug/time-travel'

export interface TimeTravelPanelProps {
  /** Additional CSS classes */
  className?: string
  /** External time travel debugger instance */
  timeTravelDebugger?: TimeTravelDebugger
  /** Show compact view */
  compact?: boolean
  /** Enable auto-record on state changes */
  autoRecord?: boolean
}

/**
 * Icons for the time travel panel
 */
const Icons = {
  Clock: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Rewind: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
    </svg>
  ),
  FastForward: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  ),
  SkipBack: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" y2="5" />
    </svg>
  ),
  SkipForward: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  ),
  Trash: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Pause: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  ),
  MessageSquare: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  GitCommit: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="1.05" y1="12" x2="7" y2="12" />
      <line x1="17.01" y1="12" x2="22.96" y2="12" />
    </svg>
  ),
  History: () => (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
}

/**
 * Time-Travel Debugging Panel Component
 * Displays state snapshots with optimistic updates
 */
export function TimeTravelPanel({
  className,
  timeTravelDebugger,
  compact = false,
  autoRecord = false,
}: TimeTravelPanelProps) {
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

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1000) // ms between snapshots
  const playbackRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-playback through snapshots
  React.useEffect(() => {
    if (isPlaying && snapshots.length > 0) {
      playbackRef.current = setInterval(() => {
        if (currentIndex < snapshots.length - 1) {
          goForward(1)
        } else {
          setIsPlaying(false)
        }
      }, playbackSpeed)
    }

    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current)
      }
    }
  }, [isPlaying, currentIndex, snapshots.length, goForward, playbackSpeed])

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleJumpToStart = () => {
    if (snapshots.length > 0) {
      jumpTo(snapshots[0].id)
    }
    setIsPlaying(false)
  }

  const handleJumpToEnd = () => {
    if (snapshots.length > 0) {
      jumpTo(snapshots[snapshots.length - 1].id)
    }
    setIsPlaying(false)
  }

  // Calculate progress percentage
  const progressPercent =
    snapshots.length > 1 ? (currentIndex / (snapshots.length - 1)) * 100 : 0

  return (
    <div
      className={`time-travel-panel ${compact ? 'compact' : ''} ${className || ''}`}
      data-testid="time-travel-panel"
    >
      {/* Header */}
      <header className="time-travel-header">
        <h2>
          <Icons.Clock />
          Time Travel Debugger
        </h2>
        <div className="time-travel-controls">
          <button
            className="dt-btn dt-btn-ghost dt-btn-icon"
            onClick={clear}
            aria-label="Clear all snapshots"
            title="Clear snapshots"
          >
            <Icons.Trash />
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      {stats.totalSnapshots > 0 && (
        <div
          className="time-travel-stats"
          role="region"
          aria-label="Time travel statistics"
        >
          <div className="stat">
            <span className="stat-label">Snapshots</span>
            <span className="stat-value">{stats.totalSnapshots}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time Span</span>
            <span className="stat-value">{formatTimeSpan(stats.timeSpan)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Avg Messages</span>
            <span className="stat-value">
              {stats.averageMessageCount.toFixed(1)}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Position</span>
            <span className="stat-value">
              {snapshots.length > 0
                ? `${currentIndex + 1} / ${snapshots.length}`
                : '0 / 0'}
            </span>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      {snapshots.length > 0 && (
        <div
          className="time-travel-playback"
          role="region"
          aria-label="Playback controls"
        >
          <div className="playback-controls">
            <button
              className="dt-btn dt-btn-ghost dt-btn-icon"
              onClick={handleJumpToStart}
              disabled={currentIndex === 0}
              aria-label="Jump to first snapshot"
              title="First"
            >
              <Icons.SkipBack />
            </button>
            <button
              className="dt-btn dt-btn-ghost dt-btn-icon"
              onClick={() => {
                goBack(1)
                setIsPlaying(false)
              }}
              disabled={currentIndex <= 0}
              aria-label="Go back one snapshot"
              title="Previous"
            >
              <Icons.Rewind />
            </button>
            <button
              className="dt-btn dt-btn-primary dt-btn-icon playback-btn"
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause playback' : 'Start playback'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Icons.Pause /> : <Icons.Play />}
            </button>
            <button
              className="dt-btn dt-btn-ghost dt-btn-icon"
              onClick={() => {
                goForward(1)
                setIsPlaying(false)
              }}
              disabled={currentIndex >= snapshots.length - 1}
              aria-label="Go forward one snapshot"
              title="Next"
            >
              <Icons.FastForward />
            </button>
            <button
              className="dt-btn dt-btn-ghost dt-btn-icon"
              onClick={handleJumpToEnd}
              disabled={currentIndex === snapshots.length - 1}
              aria-label="Jump to last snapshot"
              title="Last"
            >
              <Icons.SkipForward />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="playback-progress">
            <div
              className="progress-track"
              role="slider"
              aria-label="Timeline position"
              aria-valuemin={0}
              aria-valuemax={snapshots.length - 1}
              aria-valuenow={currentIndex}
            >
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              {snapshots.map((snapshot, index) => (
                <button
                  key={snapshot.id}
                  className={`progress-marker ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'past' : ''}`}
                  style={{
                    left: `${snapshots.length > 1 ? (index / (snapshots.length - 1)) * 100 : 50}%`,
                  }}
                  onClick={() => {
                    jumpTo(snapshot.id)
                    setIsPlaying(false)
                  }}
                  aria-label={`Jump to snapshot ${index + 1}: ${snapshot.label || 'Unlabeled'}`}
                  title={snapshot.label || `Snapshot ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Speed Control */}
          <div className="playback-speed">
            <label htmlFor="playback-speed">Speed:</label>
            <select
              id="playback-speed"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="speed-select"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div
        className="time-travel-timeline"
        role="region"
        aria-label="Snapshot timeline"
      >
        {snapshots.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="timeline-list" role="list">
            {timeline.map((entry, index) => (
              <TimelineItem
                key={entry.snapshot.id}
                entry={entry}
                index={index}
                isCurrent={index === currentIndex}
                isLast={index === snapshots.length - 1}
                onJump={() => {
                  jumpTo(entry.snapshot.id)
                  setIsPlaying(false)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Current Snapshot Details */}
      {current && (
        <div
          className="current-snapshot"
          role="region"
          aria-label="Current snapshot details"
        >
          <header className="current-snapshot-header">
            <h3>Current State</h3>
            <span className="snapshot-position">
              Snapshot {currentIndex + 1} of {snapshots.length}
            </span>
          </header>
          <div className="snapshot-details">
            <dl className="snapshot-info">
              <div className="info-item">
                <dt>Label</dt>
                <dd>{current.label || 'Unlabeled'}</dd>
              </div>
              <div className="info-item">
                <dt>Messages</dt>
                <dd className="highlight">{current.messages.length}</dd>
              </div>
              <div className="info-item">
                <dt>Timestamp</dt>
                <dd>{current.timestamp.toLocaleTimeString()}</dd>
              </div>
              {timeline[currentIndex]?.transition && (
                <div className="info-item">
                  <dt>Action</dt>
                  <dd className="action-badge">
                    {timeline[currentIndex].transition?.action}
                  </dd>
                </div>
              )}
            </dl>

            {/* Messages Preview */}
            {current.messages.length > 0 && (
              <div className="messages-preview">
                <h4>Messages ({current.messages.length})</h4>
                <ul className="messages-list">
                  {current.messages.slice(-5).map((msg, i) => (
                    <li key={i} className={`message-item ${msg.role}`}>
                      <span className="message-role">{msg.role}</span>
                      <span className="message-content">
                        {typeof msg.content === 'string'
                          ? msg.content.substring(0, 100) +
                            (msg.content.length > 100 ? '...' : '')
                          : '[Complex content]'}
                      </span>
                    </li>
                  ))}
                </ul>
                {current.messages.length > 5 && (
                  <p className="messages-more">
                    + {current.messages.length - 5} more messages
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState() {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true">
        <Icons.History />
      </div>
      <h3 className="empty-state-title">No snapshots recorded</h3>
      <p className="empty-state-description">
        State snapshots will appear here as you record them. Use the record
        function to capture conversation states.
      </p>
    </div>
  )
}

/**
 * Timeline item component
 */
interface TimelineItemProps {
  entry: {
    snapshot: any
    transition?: any
    isCurrent: boolean
  }
  index: number
  isCurrent: boolean
  isLast: boolean
  onJump: () => void
}

function TimelineItem({
  entry,
  index,
  isCurrent,
  isLast,
  onJump,
}: TimelineItemProps) {
  const { snapshot, transition } = entry

  return (
    <div
      className={`timeline-item ${isCurrent ? 'current' : ''}`}
      role="listitem"
      aria-current={isCurrent ? 'step' : undefined}
    >
      {/* Connector Line */}
      {!isLast && <div className="timeline-connector" aria-hidden="true" />}

      {/* Marker */}
      <div
        className={`timeline-marker ${isCurrent ? 'active' : ''}`}
        aria-hidden="true"
      >
        {isCurrent ? <Icons.Play /> : <span className="marker-dot" />}
      </div>

      {/* Content */}
      <div
        className="timeline-content"
        onClick={onJump}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onJump()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Jump to snapshot ${index + 1}: ${snapshot.label || 'Unlabeled'}`}
      >
        <header className="timeline-header">
          <span className="timeline-index">#{index + 1}</span>
          <span className="timeline-label">
            {snapshot.label || `Snapshot ${snapshot.id.substring(0, 8)}`}
          </span>
          <span className="timeline-time">
            {snapshot.timestamp.toLocaleTimeString()}
          </span>
        </header>
        <div className="timeline-info">
          <span className="info-badge">
            <Icons.MessageSquare />
            {snapshot.messages.length} messages
          </span>
          {transition && (
            <span className="info-badge action">
              <Icons.GitCommit />
              {transition.action}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Format time span for display
 */
function formatTimeSpan(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  if (ms < 3600000)
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`
}
