'use client'

import * as React from 'react'

/**
 * ConsoleAlertHandler - Captures and displays console alerts
 * Used for development debugging and error monitoring.
 */

interface ConsoleAlert {
  id: string
  type: 'log' | 'warn' | 'error' | 'info'
  message: string
  timestamp: Date
  stack?: string
}

interface ConsoleAlertHandlerProps {
  /** Whether to capture alerts */
  enabled?: boolean
  /** Maximum alerts to keep */
  maxAlerts?: number
  /** Alert types to capture */
  types?: ('log' | 'warn' | 'error' | 'info')[]
  /** Callback when alert is captured */
  onAlert?: (alert: ConsoleAlert) => void
  children?: React.ReactNode
}

const ConsoleAlertContext = React.createContext<{
  alerts: ConsoleAlert[]
  clearAlerts: () => void
}>({
  alerts: [],
  clearAlerts: () => {},
})

export function useConsoleAlerts() {
  return React.useContext(ConsoleAlertContext)
}

export function ConsoleAlertHandler({
  enabled = true,
  maxAlerts = 100,
  types = ['warn', 'error'],
  onAlert,
  children,
}: ConsoleAlertHandlerProps) {
  const [alerts, setAlerts] = React.useState<ConsoleAlert[]>([])

  const clearAlerts = React.useCallback(() => {
    setAlerts([])
  }, [])

  React.useEffect(() => {
    if (!enabled) return

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
    }

    const createHandler =
      (type: 'log' | 'warn' | 'error' | 'info') =>
      (...args: unknown[]) => {
        originalConsole[type](...args)

        if (types.includes(type)) {
          const alert: ConsoleAlert = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            type,
            message: args
              .map((arg) =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              )
              .join(' '),
            timestamp: new Date(),
            stack: type === 'error' ? new Error().stack : undefined,
          }

          setAlerts((prev) => [...prev.slice(-maxAlerts + 1), alert])
          onAlert?.(alert)
        }
      }

    if (types.includes('log')) console.log = createHandler('log')
    if (types.includes('warn')) console.warn = createHandler('warn')
    if (types.includes('error')) console.error = createHandler('error')
    if (types.includes('info')) console.info = createHandler('info')

    return () => {
      console.log = originalConsole.log
      console.warn = originalConsole.warn
      console.error = originalConsole.error
      console.info = originalConsole.info
    }
  }, [enabled, maxAlerts, types, onAlert])

  return (
    <ConsoleAlertContext.Provider value={{ alerts, clearAlerts }}>
      {children}
    </ConsoleAlertContext.Provider>
  )
}

export type { ConsoleAlert, ConsoleAlertHandlerProps }
