import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StreamBlock } from '../stream-block';
vi.mock('@clarity-chat/primitives', () => ({
    cn: (...classes) => classes.filter(Boolean).join(' '),
}));
describe('StreamBlock', () => {
    it('renders fallback when no content is available', () => {
        render(_jsx(StreamBlock, { fallback: _jsx("span", { children: "No content" }) }));
        expect(screen.getByText('No content')).toBeInTheDocument();
    });
    it('renders streamed values from an async iterable', async () => {
        async function* generator() {
            yield 'Hello';
            await Promise.resolve();
            yield 'World';
        }
        render(_jsx(StreamBlock, { source: generator() }));
        await waitFor(() => {
            expect(screen.getByText('World')).toBeInTheDocument();
        });
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });
    it('renders error fallback when stream fails', async () => {
        async function* generator() {
            yield 'Partial';
            throw new Error('boom');
        }
        render(_jsx(StreamBlock, { source: generator(), errorFallback: "Error" }));
        await waitFor(() => {
            expect(screen.getByText('Error')).toBeInTheDocument();
        });
    });
    it('supports streamable value objects', async () => {
        const listeners = new Set();
        const streamable = {
            subscribe(listener) {
                listeners.add(listener);
                return () => listeners.delete(listener);
            },
        };
        render(_jsx(StreamBlock, { source: streamable }));
        const [listener] = Array.from(listeners);
        listener?.('first');
        await waitFor(() => {
            expect(screen.getByText('first')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=stream-block.test.js.map