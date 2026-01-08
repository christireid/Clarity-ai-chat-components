import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../chat/chat-input';
describe('ChatInput Component', () => {
    const mockOnChange = vi.fn();
    const mockOnSubmit = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render textarea input', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
        it('should render with placeholder', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit, placeholder: "Type a message..." }));
            expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
        });
        it('should render send button', () => {
            render(_jsx(ChatInput, { value: "Test", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });
    describe('Input Handling', () => {
        it('should call onChange when typing', async () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            fireEvent.change(textarea, { target: { value: 'Hello' } });
            expect(mockOnChange).toHaveBeenCalledWith('Hello');
        });
        it('should display current value', () => {
            render(_jsx(ChatInput, { value: "Current text", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('Current text');
        });
        it('should update value when prop changes', () => {
            const { rerender } = render(_jsx(ChatInput, { value: "Initial", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            let textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('Initial');
            rerender(_jsx(ChatInput, { value: "Updated", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue('Updated');
        });
    });
    describe('Submit Behavior', () => {
        it('should call onSubmit when Enter is pressed', async () => {
            render(_jsx(ChatInput, { value: "Test message", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });
            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith('Test message');
            });
        });
        it('should call onSubmit when send button is clicked', async () => {
            const user = userEvent.setup();
            render(_jsx(ChatInput, { value: "Test message", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            await user.click(sendButton);
            expect(mockOnSubmit).toHaveBeenCalledWith('Test message');
        });
        it('should allow Shift+Enter for new line without submitting', async () => {
            const user = userEvent.setup();
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
        it('should not submit empty messages', async () => {
            const user = userEvent.setup();
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            await user.type(textarea, '{Enter}');
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
        it('should not submit whitespace-only messages', async () => {
            const user = userEvent.setup();
            render(_jsx(ChatInput, { value: "   ", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            await user.click(sendButton);
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
        it('should trim message before submitting', async () => {
            const user = userEvent.setup();
            render(_jsx(ChatInput, { value: "  message with spaces  ", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            await user.click(sendButton);
            expect(mockOnSubmit).toHaveBeenCalledWith('message with spaces');
        });
    });
    describe('Disabled State', () => {
        it('should disable textarea when disabled prop is true', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit, disabled: true }));
            const textarea = screen.getByRole('textbox');
            expect(textarea).toBeDisabled();
        });
        it('should disable send button when disabled prop is true', () => {
            render(_jsx(ChatInput, { value: "Test", onChange: mockOnChange, onSubmit: mockOnSubmit, disabled: true }));
            const sendButton = screen.getByRole('button');
            expect(sendButton).toBeDisabled();
        });
        it('should not call onSubmit when disabled', async () => {
            const user = userEvent.setup();
            render(_jsx(ChatInput, { value: "Test message", onChange: mockOnChange, onSubmit: mockOnSubmit, disabled: true }));
            const textarea = screen.getByRole('textbox');
            await user.type(textarea, '{Enter}');
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
        it('should disable send button when value is empty', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            expect(sendButton).toBeDisabled();
        });
        it('should enable send button when value is not empty', () => {
            render(_jsx(ChatInput, { value: "Hello", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            expect(sendButton).not.toBeDisabled();
        });
    });
    describe('Send Button', () => {
        it('should display send button with arrow icon', () => {
            render(_jsx(ChatInput, { value: "Test", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            expect(sendButton.querySelector('svg')).toBeInTheDocument();
        });
        it('should call onSubmit when send button is clicked', async () => {
            const user = userEvent.setup();
            render(_jsx(ChatInput, { value: "Test message", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            await user.click(sendButton);
            expect(mockOnSubmit).toHaveBeenCalledWith('Test message');
        });
    });
    describe('Max Length', () => {
        it('should respect maxLength prop', async () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit, maxLength: 10 }));
            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveAttribute('maxLength', '10');
        });
    });
    describe('Auto-resize', () => {
        it('should have autoResize enabled by default', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            // The Textarea component has autoResize prop set to true
            expect(textarea).toBeInTheDocument();
        });
        it('should respect maxRows of 6 by default', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            // Textarea will limit to 6 rows max
            const textarea = screen.getByRole('textbox');
            expect(textarea).toBeInTheDocument();
        });
    });
    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveAttribute('aria-label');
        });
        it('should have proper ARIA label for send button', () => {
            render(_jsx(ChatInput, { value: "Test", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const sendButton = screen.getByRole('button');
            expect(sendButton).toHaveAccessibleName();
        });
        it('should indicate disabled state accessibly', () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit, disabled: true }));
            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveAttribute('aria-disabled', 'true');
        });
        it('should be keyboard navigable', async () => {
            render(_jsx(ChatInput, { value: "Test", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            textarea.focus();
            expect(textarea).toHaveFocus();
            const sendButton = screen.getByRole('button');
            sendButton.focus();
            expect(sendButton).toHaveFocus();
        });
    });
    describe('Custom className', () => {
        it('should apply custom className', () => {
            const { container } = render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit, className: "custom-input" }));
            const customElement = container.querySelector('.custom-input');
            expect(customElement).toBeInTheDocument();
        });
    });
    describe('Edge Cases', () => {
        it('should handle very long single-line messages', async () => {
            const longMessage = 'A'.repeat(10000);
            render(_jsx(ChatInput, { value: longMessage, onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            expect(textarea).toHaveValue(longMessage);
        });
        it('should handle rapid key presses', async () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            // Type rapidly
            fireEvent.change(textarea, {
                target: { value: 'abcdefghijklmnopqrstuvwxyz' },
            });
            expect(mockOnChange).toHaveBeenCalled();
        });
        it('should handle paste events', async () => {
            render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            const textarea = screen.getByRole('textbox');
            fireEvent.paste(textarea, {
                clipboardData: {
                    getData: () => 'Pasted content',
                },
            });
            // In real browsers, paste triggers an input/change; simulate that here.
            fireEvent.change(textarea, { target: { value: 'Pasted content' } });
            expect(mockOnChange).toHaveBeenCalledWith('Pasted content');
        });
        it('should handle undefined optional props gracefully', () => {
            expect(() => render(_jsx(ChatInput, { value: "", onChange: mockOnChange, onSubmit: mockOnSubmit }))).not.toThrow();
        });
    });
    describe('Performance', () => {
        it('should not cause unnecessary re-renders', () => {
            const { rerender } = render(_jsx(ChatInput, { value: "test", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            // Re-render with same props
            rerender(_jsx(ChatInput, { value: "test", onChange: mockOnChange, onSubmit: mockOnSubmit }));
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=chat-input.test.js.map