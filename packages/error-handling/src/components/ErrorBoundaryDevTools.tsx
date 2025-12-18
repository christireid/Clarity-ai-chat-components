'use client'

import * as React from 'react'
import { useErrorAnalyticsOptional } from '../hooks/useErrorAnalytics'

interface ErrorBoundaryInfo {
  id: string
  name: string
  hasError: boolean
  error?: Error
  errorTime?: string
  retryCount: number
  circuitState?: 'closed' | 'open' | 'half-open'
}

interface ErrorBoundaryDevToolsContextValue {
  register: (info: ErrorBoundaryInfo) => void
  unregister: (id: string) => void
  update: (id: string, info: Partial<ErrorBoundaryInfo>) => void
}

const DevToolsContext =
  React.createContext<ErrorBoundaryDevToolsContextValue | null>(null)

/**
 * Hook for error boundaries to register with dev tools
 */
export function useDevToolsRegistration(
  id: string,
  name: string
): (info: Partial<ErrorBoundaryInfo>) => void {
  const devTools = React.useContext(DevToolsContext)

  React.useEffect(() => {
    devTools?.register({
      id,
      name,
      hasError: false,
      retryCount: 0,
    })

    return () => devTools?.unregister(id)
  }, [id, name, devTools])

  return React.useCallback(
    (info: Partial<ErrorBoundaryInfo>) => {
      devTools?.update(id, info)
    },
    [id, devTools]
  )
}

export interface ErrorBoundaryDevToolsProps {
  children: React.ReactNode
  /** Initial panel position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Initial panel visibility */
  defaultOpen?: boolean
}

/**
 * Development tools panel for debugging error boundaries
 *
 * Only renders in development mode. Automatically excluded from production builds.
 *
 * @example
 * ```tsx
 * // Wrap your app
 * <ErrorBoundaryDevTools>
 *   <App />
 * </ErrorBoundaryDevTools>
 * ```
 */
export function ErrorBoundaryDevTools({
  children,
  position = 'bottom-right',
  defaultOpen = false,
}: ErrorBoundaryDevToolsProps) {
  // Only render in development
  if (process.env['NODE_ENV'] !== 'development') {
    return <>{children}</>
  }

  return (
    <DevToolsProvider position={position} defaultOpen={defaultOpen}>
      {children}
    </DevToolsProvider>
  )
}

function DevToolsProvider({
  children,
  position,
  defaultOpen,
}: {
  children: React.ReactNode
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  defaultOpen: boolean
}) {
  const [boundaries, setBoundaries] = React.useState<
    Map<string, ErrorBoundaryInfo>
  >(new Map())
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [isDragging, setIsDragging] = React.useState(false)
  const [panelPosition, setPanelPosition] = React.useState({ x: 0, y: 0 })
  const dragStartRef = React.useRef({ x: 0, y: 0 })

  const analytics = useErrorAnalyticsOptional()

  const register = React.useCallback((info: ErrorBoundaryInfo) => {
    setBoundaries((prev) => new Map(prev).set(info.id, info))
  }, [])

  const unregister = React.useCallback((id: string) => {
    setBoundaries((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const update = React.useCallback(
    (id: string, info: Partial<ErrorBoundaryInfo>) => {
      setBoundaries((prev) => {
        const existing = prev.get(id)
        if (!existing) return prev
        return new Map(prev).set(id, { ...existing, ...info })
      })
    },
    []
  )

  const contextValue = React.useMemo(
    () => ({ register, unregister, update }),
    [register, unregister, update]
  )

  const positionStyles: React.CSSProperties = {
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
  }[position]

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y,
    }
  }

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      setPanelPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      })
    },
    [isDragging]
  )

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (!isDragging) return

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const boundaryList = Array.from(boundaries.values())
  const errorsCount = boundaryList.filter((b) => b.hasError).length
  const stats = analytics?.getStats()

  return (
    <DevToolsContext.Provider value={contextValue}>
      {children}

      {/* Dev Tools Panel */}
      <div
        style={{
          position: 'fixed',
          ...positionStyles,
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
          zIndex: 99999,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '12px',
        }}
      >
        {/* Toggle Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: '8px 12px',
              backgroundColor: errorsCount > 0 ? '#ef4444' : '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <span>🛠️</span>
            <span>Error DevTools</span>
            {errorsCount > 0 && (
              <span
                style={{
                  backgroundColor: 'white',
                  color: '#ef4444',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                }}
              >
                {errorsCount}
              </span>
            )}
          </button>
        )}

        {/* Panel */}
        {isOpen && (
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: '360px',
              maxHeight: '500px',
              backgroundColor: '#1f2937',
              color: '#f3f4f6',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'default',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '12px',
                backgroundColor: '#111827',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'grab',
              }}
            >
              <span style={{ fontWeight: 600 }}>
                🛠️ Error Boundary DevTools
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>

            {/* Stats Summary */}
            {stats && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#374151',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                <StatBox label="Total Errors" value={stats.totalErrors} />
                <StatBox
                  label="Retry Rate"
                  value={`${stats.retrySuccessRate.toFixed(0)}%`}
                />
                <StatBox
                  label="Circuit Trips"
                  value={stats.circuitBreakerTrips}
                />
              </div>
            )}

            {/* Boundaries List */}
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {boundaryList.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: '#9ca3af',
                  }}
                >
                  No error boundaries registered
                </div>
              ) : (
                boundaryList.map((boundary) => (
                  <BoundaryItem key={boundary.id} boundary={boundary} />
                ))
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                padding: '8px 12px',
                borderTop: '1px solid #374151',
                display: 'flex',
                gap: '8px',
              }}
            >
              <ActionButton
                onClick={() => {
                  const error = new Error('Test error from DevTools')
                  throw error
                }}
              >
                Trigger Test Error
              </ActionButton>
              {analytics && (
                <ActionButton
                  onClick={() => {
                    const data = analytics.exportData()
                    console.log('[DevTools] Exported data:', data)
                    navigator.clipboard?.writeText(
                      JSON.stringify(data, null, 2)
                    )
                  }}
                >
                  Export Data
                </ActionButton>
              )}
            </div>
          </div>
        )}
      </div>
    </DevToolsContext.Provider>
  )
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: '10px', color: '#9ca3af' }}>{label}</div>
    </div>
  )
}

function BoundaryItem({ boundary }: { boundary: ErrorBoundaryInfo }) {
  return (
    <div
      style={{
        padding: '12px',
        borderBottom: '1px solid #374151',
        backgroundColor: boundary.hasError
          ? 'rgba(239, 68, 68, 0.1)'
          : 'transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
        }}
      >
        <span style={{ fontWeight: 500 }}>{boundary.name}</span>
        <StatusBadge
          hasError={boundary.hasError}
          circuitState={boundary.circuitState}
        />
      </div>
      {boundary.hasError && boundary.error && (
        <div
          style={{
            fontSize: '11px',
            color: '#f87171',
            marginTop: '4px',
            padding: '4px 8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '4px',
          }}
        >
          {boundary.error.message}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '8px',
          fontSize: '10px',
          color: '#9ca3af',
        }}
      >
        <span>Retries: {boundary.retryCount}</span>
        {boundary.errorTime && <span>Last: {boundary.errorTime}</span>}
      </div>
    </div>
  )
}

function StatusBadge({
  hasError,
  circuitState,
}: {
  hasError: boolean
  circuitState?: string
}) {
  if (hasError) {
    return (
      <span
        style={{
          padding: '2px 6px',
          backgroundColor: '#ef4444',
          borderRadius: '4px',
          fontSize: '10px',
        }}
      >
        ERROR
      </span>
    )
  }

  if (circuitState === 'open') {
    return (
      <span
        style={{
          padding: '2px 6px',
          backgroundColor: '#f59e0b',
          borderRadius: '4px',
          fontSize: '10px',
        }}
      >
        CIRCUIT OPEN
      </span>
    )
  }

  return (
    <span
      style={{
        padding: '2px 6px',
        backgroundColor: '#10b981',
        borderRadius: '4px',
        fontSize: '10px',
      }}
    >
      OK
    </span>
  )
}

function ActionButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        backgroundColor: '#374151',
        color: '#f3f4f6',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '11px',
      }}
    >
      {children}
    </button>
  )
}
