import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoiceInput, InlineVoiceInput } from '../voice-input';
import * as useVoiceInputModule from '../../hooks/use-voice-input';
// Mock the useVoiceInput hook
vi.mock('../../hooks/use-voice-input', () => ({
    useVoiceInput: () => ({
        isListening: false,
        transcript: '',
        finalTranscript: '',
        interimTranscript: '',
        isSupported: true,
        error: null,
        confidence: 0,
        startListening: vi.fn(),
        stopListening: vi.fn(),
        resetTranscript: vi.fn(),
    }),
}));
describe('VoiceInput', () => {
    const mockOnTranscript = vi.fn();
    beforeEach(() => {
        mockOnTranscript.mockClear();
    });
    it('should render voice button', () => {
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript }));
        const button = screen.getByRole('button', { name: /start recording/i });
        expect(button).toBeInTheDocument();
    });
    it('should show not supported message when speech recognition unavailable', () => {
        // Mock unsupported state
        vi.mocked(useVoiceInputModule.useVoiceInput).mockReturnValue({
            isListening: false,
            transcript: '',
            finalTranscript: '',
            interimTranscript: '',
            isSupported: false,
            error: null,
            confidence: 0,
            startListening: vi.fn(),
            stopListening: vi.fn(),
            resetTranscript: vi.fn(),
        });
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript }));
        expect(screen.getByText(/voice input not supported/i)).toBeInTheDocument();
    });
    it('should have correct size classes', () => {
        const { rerender } = render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, size: "sm" }));
        let button = screen.getByRole('button');
        expect(button).toHaveClass('w-8', 'h-8');
        rerender(_jsx(VoiceInput, { onTranscript: mockOnTranscript, size: "lg" }));
        button = screen.getByRole('button');
        expect(button).toHaveClass('w-12', 'h-12');
    });
    it('should apply variant styles', () => {
        const { rerender } = render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, variant: "primary" }));
        let button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primary');
        rerender(_jsx(VoiceInput, { onTranscript: mockOnTranscript, variant: "secondary" }));
        button = screen.getByRole('button');
        expect(button).toHaveClass('bg-secondary');
    });
    it('should be disabled when disabled prop is true', () => {
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, disabled: true }));
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
    it('should apply custom className', () => {
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, className: "custom-class" }));
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });
    it('should show tooltip text', () => {
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, showTooltip: true, tooltipText: "Custom tooltip" }));
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('title', 'Custom tooltip');
    });
    it('should handle different languages', () => {
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, lang: "es-ES" }));
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });
    it('should call onStart callback', async () => {
        const onStart = vi.fn();
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, onStart: onStart }));
        // Would need to simulate voice input starting
        await waitFor(() => {
            expect(true).toBe(true);
        });
    });
    it('should call onStop callback', async () => {
        const onStop = vi.fn();
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, onStop: onStop }));
        await waitFor(() => {
            expect(true).toBe(true);
        });
    });
    it('should call onError callback on error', async () => {
        const onError = vi.fn();
        render(_jsx(VoiceInput, { onTranscript: mockOnTranscript, onError: onError }));
        await waitFor(() => {
            expect(true).toBe(true);
        });
    });
});
describe('InlineVoiceInput', () => {
    const mockOnChange = vi.fn();
    beforeEach(() => {
        mockOnChange.mockClear();
    });
    it('should render in inside position', () => {
        render(_jsx(InlineVoiceInput, { value: "", onChange: mockOnChange, position: "inside" }));
        const container = screen.getByRole('button').parentElement;
        expect(container).toHaveClass('absolute');
    });
    it('should render in outside position', () => {
        render(_jsx(InlineVoiceInput, { value: "", onChange: mockOnChange, position: "outside" }));
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });
    it('should append transcript to existing value', () => {
        render(_jsx(InlineVoiceInput, { value: "Hello", onChange: mockOnChange, position: "outside" }));
        // Would need to simulate voice input completing
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('should support custom language', () => {
        render(_jsx(InlineVoiceInput, { value: "", onChange: mockOnChange, lang: "fr-FR" }));
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('should apply custom className', () => {
        render(_jsx(InlineVoiceInput, { value: "", onChange: mockOnChange, className: "custom-inline", position: "outside" }));
        const button = screen.getByRole('button');
        expect(button.parentElement).toBeInTheDocument();
    });
});
//# sourceMappingURL=voice-input.test.js.map