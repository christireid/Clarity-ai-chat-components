import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';

// Extend Window interface for Google Analytics gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnNavigate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
  lastErrorTime: number;
}

/**
 * Enhanced Error Boundary with comprehensive error handling and recovery
 */
export class EnhancedErrorBoundary extends Component<Props, State> {
  private static errorCount = 0;
  private static lastResetTime = Date.now();
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    EnhancedErrorBoundary.errorCount++;
    return {
      hasError: true,
      error,
      errorCount: EnhancedErrorBoundary.errorCount,
      lastErrorTime: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);
    
    // Call user-provided error handler
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }

    // Implement circuit breaker pattern
    if (EnhancedErrorBoundary.errorCount >= 5 && 
        Date.now() - EnhancedErrorBoundary.lastResetTime < 60000) {
      // Too many errors in short time - prevent crash loop
      this.setState({
        hasError: true,
        error: new Error('Too many errors occurred. Please refresh the page.'),
        errorInfo: { componentStack: 'Multiple errors detected' } as ErrorInfo
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset on navigation if enabled
    if (this.props.resetOnNavigate && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
  }

  resetErrorBoundary = () => {
    EnhancedErrorBoundary.lastResetTime = Date.now();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  refreshPage = () => {
    window.location.reload();
  };

  goHome = () => {
    window.location.href = '/';
  };

  reportBug = () => {
    const { error, errorInfo } = this.state;
    const errorDetails = `
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'No component stack'}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `.trim();

    // Open email client with pre-filled bug report
    const subject = encodeURIComponent('Bug Report - Clarity Chat');
    const body = encodeURIComponent(`Please describe what happened:\n\n\nTechnical Details:\n${errorDetails}`);
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorCount, lastErrorTime } = this.state;
      const isCriticalError = errorCount >= 3;
      const timeSinceError = Date.now() - lastErrorTime;

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card rounded-lg shadow-lg border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {isCriticalError ? 'Critical Error Detected' : 'Something went wrong'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isCriticalError 
                    ? 'The application has encountered multiple errors.' 
                    : 'We apologize for the inconvenience.'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <details className="group">
                <summary className="flex items-center justify-between py-2 px-3 bg-muted rounded-md cursor-pointer text-sm font-medium">
                  Error Details
                  <span className="text-xs text-muted-foreground">Click to expand</span>
                </summary>
                <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono text-muted-foreground max-h-32 overflow-y-auto">
                  {error?.message || 'No error message available'}
                  {errorInfo?.componentStack && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 text-xs">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            </div>

            <div className="space-y-3">
              {isCriticalError ? (
                <>
                  <button
                    onClick={this.refreshPage}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Page</span>
                  </button>
                  <button
                    onClick={this.goHome}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-border rounded-md hover:bg-accent transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span>Go to Homepage</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={this.resetErrorBoundary}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </button>
              )}

              <button
                onClick={this.reportBug}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-border rounded-md hover:bg-accent transition-colors"
              >
                <Bug className="h-4 w-4" />
                <span>Report Bug</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Error ID: {errorCount}-{lastErrorTime}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Global error handler for uncaught errors
 */
export function initializeGlobalErrorHandler() {
  if (typeof window !== 'undefined') {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error);
      
      // Prevent default error handling
      event.preventDefault();
      
      // Log to analytics or error reporting service
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: event.error?.message || 'Unknown error',
          fatal: false
        });
      }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent default handling
      event.preventDefault();
      
      // Log to analytics
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: event.reason?.message || 'Unhandled promise rejection',
          fatal: false
        });
      }
    });
  }
}

/**
 * Hook for component-level error handling
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error | string) => {
    const errorObject = error instanceof Error ? error : new Error(error);
    setError(errorObject);
    console.error('Component error:', errorObject);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null
  };
}

/**
 * Error boundary wrapper for Next.js pages
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }
) {
  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary
      fallback={options?.fallback}
      onError={options?.onError}
    >
      <Component {...props} />
    </EnhancedErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
