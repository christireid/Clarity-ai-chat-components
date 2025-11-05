import * as React from 'react';
import { type ThemePresetName } from './presets';
import type { CompleteThemeConfig, PartialThemeConfig } from './theme-config';
export type ThemeMode = 'light' | 'dark' | 'system';
export interface ThemeConfig {
    mode: ThemeMode;
    preset?: ThemePresetName;
    customTheme?: CompleteThemeConfig;
    customizations?: PartialThemeConfig;
    primaryColor?: string;
    radius?: number;
    fontFamily?: string;
    enableTransitions?: boolean;
    transitionDuration?: number;
}
interface ThemeContextValue {
    theme: ThemeConfig;
    setTheme: (theme: Partial<ThemeConfig>) => void;
    mode: 'light' | 'dark';
    toggleMode: () => void;
    resolvedTheme: CompleteThemeConfig | null;
    setPreset: (preset: ThemePresetName) => void;
    availablePresets: ThemePresetName[];
}
export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Partial<ThemeConfig>;
    storageKey?: string;
}
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
export declare function ThemeProvider({ children, defaultTheme, storageKey, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
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
export declare function useTheme(): ThemeContextValue;
/**
 * ThemeToggle - Pre-built theme toggle button
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export declare function ThemeToggle({ className }: {
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map