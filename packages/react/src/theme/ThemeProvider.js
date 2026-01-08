import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { applyThemeToDocument, createTheme as createThemeLegacy, } from './theme-builder';
import { ThemeContext } from './theme-context';
import { modernThemes, isValidModernThemeName, } from './modern-presets';
import { createTheme as createThemeModern, } from './create-theme';
import { useReducedMotion } from '@clarity-chat/primitives';
import { getMotionSafeDuration, getMotionSafeValue, } from '../animations/motion-safe';
import { cn } from '@clarity-chat/primitives';
import { DURATION_SECONDS } from '../animations/constants';
// ThemeContext is defined in `theme-context.ts` so `useTheme()` and ThemeProvider
// share the same context instance across all imports.
/**
 * Check if a value is a CompleteThemeConfig (has colors, typography, etc.)
 * vs a ThemeConfig (has mode, preset, customTheme, etc.)
 */
function isCompleteThemeConfig(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    // CompleteThemeConfig has 'colors' and 'typography' as required fields
    return ('colors' in obj && 'typography' in obj && typeof obj.colors === 'object');
}
/**
 * Normalize theme input to ThemeConfig format
 * Allows users to pass either:
 * - Partial<ThemeConfig> (e.g., { preset: 'default' })
 * - CompleteThemeConfig (e.g., defaultLightTheme directly)
 */
function normalizeThemeInput(input) {
    if (!input)
        return { mode: 'system' };
    // If it's a complete theme config, wrap it
    if (isCompleteThemeConfig(input)) {
        return {
            mode: input.mode || 'light',
            customTheme: input,
        };
    }
    return input;
}
/**
 * Animation speed durations in milliseconds
 */
const animationSpeedMap = {
    none: 0,
    fast: 100,
    normal: 200,
    slow: 400,
};
/**
 * ThemeProvider - Provides theme context to all Clarity Chat components
 *
 * Features:
 * - Light/Dark mode support
 * - System preference detection
 * - LocalStorage persistence
 * - CSS variable injection
 * - Real-time theme switching
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme={{ mode: 'dark', radius: 8 }}>
 *   <ChatWindow />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, defaultTheme: defaultThemeInput, storageKey = 'clarity-chat-theme', enableCrossTabSync = true, crossTabSyncDebounce = 100, animationSpeed = 'normal', }) {
    // Normalize the input to handle both ThemeConfig and CompleteThemeConfig
    const normalizedDefault = React.useMemo(() => normalizeThemeInput(defaultThemeInput), [defaultThemeInput]);
    // Initialize with defaults (SSR-safe)
    const [theme, setThemeState] = React.useState(() => ({
        mode: 'system',
        ...normalizedDefault,
    }));
    // Track if we've hydrated from localStorage
    const [isHydrated, setIsHydrated] = React.useState(false);
    // Hydrate from localStorage after mount (SSR-safe)
    React.useEffect(() => {
        if (isHydrated)
            return;
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Only restore persistable preferences (mode, preset)
                // Don't restore customTheme as it may be stale
                const persistedPreferences = {};
                if (parsed.mode)
                    persistedPreferences.mode = parsed.mode;
                if (parsed.preset)
                    persistedPreferences.preset = parsed.preset;
                if (parsed.enableTransitions !== undefined) {
                    persistedPreferences.enableTransitions = parsed.enableTransitions;
                }
                if (Object.keys(persistedPreferences).length > 0) {
                    setThemeState((prev) => ({ ...prev, ...persistedPreferences }));
                }
            }
        }
        catch (error) {
            console.warn('Failed to load theme from localStorage:', error);
        }
        setIsHydrated(true);
    }, [storageKey, isHydrated]);
    // Resolve actual mode (light/dark) from system preference if needed
    const [resolvedMode, setResolvedMode] = React.useState('light');
    // Resolved theme configuration
    const [resolvedTheme, setResolvedTheme] = React.useState(null);
    // Listen to system preference changes
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateMode = () => {
            if (theme.mode === 'system') {
                setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
            }
            else {
                setResolvedMode(theme.mode);
            }
        };
        updateMode();
        // Listen for changes
        mediaQuery.addEventListener('change', updateMode);
        return () => mediaQuery.removeEventListener('change', updateMode);
    }, [theme.mode]);
    // Helper to get theme by preset name
    const getThemeByPreset = React.useCallback((preset) => {
        if (isValidModernThemeName(preset)) {
            return modernThemes[preset];
        }
        // Warn about invalid preset and fallback to default
        if (process.env.NODE_ENV !== 'production') {
            console.warn(`[Clarity Chat] Unknown theme preset "${preset}". ` +
                `Available presets: ${Object.keys(modernThemes).join(', ')}. ` +
                `Falling back to "default".`);
        }
        return modernThemes['default'];
    }, []);
    // Build complete theme configuration
    React.useEffect(() => {
        let complete;
        // If custom theme provided, use it
        if (theme.customTheme) {
            complete = theme.customTheme;
        }
        // If simple config provided (modern API), use it
        else if (theme.simpleConfig) {
            complete = createThemeModern(theme.simpleConfig);
        }
        // If preset specified, load it
        else if (theme.preset) {
            const baseTheme = getThemeByPreset(theme.preset);
            complete = theme.customizations
                ? createThemeLegacy(baseTheme, theme.customizations)
                : baseTheme;
        }
        // Otherwise, use default based on resolved mode
        else {
            const defaultPreset = resolvedMode === 'dark' ? 'default-dark' : 'default';
            complete = modernThemes[defaultPreset];
        }
        setResolvedTheme(complete);
    }, [theme, resolvedMode, getThemeByPreset]);
    // Check for reduced motion preference
    const prefersReducedMotion = useReducedMotion();
    // Apply theme to document
    React.useEffect(() => {
        if (!resolvedTheme)
            return;
        const root = document.documentElement;
        // Disable transitions if user prefers reduced motion, explicitly disabled, or animation is 'none'
        const enableTransitions = theme.enableTransitions !== false &&
            !prefersReducedMotion &&
            animationSpeed !== 'none';
        // Use animationSpeed prop, but allow theme.transitionDuration to override if set
        const baseTransitionDuration = theme.transitionDuration || animationSpeedMap[animationSpeed];
        const transitionDuration = getMotionSafeDuration(prefersReducedMotion, baseTransitionDuration);
        // Add transition class for smooth color changes
        if (enableTransitions) {
            root.style.setProperty('--theme-transition-duration', `${transitionDuration}ms`);
            root.classList.add('theme-transitioning');
        }
        // Apply theme
        applyThemeToDocument(resolvedTheme);
        // Remove transition class after animation completes
        if (enableTransitions) {
            const timeout = setTimeout(() => {
                root.classList.remove('theme-transitioning');
            }, transitionDuration);
            return () => clearTimeout(timeout);
        }
        return undefined;
    }, [
        resolvedTheme,
        theme.enableTransitions,
        theme.transitionDuration,
        prefersReducedMotion,
        animationSpeed,
    ]);
    // Save to localStorage (only persist user preferences, not full theme config)
    React.useEffect(() => {
        // Don't persist until hydrated to avoid overwriting with defaults
        if (!isHydrated)
            return;
        if (typeof window !== 'undefined') {
            try {
                // Only persist user-changeable preferences
                const toStore = {
                    mode: theme.mode,
                };
                if (theme.preset)
                    toStore.preset = theme.preset;
                if (theme.enableTransitions !== undefined) {
                    toStore.enableTransitions = theme.enableTransitions;
                }
                localStorage.setItem(storageKey, JSON.stringify(toStore));
            }
            catch (error) {
                console.warn('Failed to save theme to localStorage:', error);
            }
        }
    }, [
        theme.mode,
        theme.preset,
        theme.enableTransitions,
        storageKey,
        isHydrated,
    ]);
    // Cross-tab theme synchronization using BroadcastChannel
    React.useEffect(() => {
        if (!enableCrossTabSync || typeof window === 'undefined')
            return;
        if (typeof BroadcastChannel === 'undefined')
            return; // Not supported in older browsers
        const channelName = `${storageKey}-sync`;
        let channel = null;
        try {
            channel = new BroadcastChannel(channelName);
            // Listen for theme changes from other tabs
            channel.onmessage = (event) => {
                if (event.data?.type === 'theme-change') {
                    const newTheme = event.data.theme;
                    setThemeState((prev) => ({ ...prev, ...newTheme }));
                }
            };
        }
        catch (error) {
            // BroadcastChannel may not be available in some environments
            console.warn('Cross-tab theme sync not available:', error);
        }
        return () => {
            channel?.close();
        };
    }, [storageKey, enableCrossTabSync]);
    // Broadcast theme changes to other tabs with debouncing
    const broadcastRef = React.useRef(null);
    const broadcastTimeoutRef = React.useRef(null);
    React.useEffect(() => {
        if (!enableCrossTabSync || typeof window === 'undefined')
            return;
        if (typeof BroadcastChannel === 'undefined') {
            // Log warning in development only
            if (process.env.NODE_ENV !== 'production') {
                console.warn('[Clarity Chat] BroadcastChannel API not available. ' +
                    'Cross-tab theme sync will fall back to localStorage-only persistence. ' +
                    'Theme changes will sync on page reload but not in real-time.');
            }
            return;
        }
        if (!isHydrated)
            return; // Don't broadcast until hydrated
        const channelName = `${storageKey}-sync`;
        // Debounced broadcast function
        const broadcastTheme = () => {
            try {
                if (!broadcastRef.current) {
                    broadcastRef.current = new BroadcastChannel(channelName);
                }
                // Broadcast the theme change
                broadcastRef.current.postMessage({
                    type: 'theme-change',
                    theme: {
                        mode: theme.mode,
                        preset: theme.preset,
                        enableTransitions: theme.enableTransitions,
                    },
                });
            }
            catch {
                // Silently fail if broadcast not available
            }
        };
        // Clear any pending broadcast
        if (broadcastTimeoutRef.current) {
            clearTimeout(broadcastTimeoutRef.current);
        }
        // Apply debouncing if configured
        if (crossTabSyncDebounce > 0) {
            broadcastTimeoutRef.current = setTimeout(broadcastTheme, crossTabSyncDebounce);
        }
        else {
            broadcastTheme();
        }
        return () => {
            // Don't close channel here - we want to keep broadcasting on changes
            // Clean up timeout on unmount
            if (broadcastTimeoutRef.current) {
                clearTimeout(broadcastTimeoutRef.current);
            }
        };
    }, [
        theme.mode,
        theme.preset,
        theme.enableTransitions,
        storageKey,
        enableCrossTabSync,
        crossTabSyncDebounce,
        isHydrated,
    ]);
    // Cleanup broadcast channel on unmount
    React.useEffect(() => {
        return () => {
            broadcastRef.current?.close();
            broadcastRef.current = null;
        };
    }, []);
    // Memoize theme manipulation callbacks (already using useCallback - good!)
    const setTheme = React.useCallback((newTheme) => {
        setThemeState((prev) => ({ ...prev, ...newTheme }));
    }, []);
    const toggleMode = React.useCallback(() => {
        setThemeState((prev) => ({
            ...prev,
            mode: prev.mode === 'light' ? 'dark' : 'light',
        }));
    }, []);
    const setPreset = React.useCallback((preset) => {
        setThemeState((prev) => ({ ...prev, preset }));
    }, []);
    // Available presets
    const availablePresets = React.useMemo(() => Object.keys(modernThemes), []);
    const value = React.useMemo(() => ({
        theme,
        setTheme,
        mode: resolvedMode,
        toggleMode,
        resolvedTheme,
        setPreset,
        availablePresets,
    }), [
        theme,
        setTheme,
        resolvedMode,
        toggleMode,
        resolvedTheme,
        setPreset,
        availablePresets,
    ]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
/**
 * useTheme hook - Access theme context
 *
 * @example
 * ```tsx
 * const { mode, toggleMode, setPreset } = useTheme()
 *
 * // Toggle dark mode
 * <button onClick={toggleMode}>
 *   {mode === 'dark' ? 'Light' : 'Dark'}
 * </button>
 *
 * // Change preset
 * <button onClick={() => setPreset('vibrant')}>
 *   Vibrant Theme
 * </button>
 * ```
 */
export function useTheme() {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
export function ThemeModeSelector({ className, variant = 'buttons', size = 'md', }) {
    const { theme, setTheme, mode } = useTheme();
    const currentMode = theme.mode;
    const modes = [
        {
            value: 'light',
            label: 'Light',
            icon: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "5" }), _jsx("path", { d: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })] })),
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) })),
        },
        {
            value: 'system',
            label: 'System',
            icon: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }), _jsx("path", { d: "M8 21h8m-4-4v4" })] })),
        },
    ];
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };
    if (variant === 'dropdown') {
        return (_jsxs("div", { className: cn('relative inline-block', className), children: [_jsx("select", { value: currentMode, onChange: (e) => setTheme({ mode: e.target.value }), className: cn('appearance-none rounded-lg border border-border bg-background text-foreground', 'focus:outline-none focus:ring-2 focus:ring-ring/40', 'pr-8 cursor-pointer', sizeClasses[size]), "aria-label": "Select theme mode", children: modes.map((m) => (_jsx("option", { value: m.value, children: m.label }, m.value))) }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2", children: _jsx("svg", { className: "h-4 w-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) }) })] }));
    }
    if (variant === 'inline') {
        return (_jsx("div", { className: cn('inline-flex items-center gap-1 rounded-lg bg-muted p-1', className), role: "radiogroup", "aria-label": "Theme mode", children: modes.map((m) => (_jsxs("button", { type: "button", onClick: () => setTheme({ mode: m.value }), className: cn('inline-flex items-center gap-1.5 rounded-md transition-colors', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1', sizeClasses[size], currentMode === m.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'), role: "radio", "aria-checked": currentMode === m.value, "aria-label": m.label, children: [m.icon, _jsx("span", { className: "sr-only sm:not-sr-only", children: m.label })] }, m.value))) }));
    }
    // Default: buttons variant
    return (_jsxs("div", { className: cn('flex items-center gap-2', className), role: "radiogroup", "aria-label": "Theme mode", children: [modes.map((m) => (_jsxs("button", { type: "button", onClick: () => setTheme({ mode: m.value }), className: cn('inline-flex items-center gap-2 rounded-lg border transition-colors', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', sizeClasses[size], currentMode === m.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted'), role: "radio", "aria-checked": currentMode === m.value, "aria-label": m.label, children: [m.icon, _jsx("span", { children: m.label })] }, m.value))), currentMode === 'system' && (_jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: ["(using ", mode, ")"] }))] }));
}
export function ThemeToggle({ className, showLabel = false, variant = 'ghost', size = 'md', }) {
    const { mode, toggleMode, theme } = useTheme();
    const prefersReducedMotion = useReducedMotion();
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const handleToggle = React.useCallback(() => {
        setIsTransitioning(true);
        toggleMode();
        setTimeout(() => {
            setIsTransitioning(false);
        }, theme.transitionDuration || 200);
    }, [toggleMode, theme.transitionDuration]);
    const sizeClasses = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10',
        lg: 'h-12 w-12 text-lg',
    };
    const variantClasses = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-border/40 hover:bg-accent/50 hover:border-primary/50',
        ghost: 'hover:bg-accent/50',
    };
    return (_jsxs(motion.button, { onClick: handleToggle, disabled: isTransitioning, whileHover: {
            scale: getMotionSafeValue(prefersReducedMotion, 1.05, 1),
        }, whileTap: {
            scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1),
        }, className: cn('relative inline-flex items-center justify-center gap-2.5 rounded-lg', 'transition-all duration-150 ease-out', 'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2', 'disabled:opacity-50 disabled:cursor-not-allowed', sizeClasses[size], variantClasses[variant], showLabel && 'px-3.5', className), "aria-label": `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`, type: "button", children: [_jsx(AnimatePresence, { mode: "wait", initial: false, children: _jsxs(motion.div, { initial: {
                        rotate: getMotionSafeValue(prefersReducedMotion, -90, 0),
                        opacity: 0,
                        scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1),
                    }, animate: {
                        rotate: 0,
                        opacity: 1,
                        scale: 1,
                    }, exit: {
                        rotate: getMotionSafeValue(prefersReducedMotion, 90, 0),
                        opacity: 0,
                        scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1),
                    }, transition: {
                        duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
                        ease: 'easeOut',
                    }, className: "flex items-center gap-2.5", children: [mode === 'dark' ? (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "5" }), _jsx("path", { d: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })] })) : (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) })), showLabel && (_jsx("span", { className: "text-sm font-semibold", children: mode === 'dark' ? 'Light' : 'Dark' }))] }, mode) }), isTransitioning && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg", children: _jsx(motion.div, { animate: {
                        rotate: prefersReducedMotion ? 0 : 360,
                    }, transition: {
                        duration: DURATION_SECONDS.slower,
                        repeat: Infinity,
                        ease: 'linear',
                    }, className: "w-4 h-4 border-2 border-primary border-t-transparent rounded-full" }) }))] }));
}
//# sourceMappingURL=ThemeProvider.js.map