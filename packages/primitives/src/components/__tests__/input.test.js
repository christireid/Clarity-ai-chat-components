import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';
describe('Input Component', () => {
    const mockOnChange = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render input element', () => {
            render(_jsx(Input, {}));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should render with placeholder', () => {
            render(_jsx(Input, { placeholder: "Enter text..." }));
            expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
        });
        it('should render with value', () => {
            render(_jsx(Input, { value: "Test value", onChange: mockOnChange }));
            expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
        });
        it('should render with default variant', () => {
            const { container } = render(_jsx(Input, {}));
            const input = container.querySelector('input');
            expect(input).toBeInTheDocument();
        });
        it('should render with error variant', () => {
            const { container } = render(_jsx(Input, { variant: "error" }));
            const input = container.querySelector('input');
            expect(input).toHaveClass('border-destructive');
        });
        it('should render with success variant', () => {
            const { container } = render(_jsx(Input, { variant: "success" }));
            const input = container.querySelector('input');
            expect(input).toHaveClass('border-success');
        });
        it('should render with small size', () => {
            const { container } = render(_jsx(Input, { inputSize: "sm" }));
            const input = container.querySelector('input');
            expect(input).toHaveClass('h-8');
        });
        it('should render with large size', () => {
            const { container } = render(_jsx(Input, { inputSize: "lg" }));
            const input = container.querySelector('input');
            expect(input).toHaveClass('h-12');
        });
        it('should render with icon on left', () => {
            const Icon = () => _jsx("span", { "data-testid": "icon", children: "\uD83D\uDD0D" });
            render(_jsx(Input, { icon: _jsx(Icon, {}), iconPosition: "left" }));
            expect(screen.getByTestId('icon')).toBeInTheDocument();
        });
        it('should render with icon on right', () => {
            const Icon = () => _jsx("span", { "data-testid": "icon", children: "\u2713" });
            render(_jsx(Input, { icon: _jsx(Icon, {}), iconPosition: "right" }));
            expect(screen.getByTestId('icon')).toBeInTheDocument();
        });
    });
    describe('Interactions', () => {
        it('should call onChange when typing', async () => {
            const user = userEvent.setup();
            render(_jsx(Input, { value: "", onChange: mockOnChange }));
            const input = screen.getByRole('textbox');
            await user.type(input, 'Hello');
            expect(mockOnChange).toHaveBeenCalled();
        });
        it('should update value on change', async () => {
            const user = userEvent.setup();
            const { rerender } = render(_jsx(Input, { value: "", onChange: mockOnChange }));
            const input = screen.getByRole('textbox');
            await user.type(input, 'Test');
            rerender(_jsx(Input, { value: "Test", onChange: mockOnChange }));
            expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
        });
        it('should be disabled when disabled prop is true', () => {
            render(_jsx(Input, { disabled: true }));
            expect(screen.getByRole('textbox')).toBeDisabled();
        });
        it('should not call onChange when disabled', async () => {
            const user = userEvent.setup();
            render(_jsx(Input, { disabled: true, value: "", onChange: mockOnChange }));
            const input = screen.getByRole('textbox');
            await user.type(input, 'Hello');
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });
    describe('Error Handling', () => {
        it('should display error message', () => {
            render(_jsx(Input, { error: "This field is required" }));
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });
        it('should apply error variant when error prop is provided', () => {
            const { container } = render(_jsx(Input, { error: "Error message" }));
            const input = container.querySelector('input');
            expect(input).toHaveClass('border-destructive');
        });
        it('should show error message with ErrorMessage component', () => {
            render(_jsx(Input, { error: "Validation failed" }));
            const errorMessage = screen.getByText('Validation failed');
            expect(errorMessage).toBeInTheDocument();
            expect(errorMessage).toHaveClass('text-destructive');
        });
    });
    describe('Accessibility', () => {
        it('should have proper input role', () => {
            render(_jsx(Input, {}));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should support aria-label', () => {
            render(_jsx(Input, { "aria-label": "Email address" }));
            expect(screen.getByLabelText('Email address')).toBeInTheDocument();
        });
        it('should support aria-describedby for error messages', () => {
            render(_jsx(Input, { error: "Error message", "aria-describedby": "error-id" }));
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-describedby');
        });
        it('should be keyboard accessible', async () => {
            const user = userEvent.setup();
            render(_jsx(Input, { value: "", onChange: mockOnChange }));
            const input = screen.getByRole('textbox');
            input.focus();
            await user.keyboard('Hello');
            expect(mockOnChange).toHaveBeenCalled();
        });
    });
    describe('Input Types', () => {
        it('should render email input type', () => {
            render(_jsx(Input, { type: "email" }));
            expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
        });
        it('should render password input type', () => {
            const { container } = render(_jsx(Input, { type: "password" }));
            const input = container.querySelector('input[type="password"]');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'password');
        });
        it('should render number input type', () => {
            render(_jsx(Input, { type: "number" }));
            const input = screen.getByRole('spinbutton') || screen.getByRole('textbox');
            expect(input).toHaveAttribute('type', 'number');
        });
    });
    describe('Custom Props', () => {
        it('should accept custom className', () => {
            const { container } = render(_jsx(Input, { className: "custom-class" }));
            const input = container.querySelector('input');
            expect(input).toHaveClass('custom-class');
        });
        it('should accept custom data attributes', () => {
            render(_jsx(Input, { "data-testid": "custom-input" }));
            expect(screen.getByTestId('custom-input')).toBeInTheDocument();
        });
        it('should accept name attribute', () => {
            render(_jsx(Input, { name: "email" }));
            expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email');
        });
        it('should accept required attribute', () => {
            render(_jsx(Input, { required: true }));
            expect(screen.getByRole('textbox')).toBeRequired();
        });
    });
    describe('Auto-generated ID', () => {
        it('should generate id when not provided', () => {
            render(_jsx(Input, {}));
            const input = screen.getByRole('textbox');
            expect(input.id).toBeTruthy();
        });
        it('should use provided id when given', () => {
            render(_jsx(Input, { id: "my-input" }));
            const input = screen.getByRole('textbox');
            expect(input.id).toBe('my-input');
        });
        it('should link error message with generated id', () => {
            render(_jsx(Input, { error: "Error message" }));
            const input = screen.getByRole('textbox');
            const errorId = `${input.id}-error`;
            expect(input).toHaveAttribute('aria-describedby', errorId);
        });
        it('should link error message with provided id', () => {
            render(_jsx(Input, { id: "email", error: "Invalid email" }));
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-describedby', 'email-error');
        });
        it('should set aria-invalid when error is present', () => {
            render(_jsx(Input, { error: "Required field" }));
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-invalid', 'true');
        });
        it('should not set aria-invalid when no error', () => {
            render(_jsx(Input, {}));
            const input = screen.getByRole('textbox');
            expect(input).not.toHaveAttribute('aria-invalid');
        });
    });
});
//# sourceMappingURL=input.test.js.map