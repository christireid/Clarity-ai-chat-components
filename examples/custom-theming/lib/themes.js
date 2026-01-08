/**
 * Theme definitions for Clarity Chat
 *
 * Each theme defines CSS custom properties that control
 * the visual appearance of chat components.
 */
export const THEMES = [
    // Light themes
    {
        id: 'default-light',
        name: 'Default Light',
        description: 'Clean and professional',
        mode: 'light',
        colors: {
            background: '0 0% 100%',
            foreground: '222.2 84% 4.9%',
            card: '0 0% 100%',
            cardForeground: '222.2 84% 4.9%',
            primary: '222.2 47.4% 11.2%',
            primaryForeground: '210 40% 98%',
            secondary: '210 40% 96.1%',
            secondaryForeground: '222.2 47.4% 11.2%',
            muted: '210 40% 96.1%',
            mutedForeground: '215.4 16.3% 46.9%',
            accent: '210 40% 96.1%',
            accentForeground: '222.2 47.4% 11.2%',
            border: '214.3 31.8% 91.4%',
            input: '214.3 31.8% 91.4%',
            ring: '222.2 84% 4.9%',
            userBubble: '222.2 47.4% 11.2%',
            userBubbleForeground: '210 40% 98%',
            assistantBubble: '210 40% 96.1%',
            assistantBubbleForeground: '222.2 84% 4.9%',
        },
        radius: '0.5rem',
    },
    {
        id: 'ocean-light',
        name: 'Ocean',
        description: 'Calm blue tones',
        mode: 'light',
        colors: {
            background: '200 20% 98%',
            foreground: '200 50% 10%',
            card: '0 0% 100%',
            cardForeground: '200 50% 10%',
            primary: '200 100% 40%',
            primaryForeground: '0 0% 100%',
            secondary: '200 30% 94%',
            secondaryForeground: '200 50% 10%',
            muted: '200 20% 94%',
            mutedForeground: '200 20% 40%',
            accent: '180 60% 45%',
            accentForeground: '0 0% 100%',
            border: '200 20% 88%',
            input: '200 20% 88%',
            ring: '200 100% 40%',
            userBubble: '200 100% 40%',
            userBubbleForeground: '0 0% 100%',
            assistantBubble: '200 30% 94%',
            assistantBubbleForeground: '200 50% 10%',
        },
        radius: '1rem',
    },
    {
        id: 'forest-light',
        name: 'Forest',
        description: 'Natural green palette',
        mode: 'light',
        colors: {
            background: '120 20% 97%',
            foreground: '120 30% 10%',
            card: '0 0% 100%',
            cardForeground: '120 30% 10%',
            primary: '142 76% 36%',
            primaryForeground: '0 0% 100%',
            secondary: '120 20% 92%',
            secondaryForeground: '120 30% 10%',
            muted: '120 15% 92%',
            mutedForeground: '120 10% 40%',
            accent: '142 60% 40%',
            accentForeground: '0 0% 100%',
            border: '120 15% 85%',
            input: '120 15% 85%',
            ring: '142 76% 36%',
            userBubble: '142 76% 36%',
            userBubbleForeground: '0 0% 100%',
            assistantBubble: '120 20% 92%',
            assistantBubbleForeground: '120 30% 10%',
        },
        radius: '0.75rem',
    },
    {
        id: 'rose-light',
        name: 'Rose',
        description: 'Warm pink accents',
        mode: 'light',
        colors: {
            background: '350 20% 98%',
            foreground: '350 30% 10%',
            card: '0 0% 100%',
            cardForeground: '350 30% 10%',
            primary: '350 80% 50%',
            primaryForeground: '0 0% 100%',
            secondary: '350 30% 94%',
            secondaryForeground: '350 30% 10%',
            muted: '350 20% 94%',
            mutedForeground: '350 15% 40%',
            accent: '350 70% 55%',
            accentForeground: '0 0% 100%',
            border: '350 20% 88%',
            input: '350 20% 88%',
            ring: '350 80% 50%',
            userBubble: '350 80% 50%',
            userBubbleForeground: '0 0% 100%',
            assistantBubble: '350 30% 94%',
            assistantBubbleForeground: '350 30% 10%',
        },
        radius: '1.5rem',
    },
    // Dark themes
    {
        id: 'default-dark',
        name: 'Default Dark',
        description: 'Modern dark mode',
        mode: 'dark',
        colors: {
            background: '222.2 84% 4.9%',
            foreground: '210 40% 98%',
            card: '222.2 84% 4.9%',
            cardForeground: '210 40% 98%',
            primary: '210 40% 98%',
            primaryForeground: '222.2 47.4% 11.2%',
            secondary: '217.2 32.6% 17.5%',
            secondaryForeground: '210 40% 98%',
            muted: '217.2 32.6% 17.5%',
            mutedForeground: '215 20.2% 65.1%',
            accent: '217.2 32.6% 17.5%',
            accentForeground: '210 40% 98%',
            border: '217.2 32.6% 17.5%',
            input: '217.2 32.6% 17.5%',
            ring: '212.7 26.8% 83.9%',
            userBubble: '210 40% 98%',
            userBubbleForeground: '222.2 47.4% 11.2%',
            assistantBubble: '217.2 32.6% 17.5%',
            assistantBubbleForeground: '210 40% 98%',
        },
        radius: '0.5rem',
    },
    {
        id: 'midnight',
        name: 'Midnight',
        description: 'Deep blue darkness',
        mode: 'dark',
        colors: {
            background: '230 35% 7%',
            foreground: '210 40% 98%',
            card: '230 30% 10%',
            cardForeground: '210 40% 98%',
            primary: '210 100% 60%',
            primaryForeground: '230 35% 7%',
            secondary: '230 25% 15%',
            secondaryForeground: '210 40% 98%',
            muted: '230 25% 15%',
            mutedForeground: '210 20% 60%',
            accent: '200 100% 50%',
            accentForeground: '230 35% 7%',
            border: '230 25% 18%',
            input: '230 25% 18%',
            ring: '210 100% 60%',
            userBubble: '210 100% 60%',
            userBubbleForeground: '230 35% 7%',
            assistantBubble: '230 25% 15%',
            assistantBubbleForeground: '210 40% 98%',
        },
        radius: '0.75rem',
    },
    {
        id: 'emerald-dark',
        name: 'Emerald',
        description: 'Rich green on dark',
        mode: 'dark',
        colors: {
            background: '0 0% 3.9%',
            foreground: '0 0% 98%',
            card: '0 0% 6%',
            cardForeground: '0 0% 98%',
            primary: '142 76% 36%',
            primaryForeground: '0 0% 98%',
            secondary: '0 0% 14.9%',
            secondaryForeground: '0 0% 98%',
            muted: '0 0% 14.9%',
            mutedForeground: '0 0% 63.9%',
            accent: '142 50% 30%',
            accentForeground: '0 0% 98%',
            border: '0 0% 14.9%',
            input: '0 0% 14.9%',
            ring: '142 76% 36%',
            userBubble: '142 76% 36%',
            userBubbleForeground: '0 0% 98%',
            assistantBubble: '0 0% 14.9%',
            assistantBubbleForeground: '0 0% 98%',
        },
        radius: '0.75rem',
    },
    {
        id: 'purple-haze',
        name: 'Purple Haze',
        description: 'Vibrant purple tones',
        mode: 'dark',
        colors: {
            background: '270 30% 6%',
            foreground: '270 20% 95%',
            card: '270 25% 10%',
            cardForeground: '270 20% 95%',
            primary: '270 80% 60%',
            primaryForeground: '0 0% 100%',
            secondary: '270 20% 15%',
            secondaryForeground: '270 20% 95%',
            muted: '270 20% 15%',
            mutedForeground: '270 15% 55%',
            accent: '280 70% 55%',
            accentForeground: '0 0% 100%',
            border: '270 20% 18%',
            input: '270 20% 18%',
            ring: '270 80% 60%',
            userBubble: '270 80% 60%',
            userBubbleForeground: '0 0% 100%',
            assistantBubble: '270 20% 15%',
            assistantBubbleForeground: '270 20% 95%',
        },
        radius: '1rem',
    },
];
export function getThemeById(id) {
    return THEMES.find((t) => t.id === id);
}
export function applyTheme(theme) {
    const root = document.documentElement;
    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
    });
    // Apply radius
    root.style.setProperty('--radius', theme.radius);
    // Apply dark mode class
    if (theme.mode === 'dark') {
        root.classList.add('dark');
    }
    else {
        root.classList.remove('dark');
    }
}
export function generateCSSVariables(theme) {
    const lines = Object.entries(theme.colors).map(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        return `  ${cssVar}: ${value};`;
    });
    lines.push(`  --radius: ${theme.radius};`);
    return `:root {\n${lines.join('\n')}\n}`;
}
//# sourceMappingURL=themes.js.map