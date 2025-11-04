/**
 * Clarity Chat Design Tokens
 *
 * Centralized design system tokens for consistent theming.
 * All values use CSS custom properties for easy customization.
 */
export declare const designTokens: {
    /**
     * Color palette - All colors support light/dark mode
     */
    readonly colors: {
        readonly background: "hsl(var(--background))";
        readonly foreground: "hsl(var(--foreground))";
        readonly card: "hsl(var(--card))";
        readonly cardForeground: "hsl(var(--card-foreground))";
        readonly popover: "hsl(var(--popover))";
        readonly popoverForeground: "hsl(var(--popover-foreground))";
        readonly primary: "hsl(var(--primary))";
        readonly primaryForeground: "hsl(var(--primary-foreground))";
        readonly secondary: "hsl(var(--secondary))";
        readonly secondaryForeground: "hsl(var(--secondary-foreground))";
        readonly muted: "hsl(var(--muted))";
        readonly mutedForeground: "hsl(var(--muted-foreground))";
        readonly accent: "hsl(var(--accent))";
        readonly accentForeground: "hsl(var(--accent-foreground))";
        readonly destructive: "hsl(var(--destructive))";
        readonly destructiveForeground: "hsl(var(--destructive-foreground))";
        readonly success: "hsl(var(--success))";
        readonly successForeground: "hsl(var(--success-foreground))";
        readonly warning: "hsl(var(--warning))";
        readonly warningForeground: "hsl(var(--warning-foreground))";
        readonly info: "hsl(var(--info))";
        readonly infoForeground: "hsl(var(--info-foreground))";
        readonly border: "hsl(var(--border))";
        readonly input: "hsl(var(--input))";
        readonly ring: "hsl(var(--ring))";
    };
    /**
     * Spacing scale - Consistent spacing throughout
     */
    readonly spacing: {
        readonly 0: "0";
        readonly 1: "0.25rem";
        readonly 2: "0.5rem";
        readonly 3: "0.75rem";
        readonly 4: "1rem";
        readonly 5: "1.25rem";
        readonly 6: "1.5rem";
        readonly 8: "2rem";
        readonly 10: "2.5rem";
        readonly 12: "3rem";
        readonly 16: "4rem";
        readonly 20: "5rem";
        readonly 24: "6rem";
    };
    /**
     * Border radius scale
     */
    readonly radius: {
        readonly none: "0";
        readonly sm: "calc(var(--radius) - 4px)";
        readonly md: "calc(var(--radius) - 2px)";
        readonly lg: "var(--radius)";
        readonly xl: "calc(var(--radius) + 4px)";
        readonly '2xl': "calc(var(--radius) + 8px)";
        readonly full: "9999px";
    };
    /**
     * Typography scale
     */
    readonly typography: {
        readonly fontFamily: {
            readonly sans: "var(--font-sans)";
            readonly mono: "var(--font-mono)";
        };
        readonly fontSize: {
            readonly xs: readonly ["0.75rem", {
                readonly lineHeight: "1rem";
            }];
            readonly sm: readonly ["0.875rem", {
                readonly lineHeight: "1.25rem";
            }];
            readonly base: readonly ["1rem", {
                readonly lineHeight: "1.5rem";
            }];
            readonly lg: readonly ["1.125rem", {
                readonly lineHeight: "1.75rem";
            }];
            readonly xl: readonly ["1.25rem", {
                readonly lineHeight: "1.75rem";
            }];
            readonly '2xl': readonly ["1.5rem", {
                readonly lineHeight: "2rem";
            }];
            readonly '3xl': readonly ["1.875rem", {
                readonly lineHeight: "2.25rem";
            }];
            readonly '4xl': readonly ["2.25rem", {
                readonly lineHeight: "2.5rem";
            }];
        };
        readonly fontWeight: {
            readonly normal: "400";
            readonly medium: "500";
            readonly semibold: "600";
            readonly bold: "700";
        };
    };
    /**
     * Animation timing
     */
    readonly animation: {
        readonly duration: {
            readonly fast: "150ms";
            readonly normal: "250ms";
            readonly slow: "350ms";
            readonly slower: "500ms";
        };
        readonly easing: {
            readonly default: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly in: "cubic-bezier(0.4, 0, 1, 1)";
            readonly out: "cubic-bezier(0, 0, 0.2, 1)";
            readonly inOut: "cubic-bezier(0.4, 0, 0.2, 1)";
            readonly spring: "cubic-bezier(0.34, 1.56, 0.64, 1)";
        };
    };
    /**
     * Shadow scale
     */
    readonly shadows: {
        readonly none: "none";
        readonly sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
        readonly md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
        readonly lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
        readonly xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
        readonly '2xl': "0 25px 50px -12px rgb(0 0 0 / 0.25)";
    };
    /**
     * Z-index scale
     */
    readonly zIndex: {
        readonly base: 0;
        readonly dropdown: 1000;
        readonly sticky: 1020;
        readonly fixed: 1030;
        readonly modalBackdrop: 1040;
        readonly modal: 1050;
        readonly popover: 1060;
        readonly tooltip: 1070;
    };
    /**
     * Breakpoints (mobile-first)
     */
    readonly breakpoints: {
        readonly sm: "640px";
        readonly md: "768px";
        readonly lg: "1024px";
        readonly xl: "1280px";
        readonly '2xl': "1536px";
    };
};
/**
 * Type-safe access to design tokens
 */
export type DesignTokens = typeof designTokens;
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type RadiusToken = keyof typeof designTokens.radius;
export type ShadowToken = keyof typeof designTokens.shadows;
export type ZIndexToken = keyof typeof designTokens.zIndex;
//# sourceMappingURL=design-tokens.d.ts.map