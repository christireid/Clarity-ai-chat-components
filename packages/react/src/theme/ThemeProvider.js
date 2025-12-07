import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { designTokens } from './design-tokens' // Reserved for future use
import { themes } from './presets';
import { applyThemeToDocument, createTheme } from './theme-builder';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { getMotionSafeDuration, getMotionSafeValue } from '../animations/motion-safe';
import { cn } from '@clarity-chat/primitives';
const ThemeContext = React.createContext(undefined);
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
export function ThemeProvider({ children, defaultTheme = { mode: 'system' }, storageKey = 'clarity-chat-theme', }) {
    const [theme, setThemeState] = React.useState(() => {
        // Try to load from localStorage
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    return { ...defaultTheme, ...JSON.parse(stored) };
                }
            }
            catch (error) {
                console.warn('Failed to load theme from localStorage:', error);
            }
        }
        return { mode: 'system', ...defaultTheme };
    });
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
    // Build complete theme configuration
    React.useEffect(() => {
        let complete;
        // If custom theme provided, use it
        if (theme.customTheme) {
            complete = theme.customTheme;
        }
        // If preset specified, load it
        else if (theme.preset) {
            const baseTheme = themes[theme.preset];
            complete = theme.customizations
                ? createTheme(baseTheme, theme.customizations)
                : baseTheme;
        }
        // Otherwise, use default based on resolved mode
        else {
            const defaultPreset = resolvedMode === 'dark' ? 'default-dark' : 'default-light';
            complete = themes[defaultPreset];
            // Apply legacy customizations
            if (theme.primaryColor || theme.radius || theme.fontFamily) {
                const customizations = {};
                if (theme.primaryColor) {
                    customizations.colors = { primary: theme.primaryColor };
                }
                complete = createTheme(complete, customizations);
            }
        }
        setResolvedTheme(complete);
    }, [theme, resolvedMode]);
    // Apply theme to document
    React.useEffect(() => {
        if (!resolvedTheme)
            return;
        const root = document.documentElement;
        const enableTransitions = theme.enableTransitions !== false;
        const transitionDuration = theme.transitionDuration || 200;
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
    }, [resolvedTheme, theme.enableTransitions, theme.transitionDuration]);
    // Save to localStorage
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(storageKey, JSON.stringify(theme));
            }
            catch (error) {
                console.warn('Failed to save theme to localStorage:', error);
            }
        }
    }, [theme, storageKey]);
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
    const availablePresets = React.useMemo(() => Object.keys(themes), []);
    const value = React.useMemo(() => ({
        theme,
        setTheme,
        mode: resolvedMode,
        toggleMode,
        resolvedTheme,
        setPreset,
        availablePresets,
    }), [theme, setTheme, resolvedMode, toggleMode, resolvedTheme, setPreset, availablePresets]);
    return (_jsx(ThemeContext.Provider, { value: value, children: children }));
}
/**
 * useTheme hook - Access theme context
 *
 * @example
 * ```tsx
 * const { mode, toggleMode, theme, setTheme } = useTheme()
 *
 * // Toggle dark mode
 * <button onClick={toggleMode}>
 *   {mode === 'dark' ? '☀️' : '🌙'}
 * </button>
 *
 * // Customize theme
 * <button onClick={() => setTheme({ primaryColor: '#3b82f6' })}>
 *   Set Blue Theme
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
            scale: getMotionSafeValue(prefersReducedMotion, 1.05, 1)
        }, whileTap: {
            scale: getMotionSafeValue(prefersReducedMotion, 0.95, 1)
        }, className: cn('relative inline-flex items-center justify-center gap-2.5 rounded-lg', 'transition-all duration-150 ease-out', 'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-2', 'disabled:opacity-50 disabled:cursor-not-allowed', sizeClasses[size], variantClasses[variant], showLabel && 'px-3.5', className), "aria-label": `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`, type: "button", children: [_jsx(AnimatePresence, { mode: "wait", initial: false, children: _jsxs(motion.div, { initial: {
                        rotate: getMotionSafeValue(prefersReducedMotion, -90, 0),
                        opacity: 0,
                        scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1)
                    }, animate: {
                        rotate: 0,
                        opacity: 1,
                        scale: 1
                    }, exit: {
                        rotate: getMotionSafeValue(prefersReducedMotion, 90, 0),
                        opacity: 0,
                        scale: getMotionSafeValue(prefersReducedMotion, 0.5, 1)
                    }, transition: {
                        duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
                        ease: 'easeOut'
                    }, className: "flex items-center gap-2.5", children: [mode === 'dark' ? (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "5" }), _jsx("path", { d: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })] })) : (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) })), showLabel && (_jsx("span", { className: "text-sm font-semibold", children: mode === 'dark' ? 'Light' : 'Dark' }))] }, mode) }), isTransitioning && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg", children: _jsx(motion.div, { animate: {
                        rotate: prefersReducedMotion ? 0 : 360
                    }, transition: {
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear'
                    }, className: "w-4 h-4 border-2 border-primary border-t-transparent rounded-full" }) }))] }));
}
//# sourceMappingURL=ThemeProvider.js.map