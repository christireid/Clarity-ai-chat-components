'use client';
import * as React from 'react';
import { useTheme } from '../theme/ThemeProvider';
export function useThemeShortcuts(options = {}) {
    const { enableToggle = true, enableCycle = true, toggleKey = 'l', cycleKey = 't', requireMeta = true, requireShift = true, onShortcut, } = options;
    const { theme, setTheme, mode } = useTheme();
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if meta/ctrl key is required and pressed
            const metaPressed = e.metaKey || e.ctrlKey;
            if (requireMeta && !metaPressed)
                return;
            // Check if shift key is required and pressed
            if (requireShift && !e.shiftKey)
                return;
            // Normalize key to lowercase for comparison
            const key = e.key.toLowerCase();
            // Handle toggle shortcut (light <-> dark)
            if (enableToggle && key === toggleKey.toLowerCase()) {
                e.preventDefault();
                // Toggle between light and dark (ignore system)
                const newMode = mode === 'light' ? 'dark' : 'light';
                setTheme({ mode: newMode });
                onShortcut?.('toggle', newMode);
                return;
            }
            // Handle cycle shortcut (light -> dark -> system -> light)
            if (enableCycle && key === cycleKey.toLowerCase()) {
                e.preventDefault();
                const modes = ['light', 'dark', 'system'];
                const currentIndex = modes.indexOf(theme.mode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                setTheme({ mode: nextMode });
                onShortcut?.('cycle', nextMode);
                return;
            }
        };
        // Add global keyboard listener
        window.addEventListener('keydown', handleKeyDown);
        // Cleanup on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        mode,
        theme.mode,
        setTheme,
        enableToggle,
        enableCycle,
        toggleKey,
        cycleKey,
        requireMeta,
        requireShift,
        onShortcut,
    ]);
    // Return current theme info for convenience
    return {
        currentMode: mode,
        themeConfig: theme,
        shortcuts: {
            toggle: requireMeta && requireShift
                ? `Ctrl/Cmd + Shift + ${toggleKey.toUpperCase()}`
                : requireMeta
                    ? `Ctrl/Cmd + ${toggleKey.toUpperCase()}`
                    : requireShift
                        ? `Shift + ${toggleKey.toUpperCase()}`
                        : toggleKey.toUpperCase(),
            cycle: requireMeta && requireShift
                ? `Ctrl/Cmd + Shift + ${cycleKey.toUpperCase()}`
                : requireMeta
                    ? `Ctrl/Cmd + ${cycleKey.toUpperCase()}`
                    : requireShift
                        ? `Shift + ${cycleKey.toUpperCase()}`
                        : cycleKey.toUpperCase(),
        },
    };
}
//# sourceMappingURL=use-theme-shortcuts.js.map