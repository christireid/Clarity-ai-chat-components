import * as React from 'react';
export type Theme = 'light' | 'dark' | 'system';
export interface ThemeSwitcherPreview {
    name: Theme;
    label: string;
    icon: React.ReactNode;
    colors: {
        background: string;
        foreground: string;
        primary: string;
        secondary: string;
        accent: string;
    };
}
export interface ThemeSwitcherProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
    showPreview?: boolean;
    compact?: boolean;
    className?: string;
}
export declare const ThemeSwitcher: React.ForwardRefExoticComponent<ThemeSwitcherProps & React.RefAttributes<HTMLDivElement>>;
export declare const useSimpleTheme: () => {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};
//# sourceMappingURL=theme-switcher.d.ts.map