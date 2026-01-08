/**
 * useKeyboardShortcuts Hook Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, getShortcutLabel, KEYBOARD_SHORTCUTS, } from './useKeyboardShortcuts';
describe('useKeyboardShortcuts', () => {
    // Dispatch keyboard event on document.body so target is an HTMLElement
    const dispatchKeyboardEvent = (options) => {
        const event = new KeyboardEvent('keydown', {
            key: options.key,
            metaKey: options.metaKey ?? false,
            ctrlKey: options.ctrlKey ?? false,
            shiftKey: options.shiftKey ?? false,
            bubbles: true,
            cancelable: true,
        });
        // Dispatch on document.body so it bubbles up to window with proper target
        document.body.dispatchEvent(event);
    };
    describe('keyboard shortcuts', () => {
        it('calls onShare when Cmd+S is pressed', () => {
            const onShare = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onShare }));
            dispatchKeyboardEvent({ key: 's', metaKey: true });
            expect(onShare).toHaveBeenCalledTimes(1);
        });
        it('calls onShare when Ctrl+S is pressed', () => {
            const onShare = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onShare }));
            dispatchKeyboardEvent({ key: 's', ctrlKey: true });
            expect(onShare).toHaveBeenCalledTimes(1);
        });
        it('calls onRun when Cmd+Enter is pressed', () => {
            const onRun = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onRun }));
            dispatchKeyboardEvent({ key: 'Enter', metaKey: true });
            expect(onRun).toHaveBeenCalledTimes(1);
        });
        it('calls onCopy when Cmd+Shift+C is pressed', () => {
            const onCopy = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onCopy }));
            dispatchKeyboardEvent({ key: 'C', metaKey: true, shiftKey: true });
            expect(onCopy).toHaveBeenCalledTimes(1);
        });
        it('calls onReset when Cmd+Shift+R is pressed', () => {
            const onReset = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onReset }));
            dispatchKeyboardEvent({ key: 'R', metaKey: true, shiftKey: true });
            expect(onReset).toHaveBeenCalledTimes(1);
        });
        it('calls onToggleTheme when Cmd+Shift+D is pressed', () => {
            const onToggleTheme = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onToggleTheme }));
            dispatchKeyboardEvent({ key: 'D', metaKey: true, shiftKey: true });
            expect(onToggleTheme).toHaveBeenCalledTimes(1);
        });
        it('calls onToggleConsole when Cmd+` is pressed', () => {
            const onToggleConsole = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onToggleConsole }));
            dispatchKeyboardEvent({ key: '`', metaKey: true });
            expect(onToggleConsole).toHaveBeenCalledTimes(1);
        });
        it('calls onToggleSettings when Cmd+, is pressed', () => {
            const onToggleSettings = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onToggleSettings }));
            dispatchKeyboardEvent({ key: ',', metaKey: true });
            expect(onToggleSettings).toHaveBeenCalledTimes(1);
        });
        it('calls onEscape when Escape is pressed', () => {
            const onEscape = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onEscape }));
            dispatchKeyboardEvent({ key: 'Escape' });
            expect(onEscape).toHaveBeenCalledTimes(1);
        });
        it('does not call callbacks when enabled is false', () => {
            const onShare = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onShare, enabled: false }));
            dispatchKeyboardEvent({ key: 's', metaKey: true });
            expect(onShare).not.toHaveBeenCalled();
        });
        it('removes event listener on unmount', () => {
            const onShare = vi.fn();
            const { unmount } = renderHook(() => useKeyboardShortcuts({ onShare }));
            unmount();
            dispatchKeyboardEvent({ key: 's', metaKey: true });
            expect(onShare).not.toHaveBeenCalled();
        });
        it('does not trigger shortcuts when typing in input fields', () => {
            const onShare = vi.fn();
            renderHook(() => useKeyboardShortcuts({ onShare }));
            // Create an input element and dispatch event on it
            const input = document.createElement('input');
            document.body.appendChild(input);
            const event = new KeyboardEvent('keydown', {
                key: 's',
                metaKey: true,
                bubbles: true,
            });
            input.dispatchEvent(event);
            expect(onShare).not.toHaveBeenCalled();
            document.body.removeChild(input);
        });
    });
});
describe('getShortcutLabel', () => {
    let originalNavigator;
    beforeEach(() => {
        originalNavigator = window.navigator;
    });
    afterEach(() => {
        Object.defineProperty(window, 'navigator', {
            value: originalNavigator,
            configurable: true,
        });
    });
    it('returns Mac symbols on Mac platform', () => {
        Object.defineProperty(window, 'navigator', {
            value: { platform: 'MacIntel' },
            configurable: true,
        });
        expect(getShortcutLabel('share')).toBe('⌘S');
        expect(getShortcutLabel('run')).toBe('⌘Enter');
    });
    it('returns Ctrl labels on non-Mac platforms', () => {
        Object.defineProperty(window, 'navigator', {
            value: { platform: 'Win32' },
            configurable: true,
        });
        expect(getShortcutLabel('share')).toBe('Ctrl+S');
        expect(getShortcutLabel('run')).toBe('Ctrl+Enter');
    });
});
describe('KEYBOARD_SHORTCUTS', () => {
    it('has all expected shortcuts defined', () => {
        expect(KEYBOARD_SHORTCUTS.share).toBeDefined();
        expect(KEYBOARD_SHORTCUTS.run).toBeDefined();
        expect(KEYBOARD_SHORTCUTS.copy).toBeDefined();
        expect(KEYBOARD_SHORTCUTS.reset).toBeDefined();
        expect(KEYBOARD_SHORTCUTS.theme).toBeDefined();
        expect(KEYBOARD_SHORTCUTS.console).toBeDefined();
        expect(KEYBOARD_SHORTCUTS.settings).toBeDefined();
    });
    it('has key and description for each shortcut', () => {
        for (const [, shortcut] of Object.entries(KEYBOARD_SHORTCUTS)) {
            expect(shortcut.key).toBeDefined();
            expect(shortcut.description).toBeDefined();
            expect(typeof shortcut.key).toBe('string');
            expect(typeof shortcut.description).toBe('string');
        }
    });
});
//# sourceMappingURL=useKeyboardShortcuts.test.js.map