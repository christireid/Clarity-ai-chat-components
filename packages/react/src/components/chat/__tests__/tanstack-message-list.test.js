import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TanStackMessageList Component Tests
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TanStackMessageList, AutoTanStackMessageList, useJumpToBottom, } from '../tanstack-message-list';
// Mock @tanstack/react-virtual
vi.mock('@tanstack/react-virtual', () => ({
    useVirtualizer: vi.fn(() => ({
        getVirtualItems: () => [],
        getTotalSize: () => 0,
        measureElement: vi.fn(),
        scrollToIndex: vi.fn(),
    })),
}));
// Create test messages
const createTestMessages = (count) => Array.from({ length: count }, (_, i) => ({
    id: `msg-${i}`,
    role: 'user',
    content: `Message ${i}`,
    createdAt: new Date(),
}));
describe('TanStackMessageList', () => {
    const defaultRenderMessage = (message) => (_jsx("div", { "data-testid": `message-${message.id}`, children: message.content }));
    describe('Basic rendering', () => {
        it('should render container with correct role', () => {
            render(_jsx(TanStackMessageList, { messages: [], renderMessage: defaultRenderMessage }));
            const container = screen.getByRole('log');
            expect(container).toBeInTheDocument();
            expect(container).toHaveAttribute('aria-label', 'Chat messages');
        });
        it('should have correct aria attributes', () => {
            render(_jsx(TanStackMessageList, { messages: [], renderMessage: defaultRenderMessage }));
            const container = screen.getByRole('log');
            expect(container).toHaveAttribute('aria-live', 'polite');
            expect(container).toHaveAttribute('aria-relevant', 'additions');
        });
        it('should apply custom className', () => {
            render(_jsx(TanStackMessageList, { messages: [], renderMessage: defaultRenderMessage, className: "custom-list-class" }));
            const container = screen.getByRole('log');
            expect(container).toHaveClass('custom-list-class');
        });
    });
    describe('Streaming state', () => {
        it('should set aria-busy when messages are streaming', () => {
            const messages = [
                {
                    id: 'msg-1',
                    role: 'assistant',
                    content: 'Streaming...',
                    status: 'streaming',
                    createdAt: new Date(),
                },
            ];
            render(_jsx(TanStackMessageList, { messages: messages, renderMessage: defaultRenderMessage }));
            const container = screen.getByRole('log');
            expect(container).toHaveAttribute('aria-busy', 'true');
        });
        it('should not set aria-busy when not streaming', () => {
            const messages = createTestMessages(2);
            render(_jsx(TanStackMessageList, { messages: messages, renderMessage: defaultRenderMessage }));
            const container = screen.getByRole('log');
            expect(container).toHaveAttribute('aria-busy', 'false');
        });
    });
    describe('Height configuration', () => {
        it('should use default height of 100%', () => {
            render(_jsx(TanStackMessageList, { messages: [], renderMessage: defaultRenderMessage }));
            const container = screen.getByRole('log');
            expect(container).toHaveStyle({ height: '100%' });
        });
        it('should accept custom height', () => {
            render(_jsx(TanStackMessageList, { messages: [], renderMessage: defaultRenderMessage, height: "500px" }));
            const container = screen.getByRole('log');
            expect(container).toHaveStyle({ height: '500px' });
        });
    });
    describe('displayName', () => {
        it('should have correct displayName', () => {
            expect(TanStackMessageList.displayName).toBe('TanStackMessageList');
        });
    });
});
describe('AutoTanStackMessageList', () => {
    const defaultRenderMessage = (message) => (_jsx("div", { "data-testid": `message-${message.id}`, children: message.content }));
    describe('Virtualization threshold', () => {
        it('should not virtualize small message lists', () => {
            const messages = createTestMessages(10);
            render(_jsx(AutoTanStackMessageList, { messages: messages, renderMessage: defaultRenderMessage, virtualizationThreshold: 50 }));
            // With small lists, messages should be rendered directly
            const container = screen.getByRole('log');
            expect(container).toBeInTheDocument();
        });
        it('should virtualize large message lists', () => {
            const messages = createTestMessages(100);
            render(_jsx(AutoTanStackMessageList, { messages: messages, renderMessage: defaultRenderMessage, virtualizationThreshold: 50 }));
            // Container should still be present
            const container = screen.getByRole('log');
            expect(container).toBeInTheDocument();
        });
        it('should use default threshold of 50', () => {
            const messages = createTestMessages(25);
            render(_jsx(AutoTanStackMessageList, { messages: messages, renderMessage: defaultRenderMessage }));
            // Should render without virtualization (under threshold)
            messages.forEach((msg) => {
                expect(screen.getByTestId(`message-${msg.id}`)).toBeInTheDocument();
            });
        });
    });
    describe('Non-virtualized rendering', () => {
        it('should render all messages directly when under threshold', () => {
            const messages = createTestMessages(5);
            render(_jsx(AutoTanStackMessageList, { messages: messages, renderMessage: defaultRenderMessage, virtualizationThreshold: 10 }));
            messages.forEach((msg) => {
                expect(screen.getByText(msg.content)).toBeInTheDocument();
            });
        });
    });
    describe('displayName', () => {
        it('should have correct displayName', () => {
            expect(AutoTanStackMessageList.displayName).toBe('AutoTanStackMessageList');
        });
    });
});
describe('useJumpToBottom', () => {
    it('should return expected interface', () => {
        const mockScrollControl = {
            isNearBottom: false,
            userHasScrolledUp: true,
            newMessageCount: 5,
            scrollToBottom: vi.fn(),
            scrollToIndex: vi.fn(),
            resetNewMessages: vi.fn(),
            handleScroll: vi.fn(),
        };
        const TestComponent = () => {
            const jumpToBottom = useJumpToBottom(mockScrollControl);
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "show-button", children: String(jumpToBottom.showButton) }), _jsx("span", { "data-testid": "unread-count", children: jumpToBottom.unreadCount }), _jsx("button", { onClick: jumpToBottom.handleClick, children: "Jump" })] }));
        };
        render(_jsx(TestComponent, {}));
        // showButton should be true when not near bottom and has new messages
        expect(screen.getByTestId('show-button')).toHaveTextContent('true');
        expect(screen.getByTestId('unread-count')).toHaveTextContent('5');
    });
    it('should hide button when near bottom', () => {
        const mockScrollControl = {
            isNearBottom: true,
            userHasScrolledUp: false,
            newMessageCount: 5,
            scrollToBottom: vi.fn(),
            scrollToIndex: vi.fn(),
            resetNewMessages: vi.fn(),
            handleScroll: vi.fn(),
        };
        const TestComponent = () => {
            const jumpToBottom = useJumpToBottom(mockScrollControl);
            return (_jsx("span", { "data-testid": "show-button", children: String(jumpToBottom.showButton) }));
        };
        render(_jsx(TestComponent, {}));
        expect(screen.getByTestId('show-button')).toHaveTextContent('false');
    });
    it('should hide button when no new messages', () => {
        const mockScrollControl = {
            isNearBottom: false,
            userHasScrolledUp: true,
            newMessageCount: 0,
            scrollToBottom: vi.fn(),
            scrollToIndex: vi.fn(),
            resetNewMessages: vi.fn(),
            handleScroll: vi.fn(),
        };
        const TestComponent = () => {
            const jumpToBottom = useJumpToBottom(mockScrollControl);
            return (_jsx("span", { "data-testid": "show-button", children: String(jumpToBottom.showButton) }));
        };
        render(_jsx(TestComponent, {}));
        expect(screen.getByTestId('show-button')).toHaveTextContent('false');
    });
});
//# sourceMappingURL=tanstack-message-list.test.js.map