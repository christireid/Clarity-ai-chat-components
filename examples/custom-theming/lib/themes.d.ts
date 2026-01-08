/**
 * Theme definitions for Clarity Chat
 *
 * Each theme defines CSS custom properties that control
 * the visual appearance of chat components.
 */
export interface Theme {
    id: string;
    name: string;
    description: string;
    mode: 'light' | 'dark';
    colors: {
        background: string;
        foreground: string;
        card: string;
        cardForeground: string;
        primary: string;
        primaryForeground: string;
        secondary: string;
        secondaryForeground: string;
        muted: string;
        mutedForeground: string;
        accent: string;
        accentForeground: string;
        border: string;
        input: string;
        ring: string;
        userBubble: string;
        userBubbleForeground: string;
        assistantBubble: string;
        assistantBubbleForeground: string;
    };
    radius: string;
}
export declare const THEMES: Theme[];
export declare function getThemeById(id: string): Theme | undefined;
export declare function applyTheme(theme: Theme): void;
export declare function generateCSSVariables(theme: Theme): string;
//# sourceMappingURL=themes.d.ts.map