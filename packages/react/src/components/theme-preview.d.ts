/**
 * Theme Preview Component
 *
 * Interactive theme preview and live editor
 */
import type { CompleteThemeConfig } from '../theme/theme-config';
import type { ThemePresetName } from '../theme/presets';
export interface ThemePreviewProps {
    /**
     * Show editor controls
     */
    showEditor?: boolean;
    /**
     * Callback when theme changes
     */
    onThemeChange?: (theme: CompleteThemeConfig) => void;
    /**
     * Custom className
     */
    className?: string;
}
/**
 * Theme Preview Component
 *
 * Shows live preview of theme with editable colors
 *
 * @example
 * ```tsx
 * <ThemePreview
 *   showEditor
 *   onThemeChange={theme => console.log('Theme changed:', theme)}
 * />
 * ```
 */
export declare function ThemePreview({ showEditor, onThemeChange, className, }: ThemePreviewProps): import("react/jsx-runtime").JSX.Element | null;
/**
 * Theme Comparison Component
 *
 * Compare two themes side by side
 */
export interface ThemeComparisonProps {
    theme1: ThemePresetName;
    theme2: ThemePresetName;
    className?: string;
}
export declare function ThemeComparison({ theme1, theme2, className }: ThemeComparisonProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=theme-preview.d.ts.map