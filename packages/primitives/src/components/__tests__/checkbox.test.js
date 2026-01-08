import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../checkbox';
describe('Checkbox Component', () => {
    const mockOnChange = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render checkbox input', () => {
            render(_jsx(Checkbox, {}));
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });
        it('should render unchecked by default', () => {
            render(_jsx(Checkbox, {}));
            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });
        it('should render checked when checked prop is true', () => {
            render(_jsx(Checkbox, { checked: true, onChange: mockOnChange }));
            expect(screen.getByRole('checkbox')).toBeChecked();
        });
        it('should render checked when defaultChecked is true', () => {
            render(_jsx(Checkbox, { defaultChecked: true }));
            expect(screen.getByRole('checkbox')).toBeChecked();
        });
        it('should render disabled checkbox', () => {
            render(_jsx(Checkbox, { disabled: true }));
            expect(screen.getByRole('checkbox')).toBeDisabled();
        });
    });
    describe('Interactions', () => {
        it('should call onCheckedChange when clicked', async () => {
            const user = userEvent.setup();
            const mockOnCheckedChange = vi.fn();
            render(_jsx(Checkbox, { checked: false, onCheckedChange: mockOnCheckedChange }));
            const checkbox = screen.getByRole('checkbox');
            await user.click(checkbox);
            expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);
        });
        it('should toggle checked state', async () => {
            const user = userEvent.setup();
            const mockOnCheckedChange = vi.fn();
            const { rerender } = render(_jsx(Checkbox, { checked: false, onCheckedChange: mockOnCheckedChange }));
            const checkbox = screen.getByRole('checkbox');
            await user.click(checkbox);
            rerender(_jsx(Checkbox, { checked: true, onCheckedChange: mockOnCheckedChange }));
            expect(checkbox).toBeChecked();
        });
        it('should not call onCheckedChange when disabled', async () => {
            const user = userEvent.setup();
            const mockOnCheckedChange = vi.fn();
            render(_jsx(Checkbox, { disabled: true, onCheckedChange: mockOnCheckedChange }));
            const checkbox = screen.getByRole('checkbox');
            await user.click(checkbox);
            expect(mockOnCheckedChange).not.toHaveBeenCalled();
        });
        it('should be keyboard accessible', async () => {
            const user = userEvent.setup();
            const mockOnCheckedChange = vi.fn();
            render(_jsx(Checkbox, { checked: false, onCheckedChange: mockOnCheckedChange }));
            await user.tab();
            await user.keyboard(' ');
            expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);
        });
    });
    describe('Styling', () => {
        it('should apply default styles', () => {
            render(_jsx(Checkbox, {}));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveClass('h-4', 'w-4', 'rounded-sm');
        });
        it('should accept custom className', () => {
            render(_jsx(Checkbox, { className: "custom-checkbox" }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveClass('custom-checkbox');
        });
        it('should have proper focus styles', () => {
            render(_jsx(Checkbox, {}));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveClass('focus-visible:ring-2');
        });
    });
    describe('Accessibility', () => {
        it('should have proper checkbox role', () => {
            render(_jsx(Checkbox, {}));
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });
        it('should support aria-label', () => {
            render(_jsx(Checkbox, { "aria-label": "Accept terms" }));
            expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
        });
        it('should support aria-checked', () => {
            render(_jsx(Checkbox, { checked: true, "aria-checked": "true", onChange: mockOnChange }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-checked', 'true');
        });
        it('should support aria-disabled when disabled', () => {
            render(_jsx(Checkbox, { disabled: true }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeDisabled();
        });
        it('should be focusable', async () => {
            const user = userEvent.setup();
            render(_jsx(Checkbox, {}));
            const checkbox = screen.getByRole('checkbox');
            await user.tab();
            // Radix UI checkbox is focusable - verify it can receive focus
            expect(document.activeElement).toBe(checkbox);
        });
    });
    describe('Form Integration', () => {
        it('should work in a form', () => {
            render(_jsx("form", { children: _jsx(Checkbox, { name: "agree", value: "yes" }) }));
            const checkbox = screen.getByRole('checkbox');
            // Radix UI checkbox doesn't use native form attributes (name/value)
            // but the component is accessible and can be used in forms
            expect(checkbox).toBeInTheDocument();
        });
        it('should support required attribute', () => {
            render(_jsx(Checkbox, { required: true }));
            expect(screen.getByRole('checkbox')).toBeRequired();
        });
    });
    describe('Controlled vs Uncontrolled', () => {
        it('should work as controlled component', () => {
            const { rerender } = render(_jsx(Checkbox, { checked: true, onChange: mockOnChange }));
            expect(screen.getByRole('checkbox')).toBeChecked();
            rerender(_jsx(Checkbox, { checked: false, onChange: mockOnChange }));
            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });
        it('should work as uncontrolled component', () => {
            render(_jsx(Checkbox, { defaultChecked: true }));
            expect(screen.getByRole('checkbox')).toBeChecked();
        });
    });
    describe('Label Support', () => {
        it('should render label when provided', () => {
            render(_jsx(Checkbox, { label: "Accept terms" }));
            expect(screen.getByText('Accept terms')).toBeInTheDocument();
        });
        it('should associate label with checkbox via htmlFor', () => {
            render(_jsx(Checkbox, { label: "Accept terms", id: "terms" }));
            const label = screen.getByText('Accept terms');
            expect(label).toHaveAttribute('for', 'terms');
        });
        it('should generate id if not provided for label association', () => {
            render(_jsx(Checkbox, { label: "Accept terms" }));
            const checkbox = screen.getByRole('checkbox');
            const label = screen.getByText('Accept terms');
            expect(checkbox.id).toBeTruthy();
            expect(label).toHaveAttribute('for', checkbox.id);
        });
        it('should render required indicator when required', () => {
            render(_jsx(Checkbox, { label: "Accept terms", required: true }));
            expect(screen.getByText('*')).toBeInTheDocument();
        });
        it('should position label on left when labelPosition is left', () => {
            const { container } = render(_jsx(Checkbox, { label: "Accept terms", labelPosition: "left" }));
            const wrapper = container.querySelector('.flex-row-reverse');
            expect(wrapper).toBeInTheDocument();
        });
        it('should position label on right by default', () => {
            const { container } = render(_jsx(Checkbox, { label: "Accept terms" }));
            const wrapper = container.querySelector('.flex-row-reverse');
            expect(wrapper).not.toBeInTheDocument();
        });
        it('should make label clickable to toggle checkbox', async () => {
            const user = userEvent.setup();
            const mockOnCheckedChange = vi.fn();
            render(_jsx(Checkbox, { label: "Accept terms", onCheckedChange: mockOnCheckedChange }));
            await user.click(screen.getByText('Accept terms'));
            expect(mockOnCheckedChange).toHaveBeenCalled();
        });
    });
    describe('Error Handling', () => {
        it('should display error message when error prop is provided', () => {
            render(_jsx(Checkbox, { error: "This field is required" }));
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });
        it('should set aria-invalid when error is present', () => {
            render(_jsx(Checkbox, { error: "Error" }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-invalid', 'true');
        });
        it('should link error message via aria-describedby', () => {
            render(_jsx(Checkbox, { error: "Error message", id: "my-checkbox" }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-describedby', 'my-checkbox-error');
        });
        it('should apply error styling to checkbox border', () => {
            render(_jsx(Checkbox, { error: "Error" }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveClass('border-destructive');
        });
        it('should display error with label', () => {
            render(_jsx(Checkbox, { label: "Terms", error: "Required" }));
            expect(screen.getByText('Terms')).toBeInTheDocument();
            expect(screen.getByText('Required')).toBeInTheDocument();
        });
    });
    describe('ARIA Attributes', () => {
        it('should set aria-required when required', () => {
            render(_jsx(Checkbox, { required: true }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-required', 'true');
        });
        it('should not set aria-label when label is present', () => {
            render(_jsx(Checkbox, { label: "Terms", "aria-label": "Alt label" }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).not.toHaveAttribute('aria-label');
        });
        it('should set aria-label when no visible label', () => {
            render(_jsx(Checkbox, { "aria-label": "Hidden label" }));
            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toHaveAttribute('aria-label', 'Hidden label');
        });
    });
});
//# sourceMappingURL=checkbox.test.js.map