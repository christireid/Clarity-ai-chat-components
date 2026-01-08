import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * FlowToken Adapter Component Tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FlowTokenStreamingText, FlowTokenMarkdown, useFlowToken, } from '../flowtoken-adapter';
describe('FlowTokenStreamingText', () => {
    describe('Fallback rendering (flowtoken not installed)', () => {
        it('should render content with fallback', () => {
            render(_jsx(FlowTokenStreamingText, { content: "Hello world", isStreaming: false }));
            expect(screen.getByText('Hello world')).toBeInTheDocument();
        });
        it('should show streaming cursor when streaming', () => {
            render(_jsx(FlowTokenStreamingText, { content: "Streaming...", isStreaming: true }));
            expect(screen.getByText('Streaming...')).toBeInTheDocument();
            expect(screen.getByText('▋')).toBeInTheDocument();
        });
        it('should hide cursor when not streaming', () => {
            render(_jsx(FlowTokenStreamingText, { content: "Complete", isStreaming: false }));
            expect(screen.queryByText('▋')).not.toBeInTheDocument();
        });
        it('should apply custom className', () => {
            const { container } = render(_jsx(FlowTokenStreamingText, { content: "Content", className: "custom-class" }));
            // The className should be on a wrapper div
            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });
    });
    describe('Markdown fallback', () => {
        it('should render with prose classes when markdown=true', () => {
            const { container } = render(_jsx(FlowTokenStreamingText, { content: "# Heading", markdown: true }));
            const proseElement = container.querySelector('.prose');
            expect(proseElement).toBeInTheDocument();
        });
        it('should render without prose classes when markdown=false', () => {
            const { container } = render(_jsx(FlowTokenStreamingText, { content: "Plain text", markdown: false }));
            const proseElement = container.querySelector('.prose');
            expect(proseElement).not.toBeInTheDocument();
        });
    });
    describe('onComplete callback', () => {
        it('should call onComplete when streaming ends', async () => {
            const onComplete = vi.fn();
            const { rerender } = render(_jsx(FlowTokenStreamingText, { content: "Start", isStreaming: true, onComplete: onComplete }));
            // Rerender with streaming=false
            rerender(_jsx(FlowTokenStreamingText, { content: "End", isStreaming: false, onComplete: onComplete }));
            await waitFor(() => {
                expect(onComplete).toHaveBeenCalled();
            });
        });
    });
    describe('displayName', () => {
        it('should have correct displayName', () => {
            expect(FlowTokenStreamingText.displayName).toBe('FlowTokenStreamingText');
        });
    });
});
describe('FlowTokenMarkdown', () => {
    it('should render as markdown streaming text', () => {
        const { container } = render(_jsx(FlowTokenMarkdown, { content: "**Bold text**", isStreaming: false }));
        const proseElement = container.querySelector('.prose');
        expect(proseElement).toBeInTheDocument();
    });
    it('should show streaming cursor when streaming', () => {
        render(_jsx(FlowTokenMarkdown, { content: "Streaming markdown...", isStreaming: true }));
        expect(screen.getByText('▋')).toBeInTheDocument();
    });
    describe('displayName', () => {
        it('should have correct displayName', () => {
            expect(FlowTokenMarkdown.displayName).toBe('FlowTokenMarkdown');
        });
    });
});
describe('useFlowToken', () => {
    it('should return initial loading state', () => {
        const TestComponent = () => {
            const { isLoading, isAvailable, components } = useFlowToken();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "loading", children: String(isLoading) }), _jsx("span", { "data-testid": "available", children: String(isAvailable) }), _jsx("span", { "data-testid": "stream-text", children: String(components.StreamText !== null) }), _jsx("span", { "data-testid": "animated-md", children: String(components.AnimatedMarkdown !== null) })] }));
        };
        render(_jsx(TestComponent, {}));
        // Initially loading should be true
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
    });
    it('should eventually resolve loading state', async () => {
        const TestComponent = () => {
            const { isLoading, isAvailable } = useFlowToken();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "loading", children: String(isLoading) }), _jsx("span", { "data-testid": "available", children: String(isAvailable) })] }));
        };
        render(_jsx(TestComponent, {}));
        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });
        // Since flowtoken is not installed, should not be available
        expect(screen.getByTestId('available')).toHaveTextContent('false');
    });
});
//# sourceMappingURL=flowtoken-adapter.test.js.map