import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Error Feedback Component
 *
 * This component allows users to provide feedback when an error occurs.
 * It collects additional context from the user to help with debugging.
 */
import React, { useState } from 'react';
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
export function ErrorFeedback({ error, errorMessage, onSubmit, onCancel, show, className = '', }) {
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [stepsToReproduce, setStepsToReproduce] = useState('');
    const [expectedBehavior, setExpectedBehavior] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    if (!show)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            alert('Please provide a description of what happened');
            return;
        }
        setIsSubmitting(true);
        try {
            const feedback = {
                description: description.trim(),
                email: email.trim() || undefined,
                stepsToReproduce: stepsToReproduce.trim() || undefined,
                expectedBehavior: expectedBehavior.trim() || undefined,
            };
            await onSubmit(feedback);
            // Reset form
            setDescription('');
            setEmail('');
            setStepsToReproduce('');
            setExpectedBehavior('');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleCancel = () => {
        setDescription('');
        setEmail('');
        setStepsToReproduce('');
        setExpectedBehavior('');
        onCancel?.();
    };
    const displayError = error ? error.message : errorMessage || 'An error occurred';
    return (_jsx("div", { className: `fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${className}`, role: "dialog", "aria-labelledby": "error-feedback-title", "aria-modal": "true", children: _jsxs("div", { className: "w-full max-w-2xl rounded-lg bg-white border border-border/60 p-6 shadow-[0_24px_48px_rgba(15,23,42,0.32)] backdrop-blur-sm", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { id: "error-feedback-title", className: "text-2xl font-bold text-gray-900", children: "Help Us Fix This Issue" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "We're sorry you encountered an error. Your feedback will help us resolve this issue." })] }), _jsxs("div", { className: "mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800", children: [_jsx("div", { className: "font-medium", children: "Error:" }), _jsx("div", { className: "mt-1 font-mono text-xs", children: displayError })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: ["What were you doing when this happened? ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { id: "description", value: description, onChange: (e) => setDescription(e.target.value), required: true, rows: 3, placeholder: "Please describe what you were doing when the error occurred...", className: "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "steps", className: "block text-sm font-medium text-gray-700", children: "Steps to reproduce (optional)" }), _jsx("textarea", { id: "steps", value: stepsToReproduce, onChange: (e) => setStepsToReproduce(e.target.value), rows: 3, placeholder: "1. Go to...\n2. Click on...\n3. See error", className: "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "expected", className: "block text-sm font-medium text-gray-700", children: "What did you expect to happen? (optional)" }), _jsx("textarea", { id: "expected", value: expectedBehavior, onChange: (e) => setExpectedBehavior(e.target.value), rows: 2, placeholder: "I expected to...", className: "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email (optional)" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", className: "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "We'll only use this to follow up about this specific issue" })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: isSubmitting ? 'Sending...' : 'Send Feedback' }), _jsx("button", { type: "button", onClick: handleCancel, disabled: isSubmitting, className: "flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", children: "Cancel" })] })] }), _jsxs("div", { className: "mt-4 rounded-md bg-gray-50 p-3 text-xs text-gray-600", children: [_jsx("strong", { children: "Privacy:" }), " This feedback will be sent along with technical details about the error (browser info, error message, stack trace). We will not collect any personal data beyond what you choose to provide."] })] }) }));
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
export function ErrorFeedbackButton({ error, errorMessage, onSubmit, className = '', children = 'Report Issue', }) {
    const [showModal, setShowModal] = useState(false);
    const handleSubmit = (feedback) => {
        onSubmit(feedback);
        setShowModal(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setShowModal(true), className: `rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`, children: children }), _jsx(ErrorFeedback, { show: showModal, error: error, errorMessage: errorMessage, onSubmit: handleSubmit, onCancel: () => setShowModal(false) })] }));
}
//# sourceMappingURL=ErrorFeedback.js.map