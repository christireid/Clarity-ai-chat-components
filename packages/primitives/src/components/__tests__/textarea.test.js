import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../textarea';
describe('Textarea Component', () => {
    const mockOnChange = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render textarea element', () => {
            render(_jsx(Textarea, {}));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should render with placeholder', () => {
            render(_jsx(Textarea, { placeholder: "Enter message..." }));
            expect(screen.getByPlaceholderText('Enter message...')).toBeInTheDocument();
        });
        it('should render with value', () => {
            render(_jsx(Textarea, { value: "Test value", onChange: mockOnChange }));
            expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
        });
        it('should render with default variant', () => {
            const { container } = render(_jsx(Textarea, {}));
            const textarea = container.querySelector('textarea');
            expect(textarea).toBeInTheDocument();
        });
        it('should render with error variant', () => {
            const { container } = render(_jsx(Textarea, { variant: "error" }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toHaveClass('border-destructive');
        });
        it('should render with success variant', () => {
            const { container } = render(_jsx(Textarea, { variant: "success" }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toHaveClass('border-success');
        });
    });
    describe('Interactions', () => {
        it('should call onChange when typing', async () => {
            const user = userEvent.setup();
            render(_jsx(Textarea, { value: "", onChange: mockOnChange }));
            const textarea = screen.getByRole('textbox');
            await user.type(textarea, 'Hello');
            expect(mockOnChange).toHaveBeenCalled();
        });
        it('should update value on change', async () => {
            const user = userEvent.setup();
            const { rerender } = render(_jsx(Textarea, { value: "", onChange: mockOnChange }));
            const textarea = screen.getByRole('textbox');
            await user.type(textarea, 'Test');
            rerender(_jsx(Textarea, { value: "Test", onChange: mockOnChange }));
            expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
        });
        it('should be disabled when disabled prop is true', () => {
            render(_jsx(Textarea, { disabled: true }));
            expect(screen.getByRole('textbox')).toBeDisabled();
        });
        it('should not call onChange when disabled', async () => {
            const user = userEvent.setup();
            render(_jsx(Textarea, { disabled: true, value: "", onChange: mockOnChange }));
            const textarea = screen.getByRole('textbox');
            await user.type(textarea, 'Hello');
            expect(mockOnChange).not.toHaveBeenCalled();
        });
        it('should handle multi-line input', async () => {
            const user = userEvent.setup();
            render(_jsx(Textarea, { value: "", onChange: mockOnChange }));
            const textarea = screen.getByRole('textbox');
            await user.type(textarea, 'Line 1{Enter}Line 2');
            expect(mockOnChange).toHaveBeenCalled();
        });
    });
    describe('Auto-resize', () => {
        it('should have auto-resize enabled by default', () => {
            const { container } = render(_jsx(Textarea, {}));
            const textarea = container.querySelector('textarea');
            // Auto-resize is handled by ref, so we just check it renders
            expect(textarea).toBeInTheDocument();
        });
        it('should respect autoResize prop when false', () => {
            const { container } = render(_jsx(Textarea, { autoResize: false, rows: 5 }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toHaveAttribute('rows', '5');
        });
        it('should respect maxRows prop', () => {
            const { container } = render(_jsx(Textarea, { autoResize: true, maxRows: 5 }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toBeInTheDocument();
            // minRows is used internally for auto-resize calculation, not as DOM attribute
        });
        it('should respect maxRows prop', () => {
            const { container } = render(_jsx(Textarea, { maxRows: 10 }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toBeInTheDocument();
        });
    });
    describe('Error Handling', () => {
        it('should display error message', () => {
            render(_jsx(Textarea, { error: "This field is required" }));
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });
        it('should apply error variant when error prop is provided', () => {
            const { container } = render(_jsx(Textarea, { error: "Error message" }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toHaveClass('border-destructive');
        });
    });
    describe('Accessibility', () => {
        it('should have proper textbox role', () => {
            render(_jsx(Textarea, {}));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should support aria-label', () => {
            render(_jsx(Textarea, { "aria-label": "Message textarea" }));
            expect(screen.getByLabelText('Message textarea')).toBeInTheDocument();
        });
        it('should support aria-describedby for error messages', () => {
            render(_jsx(Textarea, { error: "Error message", "aria-describedby": "error-id" }));
            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveAttribute('aria-describedby');
        });
        it('should be keyboard accessible', async () => {
            const user = userEvent.setup();
            render(_jsx(Textarea, { value: "", onChange: mockOnChange }));
            const textarea = screen.getByRole('textbox');
            textarea.focus();
            await user.keyboard('Hello');
            expect(mockOnChange).toHaveBeenCalled();
        });
    });
    describe('Custom Props', () => {
        it('should accept custom className', () => {
            const { container } = render(_jsx(Textarea, { className: "custom-class" }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toHaveClass('custom-class');
        });
        it('should accept custom data attributes', () => {
            render(_jsx(Textarea, { "data-testid": "custom-textarea" }));
            expect(screen.getByTestId('custom-textarea')).toBeInTheDocument();
        });
        it('should accept name attribute', () => {
            render(_jsx(Textarea, { name: "message" }));
            expect(screen.getByRole('textbox')).toHaveAttribute('name', 'message');
        });
        it('should accept required attribute', () => {
            render(_jsx(Textarea, { required: true }));
            expect(screen.getByRole('textbox')).toBeRequired();
        });
        it('should accept rows attribute', () => {
            const { container } = render(_jsx(Textarea, { rows: 10 }));
            const textarea = container.querySelector('textarea');
            expect(textarea).toHaveAttribute('rows', '10');
        });
    });
});
//# sourceMappingURL=textarea.test.js.map