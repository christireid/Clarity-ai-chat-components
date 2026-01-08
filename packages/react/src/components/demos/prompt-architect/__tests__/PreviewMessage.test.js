import { jsx as _jsx } from "react/jsx-runtime";
/**
 * PreviewMessage Component Tests
 *
 * Critical: Tests for the streaming cursor animation fix (DURATION_SECONDS.slower)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { PreviewMessage } from '../components/PreviewMessage';
// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (_jsx("div", { className: className, ...props, children: children })),
        span: ({ children, className, ...props }) => (_jsx("span", { className: className, ...props, children: children })),
    },
}));
describe('PreviewMessage', () => {
    const baseMessage = {
        id: 'test-1',
        role: 'user',
        content: 'Hello world',
        isCompiled: true,
        timestamp: new Date(),
    };
    describe('Rendering', () => {
        it('should render user message correctly', () => {
            render(_jsx(PreviewMessage, { message: baseMessage }));
            expect(screen.getByText('Hello world')).toBeInTheDocument();
            expect(screen.getByText('USER')).toBeInTheDocument();
            expect(screen.getByText('👤')).toBeInTheDocument();
        });
        it('should render system message correctly', () => {
            const systemMessage = {
                ...baseMessage,
                role: 'system',
                content: 'System instructions',
            };
            render(_jsx(PreviewMessage, { message: systemMessage }));
            expect(screen.getByText('System instructions')).toBeInTheDocument();
            expect(screen.getByText('SYSTEM')).toBeInTheDocument();
            expect(screen.getByText('⚙️')).toBeInTheDocument();
        });
        it('should render assistant message correctly', () => {
            const assistantMessage = {
                ...baseMessage,
                role: 'assistant',
                content: 'AI response',
            };
            render(_jsx(PreviewMessage, { message: assistantMessage }));
            expect(screen.getByText('AI response')).toBeInTheDocument();
            expect(screen.getByText('ASSISTANT')).toBeInTheDocument();
            expect(screen.getByText('🤖')).toBeInTheDocument();
        });
    });
    describe('Streaming', () => {
        it('should display streaming content when streaming', () => {
            render(_jsx(PreviewMessage, { message: baseMessage, isStreaming: true, streamingContent: "Partial content..." }));
            expect(screen.getByText('Partial content...')).toBeInTheDocument();
        });
        it('should show streaming cursor when streaming', () => {
            const { container } = render(_jsx(PreviewMessage, { message: baseMessage, isStreaming: true, streamingContent: "Streaming..." }));
            // The cursor should be rendered (mocked as span)
            const cursor = container.querySelector('span.inline-block.w-2.h-4');
            expect(cursor).toBeInTheDocument();
        });
        it('should not show cursor when not streaming', () => {
            const { container } = render(_jsx(PreviewMessage, { message: baseMessage, isStreaming: false }));
            // The cursor should NOT be rendered
            const cursor = container.querySelector('span.inline-block.w-2.h-4');
            expect(cursor).not.toBeInTheDocument();
        });
    });
    describe('Content display', () => {
        it('should preserve whitespace in content', () => {
            const messageWithWhitespace = {
                ...baseMessage,
                content: 'Line 1\n\nLine 2\n  Indented',
            };
            const { container } = render(_jsx(PreviewMessage, { message: messageWithWhitespace }));
            // Check for whitespace-pre-wrap class
            const contentDiv = container.querySelector('.whitespace-pre-wrap');
            expect(contentDiv).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=PreviewMessage.test.js.map