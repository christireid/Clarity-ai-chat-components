/**
 * Error Reporter
 *
 * Centralized error reporting service for tracking and analyzing errors.
 */

export interface ErrorReport {
  timestamp: number
  componentName?: string
  error: {
    name: string
    message: string
    stack?: string
  }
  errorInfo?: {
    componentStack: string
  }
  userAgent: string
  url: string
  additionalData?: Record<string, any>
}

/**
 * Error reporting service
 */
class ErrorReporter {
  private static instance: ErrorReporter
  private reports: ErrorReport[] = []
  private maxReports = 100

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter()
    }
    return ErrorReporter.instance
  }

  /**
   * Report an error
   */
  report(report: Omit<ErrorReport, 'timestamp' | 'userAgent' | 'url'>): void {
    const fullReport: ErrorReport = {
      timestamp: Date.now(),
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...report,
    }

    this.reports.push(fullReport)

    // Keep only the most recent reports
    if (this.reports.length > this.maxReports) {
      this.reports = this.reports.slice(-this.maxReports)
    }

    // Log in development
    if (process.env['NODE_ENV'] === 'development') {
      console.error('Error Boundary caught an error:', fullReport)
    }

    // In production, you might want to send this to an error reporting service
    // this.sendToErrorReportingService(fullReport)
  }

  /**
   * Get all error reports
   */
  getReports(): ErrorReport[] {
    return this.reports
  }

  /**
   * Clear error reports
   */
  clearReports(): void {
    this.reports = []
  }

  /**
   * Get error summary
   */
  getErrorSummary(): {
    totalErrors: number
    errorsByComponent: Record<string, number>
    recentErrors: ErrorReport[]
  } {
    const errorsByComponent: Record<string, number> = {}

    this.reports.forEach((report) => {
      const component = report.componentName || 'unknown'
      errorsByComponent[component] = (errorsByComponent[component] || 0) + 1
    })

    return {
      totalErrors: this.reports.length,
      errorsByComponent,
      recentErrors: this.reports.slice(-10),
    }
  }
}

// Global error reporter instance
export const errorReporter = ErrorReporter.getInstance()
