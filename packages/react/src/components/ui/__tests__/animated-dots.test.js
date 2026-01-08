import { jsx as _jsx } from "react/jsx-runtime";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedDots, BouncingDots, PulsingDots, WaveDots, FadingDots, } from '../animated-dots';
// Mock framer-motion to avoid animation complexity in tests
vi.mock('framer-motion', () => ({
    motion: {
        span: ({ children, className, ...props }) => (_jsx("span", { className: className, ...props, children: children })),
    },
}));
// Mock useReducedMotion hook
vi.mock('@clarity-chat/primitives', async () => {
    const actual = await vi.importActual('@clarity-chat/primitives');
    return {
        ...actual,
        useReducedMotion: vi.fn(() => false),
    };
});
describe('AnimatedDots', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('rendering', () => {
        it('renders with default props', () => {
            render(_jsx(AnimatedDots, {}));
            const container = screen.getByRole('status');
            expect(container).toBeInTheDocument();
            expect(container).toHaveAttribute('aria-label', 'Loading');
        });
        it('renders correct number of dots by default (3)', () => {
            render(_jsx(AnimatedDots, {}));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(3);
        });
        it('renders specified number of dots', () => {
            render(_jsx(AnimatedDots, { count: 5 }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(5);
        });
    });
    describe('accessibility', () => {
        it('has role="status" on container', () => {
            render(_jsx(AnimatedDots, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('has aria-busy="true" on container', () => {
            render(_jsx(AnimatedDots, {}));
            expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
        });
        it('uses default aria-label "Loading"', () => {
            render(_jsx(AnimatedDots, {}));
            expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
        });
        it('accepts custom aria-label', () => {
            render(_jsx(AnimatedDots, { ariaLabel: "AI is typing" }));
            expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'AI is typing');
        });
        it('marks individual dots as aria-hidden', () => {
            render(_jsx(AnimatedDots, { count: 3 }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(3);
            dots.forEach((dot) => {
                expect(dot).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });
    describe('edge cases - count validation', () => {
        it('handles count=0 by clamping to 1', () => {
            render(_jsx(AnimatedDots, { count: 0 }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(1);
        });
        it('handles negative count by clamping to 1', () => {
            render(_jsx(AnimatedDots, { count: -5 }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(1);
        });
        it('handles NaN count by using default (3)', () => {
            render(_jsx(AnimatedDots, { count: NaN }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(3);
        });
        it('handles Infinity count by clamping to 10', () => {
            render(_jsx(AnimatedDots, { count: Infinity }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(10);
        });
        it('handles very large count by clamping to 10', () => {
            render(_jsx(AnimatedDots, { count: 100 }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(10);
        });
        it('handles floating point count by flooring', () => {
            render(_jsx(AnimatedDots, { count: 4.7 }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(4);
        });
    });
    describe('size variants', () => {
        it('applies small size classes', () => {
            render(_jsx(AnimatedDots, { size: "sm" }));
            const container = screen.getByRole('status');
            expect(container).toHaveClass('gap-1');
        });
        it('applies medium size classes (default)', () => {
            render(_jsx(AnimatedDots, { size: "md" }));
            const container = screen.getByRole('status');
            expect(container).toHaveClass('gap-1.5');
        });
        it('applies large size classes', () => {
            render(_jsx(AnimatedDots, { size: "lg" }));
            const container = screen.getByRole('status');
            expect(container).toHaveClass('gap-2');
        });
        it('falls back to default size for invalid size', () => {
            // @ts-expect-error - testing runtime validation
            render(_jsx(AnimatedDots, { size: "invalid" }));
            const container = screen.getByRole('status');
            expect(container).toHaveClass('gap-1.5'); // md default
        });
    });
    describe('className customization', () => {
        it('applies custom className to container', () => {
            render(_jsx(AnimatedDots, { className: "custom-class" }));
            expect(screen.getByRole('status')).toHaveClass('custom-class');
        });
        it('applies custom dotClassName to dots', () => {
            render(_jsx(AnimatedDots, { dotClassName: "dot-custom" }));
            const dots = screen.getAllByRole('status')[0].querySelectorAll('span[aria-hidden="true"]');
            dots.forEach((dot) => {
                expect(dot).toHaveClass('dot-custom');
            });
        });
    });
    describe('variant-specific exports', () => {
        it('BouncingDots renders with bounce variant', () => {
            render(_jsx(BouncingDots, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('PulsingDots renders with pulse variant', () => {
            render(_jsx(PulsingDots, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('WaveDots renders with wave variant', () => {
            render(_jsx(WaveDots, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('FadingDots renders with fade variant', () => {
            render(_jsx(FadingDots, {}));
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
        it('variant exports accept all AnimatedDotsProps except variant', () => {
            render(_jsx(BouncingDots, { count: 5, size: "lg", ariaLabel: "Custom label" }));
            const container = screen.getByRole('status');
            expect(container).toHaveAttribute('aria-label', 'Custom label');
            expect(container).toHaveClass('gap-2');
            const dots = container.querySelectorAll('span[aria-hidden="true"]');
            expect(dots).toHaveLength(5);
        });
    });
});
//# sourceMappingURL=animated-dots.test.js.map