import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Tests for VirtualizedMessageList component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageList, VirtualizedMessageList } from '../virtualized-message-list';
// Mock react-window since it requires a browser environment
vi.mock('react-window', () => ({
    VariableSizeList: ({ children, itemCount, itemData }) => {
        // Render first few items for testing
        const items = [];
        for (let i = 0; i < Math.min(itemCount, 5); i++) {
            items.push(children({ index: i, style: {}, data: itemData }));
        }
        return _jsx("div", { "data-testid": "virtual-list", children: items });
    },
}));
vi.mock('react-virtualized-auto-sizer', () => ({
    default: ({ children }) => children({ height: 600, width: 800 }),
}));
describe('MessageList', () => {
    const createMessages = (count) => Array.from({ length: count }, (_, i) => ({
        id: `msg-${i}`,
        role: 'user',
        content: `Message ${i}`,
    }));
    it('uses standard rendering for small lists', () => {
        const messages = createMessages(50);
        render(_jsx(MessageList, { messages: messages, renderMessage: (msg) => _jsx("div", { "data-testid": `msg-${msg.id}`, children: msg.content }) }));
        // Should render all messages without virtualization
        expect(screen.queryByTestId('virtual-list')).not.toBeInTheDocument();
        expect(screen.getByText('Message 0')).toBeInTheDocument();
    });
    it('uses virtualization for large lists', () => {
        const messages = createMessages(200);
        render(_jsx(MessageList, { messages: messages, renderMessage: (msg) => _jsx("div", { "data-testid": `msg-${msg.id}`, children: msg.content }), virtualizationThreshold: 100 }));
        // Should use virtual list
        expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    });
    it('respects custom virtualization threshold', () => {
        const messages = createMessages(50);
        render(_jsx(MessageList, { messages: messages, renderMessage: (msg) => _jsx("div", { children: msg.content }), virtualizationThreshold: 30 }));
        // Should virtualize since 50 > 30
        expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    });
});
describe('VirtualizedMessageList', () => {
    const createMessages = (count) => Array.from({ length: count }, (_, i) => ({
        id: `msg-${i}`,
        role: 'user',
        content: `Message ${i}`,
    }));
    it('renders with virtualization', () => {
        const messages = createMessages(1000);
        render(_jsx(VirtualizedMessageList, { messages: messages, renderMessage: (msg) => _jsx("div", { children: msg.content }) }));
        expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    });
    it('calls renderMessage for each visible item', () => {
        const messages = createMessages(100);
        const renderMessage = vi.fn((msg) => _jsx("div", { children: msg.content }));
        render(_jsx(VirtualizedMessageList, { messages: messages, renderMessage: renderMessage }));
        // Should render at least some messages
        expect(renderMessage).toHaveBeenCalled();
    });
    it('handles empty message list', () => {
        render(_jsx(VirtualizedMessageList, { messages: [], renderMessage: (msg) => _jsx("div", { children: msg.content }) }));
        expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    });
});
//# sourceMappingURL=virtualized-message-list.test.js.map