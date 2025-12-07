/**
 * Tests for useAssistant hook
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAssistant } from '../use-assistant';
global.fetch = vi.fn();
describe('useAssistant', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should initialize with idle status', () => {
        const { result } = renderHook(() => useAssistant());
        expect(result.current.status).toBe('idle');
        expect(result.current.messages).toEqual([]);
        expect(result.current.toolInvocations).toEqual([]);
    });
    it('should initialize with initialMessages', () => {
        const initialMessages = [
            { role: 'user', content: 'Hello' },
        ];
        const { result } = renderHook(() => useAssistant({ initialMessages }));
        expect(result.current.messages).toHaveLength(1);
    });
    it('should handle submitMessage', async () => {
        const mockResponse = {
            ok: true,
            body: new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"content":"Hello assistant"}\n\n'));
                    controller.close();
                },
            }),
        };
        vi.mocked(fetch).mockResolvedValueOnce(mockResponse);
        const { result } = renderHook(() => useAssistant({ api: '/api/assistant', stream: true }));
        await result.current.submitMessage('Hello');
        await waitFor(() => {
            expect(result.current.messages.length).toBeGreaterThan(0);
        });
    });
    it('should track tool invocations', async () => {
        const mockResponse = {
            ok: true,
            body: new ReadableStream({
                start(controller) {
                    const toolInvocation = JSON.stringify({
                        toolInvocation: {
                            toolCallId: '123',
                            toolName: 'test-tool',
                            args: {},
                            state: 'call',
                        },
                    });
                    controller.enqueue(new TextEncoder().encode(`data: ${toolInvocation}\n\n`));
                    controller.close();
                },
            }),
        };
        vi.mocked(fetch).mockResolvedValueOnce(mockResponse);
        const onToolCall = vi.fn();
        const { result } = renderHook(() => useAssistant({ api: '/api/assistant', onToolCall, stream: true }));
        await result.current.submitMessage('Use tool');
        await waitFor(() => {
            expect(onToolCall).toHaveBeenCalled();
            expect(result.current.toolInvocations.length).toBeGreaterThan(0);
        });
    });
    it('should handle stop', () => {
        const { result } = renderHook(() => useAssistant());
        result.current.stop();
        expect(result.current.status).toBe('idle');
        expect(result.current.isLoading).toBe(false);
    });
});
//# sourceMappingURL=use-assistant.test.js.map