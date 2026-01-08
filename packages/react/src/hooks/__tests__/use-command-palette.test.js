import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCommandPalette } from '../use-command-palette';
// Mock navigator.platform for consistent testing
const mockNavigatorPlatform = (platform) => {
    Object.defineProperty(navigator, 'platform', {
        value: platform,
        configurable: true,
    });
};
describe('useCommandPalette', () => {
    beforeEach(() => {
        // Default to non-Mac platform for predictable tests
        mockNavigatorPlatform('Win32');
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('initial state', () => {
        it('should start closed by default', () => {
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.isOpen).toBe(false);
        });
        it('should start open when defaultOpen is true', () => {
            const { result } = renderHook(() => useCommandPalette({ defaultOpen: true }));
            expect(result.current.isOpen).toBe(true);
        });
        it('should return shortcutDisplay', () => {
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.shortcutDisplay).toBeTruthy();
        });
    });
    describe('open/close/toggle methods', () => {
        it('should open when open() is called', () => {
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.isOpen).toBe(false);
            act(() => {
                result.current.open();
            });
            expect(result.current.isOpen).toBe(true);
        });
        it('should close when close() is called', () => {
            const { result } = renderHook(() => useCommandPalette({ defaultOpen: true }));
            expect(result.current.isOpen).toBe(true);
            act(() => {
                result.current.close();
            });
            expect(result.current.isOpen).toBe(false);
        });
        it('should toggle state when toggle() is called', () => {
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.isOpen).toBe(false);
            act(() => {
                result.current.toggle();
            });
            expect(result.current.isOpen).toBe(true);
            act(() => {
                result.current.toggle();
            });
            expect(result.current.isOpen).toBe(false);
        });
        it('should set state directly with setOpen()', () => {
            const { result } = renderHook(() => useCommandPalette());
            act(() => {
                result.current.setOpen(true);
            });
            expect(result.current.isOpen).toBe(true);
            act(() => {
                result.current.setOpen(false);
            });
            expect(result.current.isOpen).toBe(false);
        });
    });
    describe('callbacks', () => {
        it('should call onOpen when opening', async () => {
            const onOpen = vi.fn();
            const { result } = renderHook(() => useCommandPalette({ onOpen }));
            act(() => {
                result.current.open();
            });
            await waitFor(() => {
                expect(onOpen).toHaveBeenCalledTimes(1);
            });
        });
        it('should call onClose when closing', async () => {
            const onClose = vi.fn();
            const { result } = renderHook(() => useCommandPalette({ defaultOpen: true, onClose }));
            act(() => {
                result.current.close();
            });
            await waitFor(() => {
                expect(onClose).toHaveBeenCalledTimes(1);
            });
        });
        it('should call onToggle with new state when toggling', async () => {
            const onToggle = vi.fn();
            const { result } = renderHook(() => useCommandPalette({ onToggle }));
            act(() => {
                result.current.toggle();
            });
            await waitFor(() => {
                expect(onToggle).toHaveBeenCalledWith(true);
            });
            act(() => {
                result.current.toggle();
            });
            await waitFor(() => {
                expect(onToggle).toHaveBeenCalledWith(false);
            });
        });
        it('should not fire callbacks on initial mount', () => {
            const onOpen = vi.fn();
            const onClose = vi.fn();
            const onToggle = vi.fn();
            renderHook(() => useCommandPalette({ onOpen, onClose, onToggle }));
            expect(onOpen).not.toHaveBeenCalled();
            expect(onClose).not.toHaveBeenCalled();
            expect(onToggle).not.toHaveBeenCalled();
        });
        it('should not fire onOpen callback on initial mount even with defaultOpen true', () => {
            const onOpen = vi.fn();
            const onToggle = vi.fn();
            renderHook(() => useCommandPalette({ defaultOpen: true, onOpen, onToggle }));
            expect(onOpen).not.toHaveBeenCalled();
            expect(onToggle).not.toHaveBeenCalled();
        });
    });
    describe('keyboard shortcuts', () => {
        const dispatchKeyboardEvent = (key, modifiers = {}) => {
            const event = new KeyboardEvent('keydown', {
                key,
                code: `Key${key.toUpperCase()}`,
                bubbles: true,
                cancelable: true,
                ...modifiers,
            });
            window.dispatchEvent(event);
        };
        it('should toggle on Ctrl+K (Windows/Linux)', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.isOpen).toBe(false);
            act(() => {
                dispatchKeyboardEvent('k', { ctrlKey: true });
            });
            expect(result.current.isOpen).toBe(true);
            act(() => {
                dispatchKeyboardEvent('k', { ctrlKey: true });
            });
            expect(result.current.isOpen).toBe(false);
        });
        it('should toggle on Cmd+K (Mac)', () => {
            mockNavigatorPlatform('MacIntel');
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.isOpen).toBe(false);
            act(() => {
                dispatchKeyboardEvent('k', { metaKey: true });
            });
            expect(result.current.isOpen).toBe(true);
        });
        it('should use custom shortcut when provided', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette({ shortcut: 'mod+p' }));
            expect(result.current.isOpen).toBe(false);
            // Default shortcut should not work
            act(() => {
                dispatchKeyboardEvent('k', { ctrlKey: true });
            });
            expect(result.current.isOpen).toBe(false);
            // Custom shortcut should work
            act(() => {
                dispatchKeyboardEvent('p', { ctrlKey: true });
            });
            expect(result.current.isOpen).toBe(true);
        });
        it('should not trigger when shortcutEnabled is false', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette({ shortcutEnabled: false }));
            act(() => {
                dispatchKeyboardEvent('k', { ctrlKey: true });
            });
            expect(result.current.isOpen).toBe(false);
        });
        it('should not trigger when focused on input elements by default', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette());
            // Create and focus an input
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();
            act(() => {
                const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true,
                });
                input.dispatchEvent(event);
            });
            expect(result.current.isOpen).toBe(false);
            // Cleanup
            document.body.removeChild(input);
        });
        it('should trigger in input elements when enableInInput is true', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette({ enableInInput: true }));
            // Create and focus an input
            const input = document.createElement('input');
            document.body.appendChild(input);
            input.focus();
            act(() => {
                const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true,
                });
                // Need to dispatch on window for the hook to catch it
                window.dispatchEvent(event);
            });
            expect(result.current.isOpen).toBe(true);
            // Cleanup
            document.body.removeChild(input);
        });
    });
    describe('shortcutDisplay', () => {
        it('should return Ctrl+K on Windows/Linux', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.shortcutDisplay).toBe('Ctrl+K');
        });
        it('should return ⌘K on Mac', () => {
            mockNavigatorPlatform('MacIntel');
            const { result } = renderHook(() => useCommandPalette());
            expect(result.current.shortcutDisplay).toBe('⌘K');
        });
        it('should reflect custom shortcut in display', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette({ shortcut: 'mod+shift+p' }));
            expect(result.current.shortcutDisplay).toBe('Ctrl+Shift+P');
        });
    });
    describe('function stability', () => {
        it('should return stable function references', () => {
            const { result, rerender } = renderHook(() => useCommandPalette());
            const { open: open1, close: close1, toggle: toggle1, setOpen: setOpen1 } = result.current;
            rerender();
            const { open: open2, close: close2, toggle: toggle2, setOpen: setOpen2 } = result.current;
            expect(open1).toBe(open2);
            expect(close1).toBe(close2);
            expect(toggle1).toBe(toggle2);
            expect(setOpen1).toBe(setOpen2);
        });
    });
    describe('edge cases', () => {
        it('should handle multiple rapid toggles', () => {
            const { result } = renderHook(() => useCommandPalette());
            act(() => {
                result.current.toggle();
                result.current.toggle();
                result.current.toggle();
            });
            // Should end up open (odd number of toggles)
            expect(result.current.isOpen).toBe(true);
        });
        it('should handle open when already open', () => {
            const { result } = renderHook(() => useCommandPalette({ defaultOpen: true }));
            act(() => {
                result.current.open();
            });
            expect(result.current.isOpen).toBe(true);
        });
        it('should handle close when already closed', () => {
            const { result } = renderHook(() => useCommandPalette());
            act(() => {
                result.current.close();
            });
            expect(result.current.isOpen).toBe(false);
        });
        it('should update callbacks when they change', async () => {
            const onOpen1 = vi.fn();
            const onOpen2 = vi.fn();
            const { result, rerender } = renderHook(({ onOpen }) => useCommandPalette({ onOpen }), { initialProps: { onOpen: onOpen1 } });
            // Change callback
            rerender({ onOpen: onOpen2 });
            act(() => {
                result.current.open();
            });
            await waitFor(() => {
                expect(onOpen1).not.toHaveBeenCalled();
                expect(onOpen2).toHaveBeenCalledTimes(1);
            });
        });
        it('should not fire callbacks when setOpen is called with current state', async () => {
            const onOpen = vi.fn();
            const onClose = vi.fn();
            const { result } = renderHook(() => useCommandPalette({ onOpen, onClose }));
            // Open first
            act(() => {
                result.current.open();
            });
            await waitFor(() => {
                expect(onOpen).toHaveBeenCalledTimes(1);
            });
            // Set to same state (open)
            act(() => {
                result.current.setOpen(true);
            });
            // Wait a tick then verify no additional calls
            await new Promise((r) => setTimeout(r, 50));
            expect(onOpen).toHaveBeenCalledTimes(1); // Still just 1 call
        });
        it('should clean up event listener on unmount', () => {
            const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            const { unmount } = renderHook(() => useCommandPalette());
            expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
            unmount();
            expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
            addEventListenerSpy.mockRestore();
            removeEventListenerSpy.mockRestore();
        });
        it('should handle complex shortcuts with multiple modifiers', () => {
            mockNavigatorPlatform('Win32');
            const { result } = renderHook(() => useCommandPalette({ shortcut: 'ctrl+shift+alt+k' }));
            expect(result.current.isOpen).toBe(false);
            // Partial modifier combinations should not work
            act(() => {
                const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    ctrlKey: true,
                    shiftKey: true,
                    // Missing altKey
                    bubbles: true,
                    cancelable: true,
                });
                window.dispatchEvent(event);
            });
            expect(result.current.isOpen).toBe(false);
            // Full modifier combination should work
            act(() => {
                const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    code: 'KeyK',
                    ctrlKey: true,
                    shiftKey: true,
                    altKey: true,
                    bubbles: true,
                    cancelable: true,
                });
                window.dispatchEvent(event);
            });
            expect(result.current.isOpen).toBe(true);
        });
        it('should handle special key shortcuts like Escape', () => {
            const { result } = renderHook(() => useCommandPalette({ shortcut: 'escape' }));
            act(() => {
                const event = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    bubbles: true,
                    cancelable: true,
                });
                window.dispatchEvent(event);
            });
            expect(result.current.isOpen).toBe(true);
        });
    });
});
//# sourceMappingURL=use-command-palette.test.js.map