import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useStreamableUI } from '../use-streamable-ui';
describe('useStreamableUI', () => {
    it('starts idle when no source provided', () => {
        const { result } = renderHook(() => useStreamableUI(null));
        expect(result.current.status).toBe('idle');
        expect(result.current.values).toEqual([]);
        expect(result.current.latest).toBeNull();
    });
    it('collects values from async iterable and completes', async () => {
        async function* generator() {
            yield 'first';
            await Promise.resolve();
            yield 'second';
        }
        const { result } = renderHook(() => useStreamableUI(generator()));
        await waitFor(() => {
            expect(result.current.values).toHaveLength(2);
        });
        expect(result.current.values).toEqual(['first', 'second']);
        expect(result.current.status).toBe('complete');
        expect(result.current.latest).toBe('second');
    });
    it('replaces values when mode is replace', async () => {
        async function* generator() {
            yield 'alpha';
            await Promise.resolve();
            yield 'beta';
        }
        const { result } = renderHook(() => useStreamableUI(generator(), { mode: 'replace' }));
        await waitFor(() => {
            expect(result.current.values).toEqual(['beta']);
        });
        expect(result.current.latest).toBe('beta');
    });
    it('subscribes to streamable value sources', async () => {
        const listeners = new Set();
        const doneListeners = new Set();
        const streamable = {
            value: null,
            subscribe(listener) {
                listeners.add(listener);
                return () => listeners.delete(listener);
            },
            onDone(listener) {
                doneListeners.add(listener);
                return () => doneListeners.delete(listener);
            },
        };
        const emit = (value) => {
            streamable.value = value;
            listeners.forEach((listener) => listener(value));
        };
        const complete = () => {
            doneListeners.forEach((listener) => listener());
        };
        const { result } = renderHook(() => useStreamableUI(streamable, { mode: 'append' }));
        expect(result.current.values).toEqual([]);
        act(() => emit('chunk-1'));
        await waitFor(() => {
            expect(result.current.values).toEqual(['chunk-1']);
        });
        act(() => emit('chunk-2'));
        await waitFor(() => {
            expect(result.current.values).toEqual(['chunk-1', 'chunk-2']);
        });
        act(() => complete());
        await waitFor(() => {
            expect(result.current.status).toBe('complete');
        });
    });
});
//# sourceMappingURL=use-streamable-ui.test.js.map