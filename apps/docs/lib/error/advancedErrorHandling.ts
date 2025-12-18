import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Advanced error handling patterns with comprehensive error management
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error categories for better organization
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown'
}

/**
 * Enhanced error interface with additional metadata
 */
export interface EnhancedError extends Error {
  id: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  context?: Record<string, any>;
  userMessage?: string;
  recoverySuggestion?: string;
  originalError?: Error;
  stackTrace?: string;
}

/**
 * Error recovery options
 */
export interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
  onGiveUp?: (error: EnhancedError) => void;
}

/**
 * Global error handler configuration
 */
export interface ErrorHandlerConfig {
  defaultSeverity?: ErrorSeverity;
  enableLogging?: boolean;
  enableReporting?: boolean;
  maxStackTraceLength?: number;
  sanitizeErrors?: boolean;
  onError?: (error: EnhancedError) => void;
}

/**
 * Custom error class with enhanced functionality
 */
export class ClarityChatError extends Error implements EnhancedError {
  id: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  context?: Record<string, any>;
  userMessage?: string;
  recoverySuggestion?: string;
  originalError?: Error;
  stackTrace?: string;

  constructor(
    message: string,
    options: {
      severity?: ErrorSeverity;
      category?: ErrorCategory;
      context?: Record<string, any>;
      userMessage?: string;
      recoverySuggestion?: string;
      originalError?: Error;
      cause?: unknown;
    } = {}
  ) {
    super(message);
    
    this.name = 'ClarityChatError';
    this.id = generateErrorId();
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.category = options.category || ErrorCategory.UNKNOWN;
    this.timestamp = new Date();
    this.context = options.context;
    this.userMessage = options.userMessage;
    this.recoverySuggestion = options.recoverySuggestion;
    this.originalError = options.originalError;
    this.stackTrace = this.stack;

    // Set the prototype explicitly for instanceof checks
    Object.setPrototypeOf(this, ClarityChatError.prototype);
  }
}

/**
 * Error boundary component with advanced features
 */
export class AdvancedErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: EnhancedError; reset: () => void }>;
  onError?: (error: EnhancedError, errorInfo: React.ErrorInfo) => void;
  config?: ErrorHandlerConfig;
}> {
  state: {
    hasError: boolean;
    error: EnhancedError | null;
  };

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    const enhancedError = enhanceError(error);
    return { hasError: true, error: enhancedError };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const enhancedError = enhanceError(error);
    this.setState({ hasError: true, error: enhancedError });

    // Log error details
    if (this.props.config?.enableLogging) {
      console.error('Error caught by boundary:', enhancedError);
      console.error('Error info:', errorInfo);
    }

    // Report error if enabled
    if (this.props.config?.enableReporting) {
      this.reportError(enhancedError, errorInfo);
    }

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(enhancedError, errorInfo);
    }
  }

  reportError(error: EnhancedError, errorInfo: React.ErrorInfo) {
    // Implement error reporting (e.g., to external service)
    // This is a placeholder for actual error reporting implementation
    const report = {
      error: {
        id: error.id,
        message: error.message,
        severity: error.severity,
        category: error.category,
        timestamp: error.timestamp,
        stackTrace: error.stackTrace,
        context: sanitizeContext(error.context)
      },
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Send to error reporting service
    // errorReportingService.report(report);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      // Default fallback UI
      return (
        <div className="error-boundary-fallback" role="alert">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          {this.state.error.userMessage && (
            <p className="user-message">{this.state.error.userMessage}</p>
          )}
          {this.state.error.recoverySuggestion && (
            <p className="recovery-suggestion">{this.state.error.recoverySuggestion}</p>
          )}
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Error recovery hook with retry logic
 */
export function useErrorRecovery(
  operation: () => Promise<any>,
  options: ErrorRecoveryOptions = {}
) {
  const [isRecovering, setIsRecovering] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastError, setLastError] = useState<EnhancedError | null>(null);

  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2,
    onRetry,
    onGiveUp
  } = options;

  const recover = useCallback(async () => {
    setIsRecovering(true);
    setLastError(null);

    try {
      await operation();
      setAttemptCount(0);
    } catch (error) {
      const enhancedError = enhanceError(error);
      setLastError(enhancedError);
      setAttemptCount(prev => prev + 1);

      if (attemptCount < maxRetries) {
        // Calculate delay with exponential backoff
        const delay = retryDelay * Math.pow(backoffMultiplier, attemptCount);
        
        if (onRetry) {
          onRetry(attemptCount + 1);
        }

        // Retry after delay
        setTimeout(() => {
          recover();
        }, delay);
      } else {
        // Max retries reached
        if (onGiveUp) {
          onGiveUp(enhancedError);
        }
      }
    } finally {
      setIsRecovering(false);
    }
  }, [operation, attemptCount, maxRetries, retryDelay, backoffMultiplier, onRetry, onGiveUp]);

  const reset = useCallback(() => {
    setAttemptCount(0);
    setLastError(null);
  }, []);

  return {
    recover,
    reset,
    isRecovering,
    attemptCount,
    lastError,
    canRetry: attemptCount < maxRetries
  };
}

/**
 * Global error handler
 */
export function useGlobalErrorHandler(config: ErrorHandlerConfig = {}) {
  const {
    defaultSeverity = ErrorSeverity.MEDIUM,
    enableLogging = true,
    enableReporting = false,
    maxStackTraceLength = 1000,
    sanitizeErrors = true,
    onError: onErrorCallback
  } = config;

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const enhancedError = new ClarityChatError(event.error?.message || 'Unknown error', {
        severity: defaultSeverity,
        category: ErrorCategory.SYSTEM,
        originalError: event.error,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      });

      if (enableLogging) {
        console.error('Global error caught:', enhancedError);
      }

      if (onErrorCallback) {
        onErrorCallback(enhancedError);
      }

      // Prevent default error handling
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const enhancedError = new ClarityChatError('Unhandled promise rejection', {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.SYSTEM,
        originalError: event.reason instanceof Error ? event.reason : undefined,
        context: {
          reason: event.reason,
          url: window.location.href,
          timestamp: new Date().toISOString()
        }
      });

      if (enableLogging) {
        console.error('Unhandled rejection caught:', enhancedError);
      }

      if (onErrorCallback) {
        onErrorCallback(enhancedError);
      }

      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [defaultSeverity, enableLogging, enableReporting, maxStackTraceLength, sanitizeErrors, onErrorCallback]);
}

/**
 * Form validation error handling
 */
export interface ValidationError {
  field: string;
  message: string;
  severity?: ErrorSeverity;
}

export function useFormValidation<T extends Record<string, any>>(
  validators: Record<keyof T, (value: any) => string | null>
) {
  const [errors, setErrors] = useState<Record<string, ValidationError>>({});
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((data: T) => {
    const newErrors: Record<string, ValidationError> = {};
    let hasErrors = false;

    Object.keys(validators).forEach(field => {
      const fieldKey = field as keyof T;
      const validator = validators[fieldKey];
      const value = data[fieldKey];
      const errorMessage = validator(value);

      if (errorMessage) {
        newErrors[field] = {
          field: field as string,
          message: errorMessage,
          severity: ErrorSeverity.MEDIUM
        };
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setIsValid(!hasErrors);

    return { isValid: !hasErrors, errors: newErrors };
  }, [validators]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  return {
    errors,
    isValid,
    validate,
    clearError,
    clearAllErrors
  };
}

/**
 * Helper functions
 */
function enhanceError(error: unknown): EnhancedError {
  if (error instanceof ClarityChatError) {
    return error;
  }

  if (error instanceof Error) {
    return new ClarityChatError(error.message, {
      originalError: error,
      stack: error.stack
    });
  }

  return new ClarityChatError(String(error), {
    category: ErrorCategory.UNKNOWN
  });
}

function generateErrorId(): string {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
  if (!context) return undefined;

  // Remove sensitive information
  const sanitized = { ...context };
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
  
  Object.keys(sanitized).forEach(key => {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    }
  });

  return sanitized;
}

/**
 * Error boundary HOC
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallback?: React.ComponentType<{ error: EnhancedError; reset: () => void }>;
    onError?: (error: EnhancedError, errorInfo: React.ErrorInfo) => void;
    config?: ErrorHandlerConfig;
  } = {}
) {
  return class WithErrorBoundary extends React.Component<P> {
    render() {
      return (
        <AdvancedErrorBoundary
          fallback={options.fallback}
          onError={options.onError}
          config={options.config}
        >
          <Component {...this.props} />
        </AdvancedErrorBoundary>
      );
    }
  };
}