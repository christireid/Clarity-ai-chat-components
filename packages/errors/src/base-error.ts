/**
 * Base error class for Clarity Chat
 * Provides structured error information with helpful debugging context
 */

export interface ErrorContext {
  /** Where the error occurred (file, function, line) */
  location?: string
  /** What the user was trying to do */
  action?: string
  /** Relevant data that might help debugging */
  data?: Record<string, any>
  /** Stack trace from the original error */
  originalStack?: string
}

export interface ErrorSolution {
  /** Brief description of the solution */
  description: string
  /** Step-by-step instructions */
  steps?: string[]
  /** Code example showing the fix */
  example?: string
  /** Link to documentation */
  docsUrl?: string
}

export abstract class ClarityError extends Error {
  /** Error code for programmatic handling */
  public readonly code: string
  
  /** User-friendly error message */
  public readonly userMessage: string
  
  /** Technical details for developers */
  public readonly technicalMessage: string
  
  /** Suggested solutions */
  public readonly solutions: ErrorSolution[]
  
  /** Additional context */
  public readonly context: ErrorContext
  
  /** Timestamp when error occurred */
  public readonly timestamp: Date
  
  /** Original error if this wraps another error */
  public readonly originalError?: Error

  constructor(
    code: string,
    userMessage: string,
    technicalMessage: string,
    solutions: ErrorSolution[] = [],
    context: ErrorContext = {},
    originalError?: Error
  ) {
    super(userMessage)
    
    this.name = this.constructor.name
    this.code = code
    this.userMessage = userMessage
    this.technicalMessage = technicalMessage
    this.solutions = solutions
    this.context = context
    this.timestamp = new Date()
    this.originalError = originalError
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor)
    
    // Preserve original stack if available
    if (originalError?.stack) {
      this.context.originalStack = originalError.stack
    }
  }

  /**
   * Format error for display in terminal
   */
  toTerminalString(): string {
    const lines: string[] = []
    
    lines.push(`\n❌ ${this.name}: ${this.userMessage}`)
    lines.push(`\nCode: ${this.code}`)
    
    if (this.technicalMessage) {
      lines.push(`\n📋 Technical Details:`)
      lines.push(`   ${this.technicalMessage}`)
    }
    
    if (this.context.location) {
      lines.push(`\n📍 Location: ${this.context.location}`)
    }
    
    if (this.context.action) {
      lines.push(`\n🎯 Action: ${this.context.action}`)
    }
    
    if (this.context.data && Object.keys(this.context.data).length > 0) {
      lines.push(`\n📊 Context Data:`)
      Object.entries(this.context.data).forEach(([key, value]) => {
        lines.push(`   ${key}: ${JSON.stringify(value)}`)
      })
    }
    
    if (this.solutions.length > 0) {
      lines.push(`\n💡 Suggested Solutions:`)
      this.solutions.forEach((solution, index) => {
        lines.push(`\n   ${index + 1}. ${solution.description}`)
        
        if (solution.steps) {
          solution.steps.forEach((step, stepIndex) => {
            lines.push(`      ${stepIndex + 1}. ${step}`)
          })
        }
        
        if (solution.example) {
          lines.push(`\n      Example:`)
          lines.push(`      ${solution.example.split('\n').join('\n      ')}`)
        }
        
        if (solution.docsUrl) {
          lines.push(`\n      📚 Documentation: ${solution.docsUrl}`)
        }
      })
    }
    
    if (this.originalError) {
      lines.push(`\n🔍 Original Error: ${this.originalError.message}`)
    }
    
    lines.push('') // Empty line at end
    
    return lines.join('\n')
  }

  /**
   * Format error for JSON API response
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.userMessage,
      technicalMessage: this.technicalMessage,
      solutions: this.solutions,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      ...(this.originalError && {
        originalError: {
          message: this.originalError.message,
          stack: this.originalError.stack
        }
      })
    }
  }

  /**
   * Format error for logging
   */
  toLogString(): string {
    return JSON.stringify({
      timestamp: this.timestamp.toISOString(),
      level: 'error',
      name: this.name,
      code: this.code,
      message: this.userMessage,
      technical: this.technicalMessage,
      context: this.context,
      stack: this.stack
    })
  }
}
