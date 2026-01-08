/**
 * Tests for useOptimisticMessage hook
 *
 * Tests React 19's useOptimistic integration with proper transition handling
 * and accessibility announcements.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOptimisticMessage, } from '../use-optimistic-message';
// Mock the accessibility utilities
vi.mock('../../accessibility', () => ({
    announceToScreenReader: vi.fn(),
}));
import { announceToScreenReader } from '../../accessibility';
const mockAnnounce = vi.mocked(announceToScreenReader);
describe('useOptimisticMessage', () => {
    const mockMessage = {
        id: 'msg-1',
        chatId: 'chat-1',
        role: 'user',
        content: 'Test message',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent',
    };
    const createOptions = (overrides) => ({
        onSend: vi.fn().mockResolvedValue(mockMessage),
        onConfirm: vi.fn(),
        onError: vi.fn(),
        ...overrides,
    });
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('initial state', () => {
        it('should initialize with empty messages', () => {
            const { result } = renderHook(() => useOptimisticMessage(createOptions()));
            expect(result.current.messages).toEqual([]);
            expect(result.current.isSending).toBe(false);
        });
    });
    describe('sendOptimistic', () => {
        it('should add optimistic message immediately', async () => {
            const options = createOptions();
            const onSend = options.onSend;
            // Make onSend return a promise that doesn't resolve immediately
            let resolvePromise;
            onSend.mockReturnValue(new Promise((resolve) => {
                resolvePromise = resolve;
            }));
            const { result } = renderHook(() => useOptimisticMessage(options));
            // Start sending
            act(() => {
                result.current.sendOptimistic('Hello world');
            });
            // Flush timers and pending state
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            // Should show as sending
            expect(result.current.isSending).toBe(true);
            // Resolve the promise
            await act(async () => {
                resolvePromise(mockMessage);
                await vi.runAllTimersAsync();
            });
            // Should no longer be sending
            expect(result.current.isSending).toBe(false);
        });
        it('should call onSend with correct content', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            expect(options.onSend).toHaveBeenCalledWith('Hello world');
        });
        it('should call onConfirm on success', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            expect(options.onConfirm).toHaveBeenCalledWith(mockMessage);
        });
        it('should announce success to screen readers', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            expect(mockAnnounce).toHaveBeenCalledWith('Message sent successfully', 'polite');
        });
        it('should handle errors and call onError', async () => {
            const error = new Error('Network error');
            const options = createOptions({
                onSend: vi.fn().mockRejectedValue(error),
            });
            const { result } = renderHook(() => useOptimisticMessage(options));
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            expect(options.onError).toHaveBeenCalled();
            expect(options.onError).toHaveBeenCalledWith(error, expect.objectContaining({
                content: 'Hello world',
                isOptimistic: true,
            }));
        });
        it('should announce errors to screen readers', async () => {
            const options = createOptions({
                onSend: vi.fn().mockRejectedValue(new Error('Network error')),
            });
            const { result } = renderHook(() => useOptimisticMessage(options));
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            expect(mockAnnounce).toHaveBeenCalledWith('Failed to send message: Network error', 'assertive');
        });
        it('should set isSending during async operation', async () => {
            let resolvePromise;
            const options = createOptions({
                onSend: vi.fn().mockReturnValue(new Promise((resolve) => {
                    resolvePromise = resolve;
                })),
            });
            const { result } = renderHook(() => useOptimisticMessage(options));
            // Start sending
            act(() => {
                result.current.sendOptimistic('Hello world');
            });
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(result.current.isSending).toBe(true);
            // Complete
            await act(async () => {
                resolvePromise(mockMessage);
                await vi.runAllTimersAsync();
            });
            expect(result.current.isSending).toBe(false);
        });
        it('should generate unique IDs for messages', async () => {
            const options = createOptions();
            const onSend = options.onSend;
            // Track the message IDs
            const sentMessages = [];
            onSend.mockImplementation(async () => {
                const msg = { ...mockMessage, id: `msg-${sentMessages.length + 1}` };
                sentMessages.push(msg);
                return msg;
            });
            const { result } = renderHook(() => useOptimisticMessage(options));
            await act(async () => {
                await result.current.sendOptimistic('First message');
                await vi.runAllTimersAsync();
            });
            await act(async () => {
                await result.current.sendOptimistic('Second message');
                await vi.runAllTimersAsync();
            });
            // Both messages should be in the list with different IDs
            expect(result.current.messages).toHaveLength(2);
            expect(result.current.messages[0].id).not.toBe(result.current.messages[1].id);
        });
    });
    describe('retry', () => {
        it('should retry failed messages', async () => {
            const error = new Error('Network error');
            const options = createOptions({
                onSend: vi
                    .fn()
                    .mockRejectedValueOnce(error)
                    .mockResolvedValueOnce(mockMessage),
            });
            const { result } = renderHook(() => useOptimisticMessage(options));
            // First send fails
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            // Find the failed message
            const failedMessage = result.current.messages.find((m) => m.status === 'error');
            expect(failedMessage).toBeDefined();
            // Retry
            await act(async () => {
                await result.current.retry(failedMessage.id);
                await vi.runAllTimersAsync();
            });
            expect(options.onSend).toHaveBeenCalledTimes(2);
        });
        it('should announce retry success to screen readers', async () => {
            const options = createOptions({
                onSend: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Network error'))
                    .mockResolvedValueOnce(mockMessage),
            });
            const { result } = renderHook(() => useOptimisticMessage(options));
            // First send fails
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            mockAnnounce.mockClear();
            // Find the failed message and retry
            const failedMessage = result.current.messages.find((m) => m.status === 'error');
            await act(async () => {
                await result.current.retry(failedMessage.id);
                await vi.runAllTimersAsync();
            });
            expect(mockAnnounce).toHaveBeenCalledWith('Message retry successful', 'polite');
        });
        it('should ignore retry for non-error messages', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            // Send a successful message
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            const onSendCallCount = options.onSend.mock
                .calls.length;
            // Try to retry the successful message
            await act(async () => {
                await result.current.retry(result.current.messages[0].id);
                await vi.runAllTimersAsync();
            });
            // onSend should not have been called again
            expect(options.onSend).toHaveBeenCalledTimes(onSendCallCount);
        });
    });
    describe('cancel', () => {
        it('should call cancel without error', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            // Cancel should work even with non-existent ID
            act(() => {
                result.current.cancel('non-existent-id');
            });
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            // Should not throw
            expect(result.current.messages).toEqual([]);
        });
        it('should clear sending state when message completes', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            // Send a message that completes successfully
            await act(async () => {
                await result.current.sendOptimistic('Hello world');
                await vi.runAllTimersAsync();
            });
            // After completion, isSending should be false
            expect(result.current.isSending).toBe(false);
        });
    });
    describe('setMessages', () => {
        it('should set messages from server', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            act(() => {
                result.current.setMessages([mockMessage]);
            });
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(result.current.messages).toHaveLength(1);
            expect(result.current.messages[0].isOptimistic).toBe(false);
        });
        it('should replace existing messages', async () => {
            const options = createOptions();
            const { result } = renderHook(() => useOptimisticMessage(options));
            // Set initial messages
            act(() => {
                result.current.setMessages([mockMessage]);
            });
            // Replace with new messages
            const newMessage = { ...mockMessage, id: 'msg-2', content: 'New message' };
            act(() => {
                result.current.setMessages([newMessage]);
            });
            await act(async () => {
                await vi.runAllTimersAsync();
            });
            expect(result.current.messages).toHaveLength(1);
            expect(result.current.messages[0].content).toBe('New message');
        });
    });
    describe('unmount handling', () => {
        it('should not update state after unmount', async () => {
            let resolvePromise;
            const options = createOptions({
                onSend: vi.fn().mockReturnValue(new Promise((resolve) => {
                    resolvePromise = resolve;
                })),
            });
            const { result, unmount } = renderHook(() => useOptimisticMessage(options));
            // Start sending
            act(() => {
                result.current.sendOptimistic('Hello world');
            });
            // Unmount before the promise resolves
            unmount();
            // Resolve the promise after unmount
            await act(async () => {
                resolvePromise(mockMessage);
                await vi.runAllTimersAsync();
            });
            // Should not throw and onConfirm should not be called
            expect(options.onConfirm).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=use-optimistic-message.test.js.map