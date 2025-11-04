/**
 * Error Feedback Component
 *
 * This component allows users to provide feedback when an error occurs.
 * It collects additional context from the user to help with debugging.
 */
import React from 'react';
import type { ErrorFeedback as ErrorFeedbackData } from './types';
/**
 * Error Feedback Props
 */
export interface ErrorFeedbackProps {
    /** Error that occurred */
    error?: Error;
    /** Error message if no Error object */
    errorMessage?: string;
    /** Callback when feedback is submitted */
    onSubmit: (feedback: ErrorFeedbackData) => void;
    /** Callback when feedback is cancelled */
    onCancel?: () => void;
    /** Whether to show the component */
    show: boolean;
    /** Custom CSS class */
    className?: string;
}
/**
 * Error Feedback Component
 *
 * @example
 * ```tsx
 * import { ErrorFeedback } from '@chat-ui/react'
 *
 * function MyErrorBoundary() {
 *   const [showFeedback, setShowFeedback] = useState(false)
 *   const [error, setError] = useState<Error | null>(null)
 *
 *   const handleFeedbackSubmit = (feedback) => {
 *     console.log('User feedback:', feedback)
 *     // Report to error tracking service
 *     setShowFeedback(false)
 *   }
 *
 *   return (
 *     <>
 *       <ErrorFeedback
 *         show={showFeedback}
 *         error={error}
 *         onSubmit={handleFeedbackSubmit}
 *         onCancel={() => setShowFeedback(false)}
 *       />
 *     </>
 *   )
 * }
 * ```
 */
export declare function ErrorFeedback({ error, errorMessage, onSubmit, onCancel, show, className, }: ErrorFeedbackProps): import("react/jsx-runtime").JSX.Element | null;
/**
 * Compact Error Feedback Button
 * Shows a small button that opens the feedback modal
 */
export interface ErrorFeedbackButtonProps {
    /** Error to report */
    error?: Error;
    /** Error message if no Error object */
    errorMessage?: string;
    /** Callback when feedback is submitted */
    onSubmit: (feedback: ErrorFeedbackData) => void;
    /** Custom CSS class */
    className?: string;
    /** Button text */
    children?: React.ReactNode;
}
/**
 * Compact Error Feedback Button Component
 *
 * @example
 * ```tsx
 * <ErrorFeedbackButton
 *   error={error}
 *   onSubmit={handleFeedback}
 * >
 *   Report Issue
 * </ErrorFeedbackButton>
 * ```
 */
export declare function ErrorFeedbackButton({ error, errorMessage, onSubmit, className, children, }: ErrorFeedbackButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ErrorFeedback.d.ts.map