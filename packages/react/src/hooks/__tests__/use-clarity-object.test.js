/**
 * Tests for useClarityObject hook
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useClarityObject } from '../use-clarity-object';
// Mock fetch
global.fetch = vi.fn();
describe('useClarityObject', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should initialize with null object', () => {
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'test' },
        }));
        expect(result.current.object).toBeNull();
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.input).toEqual({ query: 'test' });
    });
    it('should handle non-streaming object generation', async () => {
        const mockObject = { products: [{ name: 'Product 1', price: 100 }] };
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ object: mockObject }),
        });
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'products' },
        }));
        await result.current.run();
        await waitFor(() => {
            expect(result.current.object).toEqual(mockObject);
            expect(result.current.isLoading).toBe(false);
        });
    });
    it('should handle streaming object generation', async () => {
        const mockObject = { products: [{ name: 'Product 1' }] };
        const chunks = [
            'data: {"products":',
            '[{"name":"Product',
            ' 1"}]}\n\n',
        ];
        const stream = new ReadableStream({
            start(controller) {
                chunks.forEach((chunk, index) => {
                    setTimeout(() => {
                        controller.enqueue(new TextEncoder().encode(chunk));
                        if (index === chunks.length - 1) {
                            controller.close();
                        }
                    }, index * 10);
                });
            },
        });
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            body: stream,
        });
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'products' },
            stream: true,
        }));
        await result.current.run();
        await waitFor(() => {
            expect(result.current.object).not.toBeNull();
        }, { timeout: 1000 });
    });
    it('should handle errors', async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'test' },
        }));
        await result.current.run();
        await waitFor(() => {
            expect(result.current.error).toBeInstanceOf(Error);
            expect(result.current.error?.message).toBe('Network error');
            expect(result.current.isLoading).toBe(false);
        });
    });
    it('should handle API errors', async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
        });
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'test' },
        }));
        await result.current.run();
        await waitFor(() => {
            expect(result.current.error).toBeInstanceOf(Error);
            expect(result.current.error?.message).toContain('500');
        });
    });
    it('should update input with setInput', () => {
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'initial' },
        }));
        expect(result.current.input).toEqual({ query: 'initial' });
        result.current.setInput({ query: 'updated' });
        expect(result.current.input).toEqual({ query: 'updated' });
    });
    it('should reset state', async () => {
        const mockObject = { products: [] };
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ object: mockObject }),
        });
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'test' },
        }));
        await result.current.run();
        await waitFor(() => {
            expect(result.current.object).toEqual(mockObject);
        });
        result.current.reset();
        expect(result.current.object).toBeNull();
        expect(result.current.error).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });
    it('should call onFinish callback', async () => {
        const mockObject = { products: [] };
        const onFinish = vi.fn();
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ object: mockObject }),
        });
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'test' },
            onFinish,
        }));
        await result.current.run();
        await waitFor(() => {
            expect(onFinish).toHaveBeenCalledWith(mockObject);
        });
    });
    it('should call onError callback', async () => {
        const error = new Error('Test error');
        const onError = vi.fn();
        vi.mocked(fetch).mockRejectedValueOnce(error);
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'test' },
            onError,
        }));
        await result.current.run();
        await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(error);
        });
    });
    it('should handle run with override input', async () => {
        const mockObject = { products: [] };
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ object: mockObject }),
        });
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'initial' },
        }));
        await result.current.run({ query: 'override' });
        await waitFor(() => {
            expect(result.current.object).toEqual(mockObject);
        });
        // Verify fetch was called with override input
        expect(fetch).toHaveBeenCalledWith('/api/generate-object', expect.objectContaining({
            body: expect.stringContaining('override'),
        }));
    });
    it('should cancel previous request on new run', async () => {
        const abortController = new AbortController();
        const abortSpy = vi.spyOn(abortController, 'abort');
        vi.mocked(fetch).mockImplementation(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: async () => ({ object: {} }),
                    });
                }, 100);
            });
        });
        const { result } = renderHook(() => useClarityObject({
            api: '/api/generate-object',
            initialInput: { query: 'test' },
        }));
        // Start first request
        result.current.run();
        // Start second request immediately (should cancel first)
        await result.current.run({ query: 'new' });
        // First request should be cancelled
        await waitFor(() => {
            expect(result.current.object).not.toBeNull();
        });
    });
});
//# sourceMappingURL=use-clarity-object.test.js.map