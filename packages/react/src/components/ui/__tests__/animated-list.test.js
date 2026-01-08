import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Animated List Tests
 *
 * Tests for reduced-motion accessibility compliance (WCAG 2.3.3)
 * and proper component behavior.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AnimatedList, AnimatedListItem, FadePresence, SlidePresence, ScalePresence, ConditionalPresence, StaggerContainer, AnimatedGrid, } from '../animated-list';
// Mock framer-motion to avoid animation complexity in tests
// Note: Using function components with ref prop (React 19 pattern)
vi.mock('framer-motion', () => ({
    motion: {
        div: function MockMotionDiv({ children, className, variants, ref, 
        // Filter out framer-motion specific props that shouldn't go to DOM
        layout: _layout, initial: _initial, animate: _animate, exit: _exit, transition: _transition, ...props }) {
            return (_jsx("div", { ref: ref, className: className, "data-motion": "true", "data-variants": JSON.stringify(variants), ...props, children: children }));
        },
    },
    AnimatePresence: ({ children }) => (_jsx(_Fragment, { children: children })),
}));
// Helper to get the first motion div (outer container)
const getMotionContainer = (container) => {
    const motionDivs = container.querySelectorAll('[data-motion="true"]');
    return motionDivs[0];
};
// Helper to check if any motion div exists
const hasMotionDiv = (container) => {
    return container.querySelectorAll('[data-motion="true"]').length > 0;
};
// Track the mock value for useReducedMotion
let mockReducedMotion = false;
// Mock useReducedMotion hook
vi.mock('@clarity-chat/primitives', async () => {
    const actual = await vi.importActual('@clarity-chat/primitives');
    return {
        ...actual,
        useReducedMotion: () => mockReducedMotion,
        cn: (...args) => args.filter(Boolean).join(' '),
    };
});
describe('AnimatedList', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children', () => {
        render(_jsx(AnimatedList, { children: _jsx("div", { "data-testid": "child", children: "Item 1" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    it('applies custom className', () => {
        const { container } = render(_jsx(AnimatedList, { className: "custom-list", children: _jsx("div", { children: "Item" }) }));
        expect(getMotionContainer(container)).toHaveClass('custom-list');
    });
    describe('reduced motion accessibility', () => {
        it('renders static div when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(AnimatedList, { className: "list-class", children: _jsx("div", { "data-testid": "child", children: "Item" }) }));
            // Should render a plain div, not a motion.div
            expect(hasMotionDiv(container)).toBe(false);
            // Should still render children with className
            const div = container.querySelector('.list-class');
            expect(div).toBeInTheDocument();
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });
        it('renders motion.div when motion is allowed', () => {
            mockReducedMotion = false;
            const { container } = render(_jsx(AnimatedList, { children: _jsx("div", { children: "Item" }) }));
            expect(hasMotionDiv(container)).toBe(true);
        });
    });
});
describe('AnimatedListItem', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children', () => {
        render(_jsx(AnimatedListItem, { children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    it('applies custom className', () => {
        const { container } = render(_jsx(AnimatedListItem, { className: "item-class", children: _jsx("span", { children: "Content" }) }));
        expect(getMotionContainer(container)).toHaveClass('item-class');
    });
    describe('reduced motion accessibility', () => {
        it('renders static div when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(AnimatedListItem, { className: "item-class", children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
            expect(hasMotionDiv(container)).toBe(false);
            const div = container.querySelector('.item-class');
            expect(div).toBeInTheDocument();
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });
        it('renders motion.div when motion is allowed', () => {
            mockReducedMotion = false;
            const { container } = render(_jsx(AnimatedListItem, { children: _jsx("span", { children: "Content" }) }));
            expect(hasMotionDiv(container)).toBe(true);
        });
    });
});
describe('FadePresence', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children', () => {
        render(_jsx(FadePresence, { children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    describe('reduced motion accessibility', () => {
        it('renders static div when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(FadePresence, { className: "fade-class", children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
            expect(hasMotionDiv(container)).toBe(false);
            const div = container.querySelector('.fade-class');
            expect(div).toBeInTheDocument();
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });
        it('renders motion.div when motion is allowed', () => {
            mockReducedMotion = false;
            const { container } = render(_jsx(FadePresence, { children: _jsx("span", { children: "Content" }) }));
            expect(hasMotionDiv(container)).toBe(true);
        });
    });
});
describe('SlidePresence', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children', () => {
        render(_jsx(SlidePresence, { children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    describe('reduced motion accessibility', () => {
        it('uses fade-only animation when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(SlidePresence, { direction: "up", distance: 20, children: _jsx("span", { children: "Content" }) }));
            // Still renders motion.div but with fade variants instead of slide
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            // Fade variants should only have opacity, no x/y transforms
            expect(variants.initial).toHaveProperty('opacity');
            expect(variants.initial).not.toHaveProperty('x');
            expect(variants.initial).not.toHaveProperty('y');
        });
        it('uses slide animation when motion is allowed', () => {
            mockReducedMotion = false;
            const { container } = render(_jsx(SlidePresence, { direction: "up", distance: 20, children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            // Slide variants should include y transform
            expect(variants.initial).toHaveProperty('y');
        });
    });
    describe('direction variants', () => {
        beforeEach(() => {
            mockReducedMotion = false;
        });
        // Note: The direction describes where the element slides FROM
        // 'up' means it starts above (negative y) and slides down to position
        // 'down' means it starts below (positive y) and slides up to position
        // 'left' means it starts to the left (negative x) and slides right
        // 'right' means it starts to the right (positive x) and slides left
        it('slides from above when direction is "up"', () => {
            const { container } = render(_jsx(SlidePresence, { direction: "up", distance: 20, children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial.y).toBe(-20);
        });
        it('slides from below when direction is "down"', () => {
            const { container } = render(_jsx(SlidePresence, { direction: "down", distance: 20, children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial.y).toBe(20);
        });
        it('slides from the left when direction is "left"', () => {
            const { container } = render(_jsx(SlidePresence, { direction: "left", distance: 20, children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial.x).toBe(-20);
        });
        it('slides from the right when direction is "right"', () => {
            const { container } = render(_jsx(SlidePresence, { direction: "right", distance: 20, children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial.x).toBe(20);
        });
    });
});
describe('ScalePresence', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children', () => {
        render(_jsx(ScalePresence, { children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    describe('reduced motion accessibility', () => {
        it('uses fade-only animation when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(ScalePresence, { initialScale: 0.9, children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            // Should only have opacity, no scale
            expect(variants.initial).toHaveProperty('opacity');
            expect(variants.initial).not.toHaveProperty('scale');
        });
        it('uses scale animation when motion is allowed', () => {
            mockReducedMotion = false;
            const { container } = render(_jsx(ScalePresence, { initialScale: 0.9, children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            // Should include scale
            expect(variants.initial).toHaveProperty('scale', 0.9);
        });
    });
});
describe('ConditionalPresence', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children when show is true', () => {
        render(_jsx(ConditionalPresence, { show: true, children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    it('does not render children when show is false', () => {
        render(_jsx(ConditionalPresence, { show: false, children: _jsx("span", { "data-testid": "child", children: "Content" }) }));
        expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    });
    describe('reduced motion accessibility', () => {
        it('converts slide variant to fade when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(ConditionalPresence, { show: true, variant: "slide", direction: "up", children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            // Should be fade-only, no y transform
            expect(variants.initial).toHaveProperty('opacity');
            expect(variants.initial).not.toHaveProperty('y');
        });
        it('converts scale variant to fade when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(ConditionalPresence, { show: true, variant: "scale", children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            // Should be fade-only, no scale
            expect(variants.initial).toHaveProperty('opacity');
            expect(variants.initial).not.toHaveProperty('scale');
        });
        it('keeps fade variant as-is when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(ConditionalPresence, { show: true, variant: "fade", children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            // Should have fade properties
            expect(variants.initial).toHaveProperty('opacity');
        });
    });
    describe('variants', () => {
        beforeEach(() => {
            mockReducedMotion = false;
        });
        it('applies fade variant', () => {
            const { container } = render(_jsx(ConditionalPresence, { show: true, variant: "fade", children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial).toHaveProperty('opacity', 0);
            expect(variants.animate).toHaveProperty('opacity', 1);
        });
        it('applies slide variant', () => {
            const { container } = render(_jsx(ConditionalPresence, { show: true, variant: "slide", direction: "up", children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial).toHaveProperty('y');
        });
        it('applies scale variant', () => {
            const { container } = render(_jsx(ConditionalPresence, { show: true, variant: "scale", children: _jsx("span", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial).toHaveProperty('scale');
        });
    });
});
describe('StaggerContainer', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children', () => {
        render(_jsx(StaggerContainer, { children: _jsx("div", { "data-testid": "child", children: "Item" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    it('applies custom className', () => {
        const { container } = render(_jsx(StaggerContainer, { className: "stagger-class", children: _jsx("div", { children: "Item" }) }));
        expect(getMotionContainer(container)).toHaveClass('stagger-class');
    });
    describe('reduced motion accessibility', () => {
        it('renders static div when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsx(StaggerContainer, { className: "stagger-class", children: _jsx("div", { "data-testid": "child", children: "Item" }) }));
            expect(hasMotionDiv(container)).toBe(false);
            const div = container.querySelector('.stagger-class');
            expect(div).toBeInTheDocument();
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });
        it('renders motion.div when motion is allowed', () => {
            mockReducedMotion = false;
            const { container } = render(_jsx(StaggerContainer, { children: _jsx("div", { children: "Item" }) }));
            expect(hasMotionDiv(container)).toBe(true);
        });
    });
});
describe('AnimatedGrid', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    it('renders children', () => {
        render(_jsx(AnimatedGrid, { children: _jsx("div", { "data-testid": "child", children: "Item" }) }));
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
    it('applies grid styles', () => {
        const { container } = render(_jsxs(AnimatedGrid, { columns: 3, gap: 4, children: [_jsx("div", { children: "Item 1" }), _jsx("div", { children: "Item 2" }), _jsx("div", { children: "Item 3" })] }));
        const grid = getMotionContainer(container);
        expect(grid).toHaveStyle({
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        });
    });
    describe('reduced motion accessibility', () => {
        it('renders static div when reduced motion is preferred', () => {
            mockReducedMotion = true;
            const { container } = render(_jsxs(AnimatedGrid, { columns: 2, gap: 2, className: "grid-class", children: [_jsx("div", { "data-testid": "child1", children: "Item 1" }), _jsx("div", { "data-testid": "child2", children: "Item 2" })] }));
            expect(hasMotionDiv(container)).toBe(false);
            // Should still render children
            expect(screen.getByTestId('child1')).toBeInTheDocument();
            expect(screen.getByTestId('child2')).toBeInTheDocument();
            // Should apply grid styles to static div
            const grid = container.querySelector('.grid-class');
            expect(grid).toHaveStyle({
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            });
        });
        it('renders motion.div when motion is allowed', () => {
            mockReducedMotion = false;
            const { container } = render(_jsx(AnimatedGrid, { children: _jsx("div", { children: "Item" }) }));
            expect(hasMotionDiv(container)).toBe(true);
        });
    });
    describe('grid configuration', () => {
        beforeEach(() => {
            mockReducedMotion = false;
        });
        it('supports custom column count', () => {
            const { container } = render(_jsx(AnimatedGrid, { columns: 4, children: _jsx("div", { children: "Item" }) }));
            const grid = getMotionContainer(container);
            expect(grid).toHaveStyle({
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            });
        });
        it('supports custom gap', () => {
            const { container } = render(_jsx(AnimatedGrid, { gap: 8, children: _jsx("div", { children: "Item" }) }));
            const grid = getMotionContainer(container);
            expect(grid).toHaveClass('gap-8');
        });
    });
});
describe('WCAG 2.3.3 Compliance', () => {
    it('all animation components respect reduced motion preference', () => {
        mockReducedMotion = true;
        // AnimatedList should render static
        const { unmount: unmount1, container: container1 } = render(_jsx(AnimatedList, { children: _jsx("div", { "data-testid": "animated-list-child", children: "Item" }) }));
        expect(hasMotionDiv(container1)).toBe(false);
        expect(screen.getByTestId('animated-list-child')).toBeInTheDocument();
        unmount1();
        // AnimatedListItem should render static
        const { unmount: unmount2, container: container2 } = render(_jsx(AnimatedListItem, { children: _jsx("div", { "data-testid": "animated-item-child", children: "Item" }) }));
        expect(hasMotionDiv(container2)).toBe(false);
        expect(screen.getByTestId('animated-item-child')).toBeInTheDocument();
        unmount2();
        // FadePresence should render static
        const { unmount: unmount3, container: container3 } = render(_jsx(FadePresence, { children: _jsx("div", { "data-testid": "fade-child", children: "Content" }) }));
        expect(hasMotionDiv(container3)).toBe(false);
        expect(screen.getByTestId('fade-child')).toBeInTheDocument();
        unmount3();
        // StaggerContainer should render static
        const { unmount: unmount4, container: container4 } = render(_jsx(StaggerContainer, { children: _jsx("div", { "data-testid": "stagger-child", children: "Item" }) }));
        expect(hasMotionDiv(container4)).toBe(false);
        expect(screen.getByTestId('stagger-child')).toBeInTheDocument();
        unmount4();
        // AnimatedGrid should render static
        const { unmount: unmount5, container: container5 } = render(_jsx(AnimatedGrid, { children: _jsx("div", { "data-testid": "grid-child", children: "Item" }) }));
        expect(hasMotionDiv(container5)).toBe(false);
        expect(screen.getByTestId('grid-child')).toBeInTheDocument();
        unmount5();
    });
    it('content remains accessible when animations are disabled', () => {
        mockReducedMotion = true;
        // Verify all content is still visible and accessible
        render(_jsxs("div", { children: [_jsx(AnimatedList, { children: _jsx("div", { role: "listitem", children: "List item" }) }), _jsx(ConditionalPresence, { show: true, children: _jsx("button", { children: "Click me" }) }), _jsxs(AnimatedGrid, { columns: 2, children: [_jsx("div", { role: "gridcell", children: "Cell 1" }), _jsx("div", { role: "gridcell", children: "Cell 2" })] })] }));
        expect(screen.getByRole('listitem')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getAllByRole('gridcell')).toHaveLength(2);
    });
});
describe('Edge Cases', () => {
    beforeEach(() => {
        mockReducedMotion = false;
    });
    describe('empty and null children', () => {
        it('AnimatedList handles empty children', () => {
            const { container } = render(_jsx(AnimatedList, { children: null }));
            expect(container.firstChild).toBeInTheDocument();
        });
        it('AnimatedList handles undefined children', () => {
            const { container } = render(_jsx(AnimatedList, { children: undefined }));
            expect(container.firstChild).toBeInTheDocument();
        });
        it('AnimatedGrid handles empty children gracefully', () => {
            const { container } = render(_jsx(AnimatedGrid, { columns: 2, children: null }));
            expect(container.firstChild).toBeInTheDocument();
        });
        it('StaggerContainer handles no children', () => {
            const { container } = render(_jsx(StaggerContainer, { children: null }));
            expect(container.firstChild).toBeInTheDocument();
        });
        it('ConditionalPresence handles null children when shown', () => {
            const { container } = render(_jsx(ConditionalPresence, { show: true, children: null }));
            expect(container).toBeInTheDocument();
        });
    });
    describe('multiple children', () => {
        it('AnimatedList renders multiple children correctly', () => {
            render(_jsxs(AnimatedList, { children: [_jsx("div", { "data-testid": "item-1", children: "Item 1" }), _jsx("div", { "data-testid": "item-2", children: "Item 2" }), _jsx("div", { "data-testid": "item-3", children: "Item 3" })] }));
            expect(screen.getByTestId('item-1')).toBeInTheDocument();
            expect(screen.getByTestId('item-2')).toBeInTheDocument();
            expect(screen.getByTestId('item-3')).toBeInTheDocument();
        });
        it('AnimatedGrid renders correct number of children', () => {
            render(_jsx(AnimatedGrid, { columns: 3, children: Array.from({ length: 9 }, (_, i) => (_jsxs("div", { "data-testid": `cell-${i}`, children: ["Cell ", i] }, i))) }));
            for (let i = 0; i < 9; i++) {
                expect(screen.getByTestId(`cell-${i}`)).toBeInTheDocument();
            }
        });
    });
    describe('rapid re-rendering', () => {
        it('AnimatedList handles rapid className changes', () => {
            const { rerender, container } = render(_jsx(AnimatedList, { className: "class-1", children: _jsx("div", { children: "Item" }) }));
            rerender(_jsx(AnimatedList, { className: "class-2", children: _jsx("div", { children: "Item" }) }));
            rerender(_jsx(AnimatedList, { className: "class-3", children: _jsx("div", { children: "Item" }) }));
            const motionDiv = getMotionContainer(container);
            expect(motionDiv).toHaveClass('class-3');
        });
        it('ConditionalPresence handles rapid show/hide toggling', () => {
            const { rerender } = render(_jsx(ConditionalPresence, { show: true, children: _jsx("div", { "data-testid": "content", children: "Content" }) }));
            expect(screen.getByTestId('content')).toBeInTheDocument();
            rerender(_jsx(ConditionalPresence, { show: false, children: _jsx("div", { "data-testid": "content", children: "Content" }) }));
            rerender(_jsx(ConditionalPresence, { show: true, children: _jsx("div", { "data-testid": "content", children: "Content" }) }));
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });
        it('SlidePresence handles rapid direction changes', () => {
            const { rerender, container } = render(_jsx(SlidePresence, { direction: "up", distance: 20, children: _jsx("div", { children: "Content" }) }));
            rerender(_jsx(SlidePresence, { direction: "down", distance: 20, children: _jsx("div", { children: "Content" }) }));
            rerender(_jsx(SlidePresence, { direction: "left", distance: 20, children: _jsx("div", { children: "Content" }) }));
            const motionDiv = getMotionContainer(container);
            const variants = JSON.parse(motionDiv.getAttribute('data-variants') || '{}');
            expect(variants.initial).toHaveProperty('x', -20);
        });
    });
    describe('unmount behavior', () => {
        it('AnimatedList unmounts cleanly', () => {
            const { unmount } = render(_jsx(AnimatedList, { children: _jsx("div", { "data-testid": "child", children: "Item" }) }));
            expect(screen.getByTestId('child')).toBeInTheDocument();
            unmount();
            expect(screen.queryByTestId('child')).not.toBeInTheDocument();
        });
        it('ConditionalPresence unmounts cleanly', () => {
            const { unmount } = render(_jsx(ConditionalPresence, { show: true, children: _jsx("div", { "data-testid": "child", children: "Content" }) }));
            expect(screen.getByTestId('child')).toBeInTheDocument();
            unmount();
            expect(screen.queryByTestId('child')).not.toBeInTheDocument();
        });
        it('AnimatedGrid unmounts cleanly with many children', () => {
            const { unmount } = render(_jsx(AnimatedGrid, { columns: 3, children: Array.from({ length: 9 }, (_, i) => (_jsxs("div", { "data-testid": `cell-${i}`, children: ["Cell ", i] }, i))) }));
            expect(screen.getByTestId('cell-0')).toBeInTheDocument();
            unmount();
            expect(screen.queryByTestId('cell-0')).not.toBeInTheDocument();
        });
    });
    describe('reduced motion toggle during lifecycle', () => {
        it('handles reduced motion change after initial render', () => {
            mockReducedMotion = false;
            const { rerender, container } = render(_jsx(AnimatedList, { className: "test-list", children: _jsx("div", { "data-testid": "child", children: "Item" }) }));
            // Initially should use motion
            expect(hasMotionDiv(container)).toBe(true);
            // Simulate preference change
            mockReducedMotion = true;
            rerender(_jsx(AnimatedList, { className: "test-list", children: _jsx("div", { "data-testid": "child", children: "Item" }) }));
            // Should now be static
            expect(hasMotionDiv(container)).toBe(false);
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=animated-list.test.js.map