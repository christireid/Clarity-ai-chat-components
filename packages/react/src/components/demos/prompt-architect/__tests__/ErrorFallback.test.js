import { jsx as _jsx } from "react/jsx-runtime";
/**
 * ErrorFallback Component Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { ErrorFallback } from '../components/ErrorFallback';
describe('ErrorFallback', () => {
    const mockError = new Error('Test error message');
    const mockResetError = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should render error message', () => {
        render(_jsx(ErrorFallback, { error: mockError, resetError: mockResetError }));
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
    it('should render Try Again button', () => {
        render(_jsx(ErrorFallback, { error: mockError, resetError: mockResetError }));
        const button = screen.getByRole('button', { name: /try again/i });
        expect(button).toBeInTheDocument();
    });
    it('should call resetError when Try Again button is clicked', () => {
        render(_jsx(ErrorFallback, { error: mockError, resetError: mockResetError }));
        const button = screen.getByRole('button', { name: /try again/i });
        fireEvent.click(button);
        expect(mockResetError).toHaveBeenCalledTimes(1);
    });
    it('should have collapsible technical details', () => {
        render(_jsx(ErrorFallback, { error: mockError, resetError: mockResetError }));
        const details = screen.getByText('Show technical details');
        expect(details).toBeInTheDocument();
    });
    it('should display error stack in technical details', () => {
        const errorWithStack = new Error('Test error');
        errorWithStack.stack = 'Error: Test error\n    at TestComponent';
        render(_jsx(ErrorFallback, { error: errorWithStack, resetError: mockResetError }));
        // Open details
        const summary = screen.getByText('Show technical details');
        fireEvent.click(summary);
        expect(screen.getByText(/Error: Test error/)).toBeInTheDocument();
    });
    it('should handle error without message', () => {
        const errorNoMessage = new Error();
        render(_jsx(ErrorFallback, { error: errorNoMessage, resetError: mockResetError }));
        expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
    it('should have role="alert" for accessibility', () => {
        render(_jsx(ErrorFallback, { error: mockError, resetError: mockResetError }));
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    it('should have aria-live="assertive" for screen readers', () => {
        render(_jsx(ErrorFallback, { error: mockError, resetError: mockResetError }));
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
    });
});
//# sourceMappingURL=ErrorFallback.test.js.map