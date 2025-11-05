/**
 * Theme Selector Component
 *
 * UI component for selecting and switching between theme presets
 */
import type { ThemePresetName } from '../theme/presets';
export interface ThemeSelectorProps {
    /**
     * Show theme preview colors
     */
    showPreview?: boolean;
    /**
     * Layout orientation
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * Custom className
     */
    className?: string;
    /**
     * Callback when theme changes
     */
    onThemeChange?: (theme: ThemePresetName) => void;
}
/**
 * Theme Selector - Choose from built-in theme presets
 *
 * Features:
 * - Visual theme preview
 * - Horizontal or vertical layout
 * - Keyboard navigation
 * - Active theme indication
 *
 * @example
 * ```tsx
 * <ThemeSelector
 *   showPreview
 *   orientation="vertical"
 *   onThemeChange={(theme) => console.log('Theme changed:', theme)}
 * />
 * ```
 */
export declare function ThemeSelector({ showPreview, orientation, className, onThemeChange, }: ThemeSelectorProps): import("react/jsx-runtime").JSX.Element;
/**
 * Theme Selector Dropdown - Compact theme selector
 */
export interface ThemeSelectorDropdownProps {
    className?: string;
    onThemeChange?: (theme: ThemePresetName) => void;
}
export declare function ThemeSelectorDropdown({ className, onThemeChange, }: ThemeSelectorDropdownProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=theme-selector.d.ts.map