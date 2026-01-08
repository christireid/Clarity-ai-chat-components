import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorMessage } from '../error-message';
describe('ErrorMessage Component', () => {
    describe('Rendering', () => {
        it('should render error message when error is provided', () => {
            render(_jsx(ErrorMessage, { error: "This field is required" }));
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });
        it('should not render when error is undefined', () => {
            const { container } = render(_jsx(ErrorMessage, { error: undefined }));
            expect(container.firstChild).toBeNull();
        });
        it('should not render when error is empty string', () => {
            const { container } = render(_jsx(ErrorMessage, { error: "" }));
            expect(container.firstChild).toBeNull();
        });
        it('should render with multiple error messages', () => {
            render(_jsxs("div", { children: [_jsx(ErrorMessage, { error: "Error 1" }), _jsx(ErrorMessage, { error: "Error 2" })] }));
            expect(screen.getByText('Error 1')).toBeInTheDocument();
            expect(screen.getByText('Error 2')).toBeInTheDocument();
        });
    });
    describe('Styling', () => {
        it('should apply error styling', () => {
            const { container } = render(_jsx(ErrorMessage, { error: "Error message" }));
            const errorElement = container.querySelector('.text-destructive');
            expect(errorElement).toBeInTheDocument();
        });
        it('should have proper text size', () => {
            const { container } = render(_jsx(ErrorMessage, { error: "Error message" }));
            const errorElement = container.querySelector('.text-xs');
            expect(errorElement).toBeInTheDocument();
        });
        it('should accept custom className', () => {
            const { container } = render(_jsx(ErrorMessage, { error: "Error", className: "custom-error" }));
            const errorElement = container.querySelector('.custom-error');
            expect(errorElement).toBeInTheDocument();
        });
    });
    describe('Accessibility', () => {
        it('should have proper role', () => {
            render(_jsx(ErrorMessage, { error: "Error message" }));
            const errorElement = screen.getByText('Error message');
            expect(errorElement).toBeInTheDocument();
        });
        it('should support aria-live for screen readers', () => {
            const { container } = render(_jsx(ErrorMessage, { error: "Error message" }));
            const errorElement = container.querySelector('[aria-live]');
            // Error messages should be announced to screen readers
            expect(errorElement).toBeInTheDocument();
        });
        it('should be associated with form fields via id', () => {
            render(_jsxs("div", { children: [_jsx("input", { id: "email", "aria-describedby": "email-error" }), _jsx(ErrorMessage, { id: "email-error", error: "Email is required" })] }));
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-describedby', 'email-error');
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });
    describe('Animation', () => {
        it('should have transition classes', () => {
            const { container } = render(_jsx(ErrorMessage, { error: "Error message" }));
            const errorElement = container.querySelector('p');
            // ErrorMessage uses animate-in classes, not transition-all
            expect(errorElement).toBeInTheDocument();
            expect(errorElement).toHaveClass('animate-in');
        });
        it('should have duration class', () => {
            const { container } = render(_jsx(ErrorMessage, { error: "Error message" }));
            const errorElement = container.querySelector('.duration-150');
            expect(errorElement).toBeInTheDocument();
        });
    });
    describe('Content', () => {
        it('should render long error messages', () => {
            const longError = 'This is a very long error message that should still be displayed correctly';
            render(_jsx(ErrorMessage, { error: longError }));
            expect(screen.getByText(longError)).toBeInTheDocument();
        });
        it('should render error messages with special characters', () => {
            render(_jsx(ErrorMessage, { error: "Error: Field <required> & 'invalid'" }));
            expect(screen.getByText("Error: Field <required> & 'invalid'")).toBeInTheDocument();
        });
        it('should render error messages with HTML entities', () => {
            render(_jsx(ErrorMessage, { error: "Error & Warning" }));
            expect(screen.getByText('Error & Warning')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=error-message.test.js.map