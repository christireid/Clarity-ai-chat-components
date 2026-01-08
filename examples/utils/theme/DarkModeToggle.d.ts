export type ThemeMode = 'light' | 'dark' | 'system';
export interface DarkModeToggleProps {
    className?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    defaultMode?: ThemeMode;
    storageKey?: string;
    onChange?: (mode: ThemeMode, isDark: boolean) => void;
}
export interface UseDarkModeOptions {
    defaultMode?: ThemeMode;
    storageKey?: string;
    onChange?: (isDark: boolean) => void;
}
export interface UseDarkModeReturn {
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
    toggle: () => void;
}
export declare function useDarkMode(options?: UseDarkModeOptions): UseDarkModeReturn;
export declare function DarkModeToggle({ className, showLabel, size, defaultMode, storageKey, onChange, }: DarkModeToggleProps): import("react").JSX.Element;
export interface DarkModeDropdownProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    defaultMode?: ThemeMode;
    storageKey?: string;
    onChange?: (mode: ThemeMode, isDark: boolean) => void;
}
export declare function DarkModeDropdown({ className, size, defaultMode, storageKey, onChange, }: DarkModeDropdownProps): import("react").JSX.Element;
export default DarkModeToggle;
//# sourceMappingURL=DarkModeToggle.d.ts.map