import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from '../scroll-area';
describe('ScrollArea Component', () => {
    describe('Rendering', () => {
        it('should render scroll area with children', () => {
            render(_jsx(ScrollArea, { children: _jsx("div", { children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('should render multiple children', () => {
            render(_jsxs(ScrollArea, { children: [_jsx("div", { children: "Item 1" }), _jsx("div", { children: "Item 2" }), _jsx("div", { children: "Item 3" })] }));
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(screen.getByText('Item 2')).toBeInTheDocument();
            expect(screen.getByText('Item 3')).toBeInTheDocument();
        });
        it('should render empty scroll area', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true }));
            // With useCustomScrollbar, we get the old div-based implementation
            // Check that the component renders (firstChild should be the div)
            const scrollArea = container.firstChild;
            expect(scrollArea).toBeTruthy();
            // Check for overflow-y-auto (the actual class used)
            expect(scrollArea).toHaveClass('overflow-y-auto');
        });
    });
    describe('Styling', () => {
        it('should apply default scroll area styles', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true }));
            // With useCustomScrollbar, we get the old div-based implementation
            const scrollArea = container.firstChild;
            expect(scrollArea).toBeTruthy();
            // Check for overflow-y-auto (the actual class used)
            expect(scrollArea).toHaveClass('overflow-y-auto');
        });
        it('should have custom scrollbar styling', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true }));
            const scrollArea = container.querySelector('.scrollbar-thin');
            expect(scrollArea).toBeInTheDocument();
        });
        it('should have scrollbar thumb styling', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true }));
            const scrollArea = container.querySelector('.scrollbar-thumb-muted-foreground\\/20');
            expect(scrollArea).toBeInTheDocument();
        });
        it('should have hover scrollbar styling', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true }));
            const scrollArea = container.querySelector('.hover\\:scrollbar-thumb-muted-foreground\\/40');
            expect(scrollArea).toBeInTheDocument();
        });
        it('should have transition classes', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true }));
            const scrollArea = container.querySelector('.transition-colors');
            expect(scrollArea).toBeInTheDocument();
        });
        it('should have duration class', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true }));
            const scrollArea = container.querySelector('.duration-200');
            expect(scrollArea).toBeInTheDocument();
        });
        it('should accept custom className', () => {
            const { container } = render(_jsx(ScrollArea, { className: "custom-scroll" }));
            const scrollArea = container.querySelector('.custom-scroll');
            expect(scrollArea).toBeInTheDocument();
        });
    });
    describe('Accessibility', () => {
        it('should support aria-label', () => {
            render(_jsx(ScrollArea, { useCustomScrollbar: true, "aria-label": "Scrollable content area" }));
            expect(screen.getByLabelText('Scrollable content area')).toBeInTheDocument();
        });
        it('should support role attribute', () => {
            render(_jsx(ScrollArea, { useCustomScrollbar: true, role: "region" }));
            expect(screen.getByRole('region')).toBeInTheDocument();
        });
        it('should support aria-labelledby', () => {
            render(_jsxs("div", { children: [_jsx("div", { id: "scroll-label", children: "Content" }), _jsx(ScrollArea, { useCustomScrollbar: true, "aria-labelledby": "scroll-label" })] }));
            const scrollArea = screen.getByLabelText('Content');
            expect(scrollArea).toBeInTheDocument();
        });
    });
    describe('Ref Forwarding', () => {
        it('should forward ref to scroll area element', () => {
            const ref = { current: null };
            render(_jsx(ScrollArea, { useCustomScrollbar: true, ref: ref }));
            // With useCustomScrollbar, ref points to div
            expect(ref.current).toBeInstanceOf(HTMLDivElement);
        });
    });
    describe('Content Scrolling', () => {
        it('should handle overflow content', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true, style: { height: '100px' }, children: _jsx("div", { style: { height: '200px' }, children: "Long content" }) }));
            const scrollArea = container.firstChild;
            expect(scrollArea).toBeTruthy();
            // Check for overflow-y-auto (the actual class used)
            expect(scrollArea).toHaveClass('overflow-y-auto');
            expect(screen.getByText('Long content')).toBeInTheDocument();
        });
        it('should handle horizontal scrolling', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true, style: { width: '100px' }, children: _jsx("div", { style: { width: '200px' }, children: "Wide content" }) }));
            const scrollArea = container.firstChild;
            expect(scrollArea).toBeTruthy();
            // Check for overflow-y-auto (the actual class used)
            expect(scrollArea).toHaveClass('overflow-y-auto');
            expect(screen.getByText('Wide content')).toBeInTheDocument();
        });
    });
    describe('Custom Props', () => {
        it('should accept custom data attributes', () => {
            render(_jsx(ScrollArea, { useCustomScrollbar: true, "data-testid": "custom-scroll" }));
            expect(screen.getByTestId('custom-scroll')).toBeInTheDocument();
        });
        it('should accept style prop', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true, style: { maxHeight: '300px' } }));
            const scrollArea = container.querySelector('[style*="max-height"]');
            expect(scrollArea).toBeInTheDocument();
        });
        it('should accept id attribute', () => {
            const { container } = render(_jsx(ScrollArea, { useCustomScrollbar: true, id: "scroll-container" }));
            const scrollArea = container.querySelector('#scroll-container');
            expect(scrollArea).toBeInTheDocument();
            expect(scrollArea).toHaveAttribute('id', 'scroll-container');
        });
    });
});
//# sourceMappingURL=scroll-area.test.js.map