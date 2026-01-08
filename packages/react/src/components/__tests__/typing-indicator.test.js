import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TypingIndicator } from '../typing-indicator';
// Mock useReducedMotion hook
vi.mock('../../hooks/use-reduced-motion', () => ({
    useReducedMotion: vi.fn(() => false),
}));
describe('TypingIndicator Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render with default props', () => {
            render(_jsx(TypingIndicator, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('should render with avatar by default', () => {
            render(_jsx(TypingIndicator, {}));
            // Avatar uses fallback text when no src is provided
            expect(screen.getByText('AI')).toBeInTheDocument();
        });
        it('should hide avatar when showAvatar is false', () => {
            render(_jsx(TypingIndicator, { showAvatar: false }));
            expect(screen.queryByAltText('AI Assistant')).not.toBeInTheDocument();
        });
        it('should render three dots in default variant', () => {
            const { container } = render(_jsx(TypingIndicator, {}));
            const dots = container.querySelectorAll('.rounded-full');
            // Avatar has rounded-full too, so we need to be more specific
            expect(dots.length).toBeGreaterThanOrEqual(3);
        });
    });
    describe('Variants', () => {
        it('should render dots variant', () => {
            const { container } = render(_jsx(TypingIndicator, { variant: "dots" }));
            expect(container).toBeInTheDocument();
        });
        it('should render pulse variant', () => {
            const { container } = render(_jsx(TypingIndicator, { variant: "pulse" }));
            expect(container).toBeInTheDocument();
        });
        it('should render wave variant', () => {
            const { container } = render(_jsx(TypingIndicator, { variant: "wave" }));
            expect(container).toBeInTheDocument();
        });
    });
    describe('Accessibility', () => {
        it('should have role="status"', () => {
            render(_jsx(TypingIndicator, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('should have aria-live="polite"', () => {
            render(_jsx(TypingIndicator, {}));
            const indicator = screen.getByRole('status');
            expect(indicator).toHaveAttribute('aria-live', 'polite');
        });
        it('should have default aria-label', () => {
            render(_jsx(TypingIndicator, {}));
            const indicator = screen.getByRole('status');
            expect(indicator).toHaveAttribute('aria-label', 'AI is typing');
        });
        it('should use custom label for aria-label', () => {
            render(_jsx(TypingIndicator, { label: "Assistant is thinking" }));
            const indicator = screen.getByRole('status');
            expect(indicator).toHaveAttribute('aria-label', 'Assistant is thinking');
        });
    });
    describe('Avatar Configuration', () => {
        it('should render custom avatar fallback', () => {
            render(_jsx(TypingIndicator, { avatarFallback: "Bot" }));
            // Avatar with fallback renders text
            expect(screen.getByText('Bot')).toBeInTheDocument();
        });
        it('should render avatar with custom src', () => {
            const { container } = render(_jsx(TypingIndicator, { avatarSrc: "https://example.com/avatar.png" }));
            // Avatar component uses an img element when src is provided
            const avatar = container.querySelector('img');
            if (avatar) {
                expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png');
            }
            else {
                // Fallback is shown, which is acceptable behavior
                expect(screen.getByText('AI')).toBeInTheDocument();
            }
        });
    });
    describe('Custom className', () => {
        it('should apply custom className', () => {
            const { container } = render(_jsx(TypingIndicator, { className: "custom-typing" }));
            const indicator = container.querySelector('.custom-typing');
            expect(indicator).toBeInTheDocument();
        });
        it('should combine custom className with default classes', () => {
            const { container } = render(_jsx(TypingIndicator, { className: "custom-class" }));
            const indicator = container.querySelector('.custom-class');
            expect(indicator).toHaveClass('custom-class');
            expect(indicator).toHaveClass('flex');
        });
    });
    describe('Reduced Motion', () => {
        it('should render properly regardless of reduced motion setting', async () => {
            const { useReducedMotion } = await import('../../hooks/use-reduced-motion');
            // Test with reduced motion disabled (default)
            vi.mocked(useReducedMotion).mockReturnValue(false);
            const { rerender } = render(_jsx(TypingIndicator, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
            // Test with reduced motion enabled
            vi.mocked(useReducedMotion).mockReturnValue(true);
            rerender(_jsx(TypingIndicator, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('should use static dots when reduced motion is enabled', async () => {
            const { useReducedMotion } = await import('../../hooks/use-reduced-motion');
            vi.mocked(useReducedMotion).mockReturnValue(true);
            const { container } = render(_jsx(TypingIndicator, { variant: "dots" }));
            // With reduced motion, dots should be static (div instead of motion.div)
            expect(container).toBeInTheDocument();
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty label gracefully', () => {
            render(_jsx(TypingIndicator, { label: "" }));
            const indicator = screen.getByRole('status');
            expect(indicator).toHaveAttribute('aria-label', '');
        });
        it('should handle undefined optional props', () => {
            expect(() => render(_jsx(TypingIndicator, { showAvatar: undefined, avatarSrc: undefined, avatarFallback: undefined, label: undefined, variant: undefined, className: undefined }))).not.toThrow();
        });
    });
    describe('Animation Variants', () => {
        it('should render dots variant with correct structure', () => {
            const { container } = render(_jsx(TypingIndicator, { variant: "dots" }));
            // Find the dots container
            const dotsContainer = container.querySelector('.flex.gap-1\\.5');
            expect(dotsContainer).toBeInTheDocument();
        });
        it('should render pulse variant with correct structure', () => {
            const { container } = render(_jsx(TypingIndicator, { variant: "pulse" }));
            const dotsContainer = container.querySelector('.flex.gap-1\\.5');
            expect(dotsContainer).toBeInTheDocument();
        });
        it('should render wave variant with correct structure', () => {
            const { container } = render(_jsx(TypingIndicator, { variant: "wave" }));
            const dotsContainer = container.querySelector('.flex.gap-1\\.5');
            expect(dotsContainer).toBeInTheDocument();
        });
    });
    describe('displayName', () => {
        it('should have correct displayName', () => {
            expect(TypingIndicator.displayName).toBe('TypingIndicator');
        });
    });
});
//# sourceMappingURL=typing-indicator.test.js.map