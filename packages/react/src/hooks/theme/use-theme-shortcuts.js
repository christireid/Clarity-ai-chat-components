'use client';
import * as React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
export function useThemeShortcuts(options = {}) {
    const { enableToggle = true, enableCycle = true, enableDirectMode = true, toggleKey = 'l', cycleKey = 't', lightKey = '1', darkKey = '2', systemKey = '3', requireMeta = true, requireShift = true, onShortcut, } = options;
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
                const modes = [
                    'light',
                    'dark',
                    'system',
                ];
                const currentIndex = modes.indexOf(theme.mode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                setTheme({ mode: nextMode });
                onShortcut?.('cycle', nextMode);
                return;
            }
            // Handle direct mode shortcuts
            if (enableDirectMode) {
                if (key === lightKey.toLowerCase()) {
                    e.preventDefault();
                    setTheme({ mode: 'light' });
                    onShortcut?.('direct', 'light');
                    return;
                }
                if (key === darkKey.toLowerCase()) {
                    e.preventDefault();
                    setTheme({ mode: 'dark' });
                    onShortcut?.('direct', 'dark');
                    return;
                }
                if (key === systemKey.toLowerCase()) {
                    e.preventDefault();
                    setTheme({ mode: 'system' });
                    onShortcut?.('direct', 'system');
                    return;
                }
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
        enableDirectMode,
        toggleKey,
        cycleKey,
        lightKey,
        darkKey,
        systemKey,
        requireMeta,
        requireShift,
        onShortcut,
    ]);
    // Helper to format shortcut string
    const formatShortcut = (key) => {
        if (requireMeta && requireShift) {
            return `Ctrl/Cmd + Shift + ${key.toUpperCase()}`;
        }
        else if (requireMeta) {
            return `Ctrl/Cmd + ${key.toUpperCase()}`;
        }
        else if (requireShift) {
            return `Shift + ${key.toUpperCase()}`;
        }
        return key.toUpperCase();
    };
    // Return current theme info for convenience
    return {
        currentMode: mode,
        themeConfig: theme,
        shortcuts: {
            toggle: formatShortcut(toggleKey),
            cycle: formatShortcut(cycleKey),
            light: formatShortcut(lightKey),
            dark: formatShortcut(darkKey),
            system: formatShortcut(systemKey),
        },
    };
}
//# sourceMappingURL=use-theme-shortcuts.js.map