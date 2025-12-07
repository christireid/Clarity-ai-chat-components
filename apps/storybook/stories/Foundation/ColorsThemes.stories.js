import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeProvider, getAllThemes } from '@clarity-chat/react';
import { StatusBadge, FeatureGrid, ThemeShowcase } from '../../.storybook/blocks';
const meta = {
    title: 'Foundation/Colors & Themes',
    parameters: {
        docs: {
            description: {
                component: `
# Colors & Themes

Clarity Chat provides a comprehensive color system and theming architecture that makes it easy to create beautiful, consistent interfaces.

## Design Philosophy

- **Semantic Color Names** - Colors have meaning (brand, success, warning, error)
- **Automatic Dark Mode** - Every theme includes dark mode variants
- **Accessible Contrast** - All color combinations meet WCAG AA standards
- **11+ Pre-built Themes** - Start with beautiful defaults
- **Fully Customizable** - Create your own themes with ease

## Color Palette

Our color system is built on a consistent scale from 50 (lightest) to 950 (darkest), ensuring visual harmony across all themes.
        `,
            },
        },
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;
// Color swatch component
const ColorSwatch = ({ name, value, description }) => (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("div", { className: "w-full h-24 rounded-lg border-2 border-border shadow-sm", style: { backgroundColor: value }, title: `${name}: ${value}` }), _jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-semibold", children: name }), _jsx("div", { className: "text-xs font-mono text-gray-500", children: value }), description && _jsx("div", { className: "text-xs text-gray-600 mt-1", children: description })] })] }));
// Theme preview component
const ThemePreview = ({ themeName }) => (_jsx(ThemeProvider, { defaultTheme: { preset: themeName }, children: _jsxs("div", { className: "p-6 rounded-xl border-2 border-border bg-background text-foreground space-y-4", children: [_jsx("h4", { className: "font-semibold capitalize", children: themeName.replace(/-/g, ' ') }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors", children: "Primary" }), _jsx("button", { className: "px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors", children: "Secondary" })] }), _jsx("div", { className: "p-4 rounded-lg bg-muted border border-border", children: _jsx("p", { className: "text-sm", children: "Sample text in this theme showing foreground and background colors." }) })] }) }));
export const BrandColors = {
    render: () => (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Brand Colors" }), _jsx(StatusBadge, { status: "stable" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Primary brand colors used throughout the interface for CTAs, links, and brand identity." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6", children: [_jsx(ColorSwatch, { name: "brand-50", value: "#eff6ff", description: "Lightest brand" }), _jsx(ColorSwatch, { name: "brand-100", value: "#dbeafe" }), _jsx(ColorSwatch, { name: "brand-200", value: "#bfdbfe" }), _jsx(ColorSwatch, { name: "brand-300", value: "#93c5fd" }), _jsx(ColorSwatch, { name: "brand-400", value: "#60a5fa" }), _jsx(ColorSwatch, { name: "brand-500", value: "#3b82f6", description: "Primary brand" }), _jsx(ColorSwatch, { name: "brand-600", value: "#2563eb" }), _jsx(ColorSwatch, { name: "brand-700", value: "#1d4ed8" }), _jsx(ColorSwatch, { name: "brand-800", value: "#1e40af" }), _jsx(ColorSwatch, { name: "brand-900", value: "#1e3a8a" }), _jsx(ColorSwatch, { name: "brand-950", value: "#172554", description: "Darkest brand" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'The brand color scale from 50 (lightest) to 950 (darkest). Use brand-500 for primary actions.',
            },
        },
    },
};
export const SemanticColors = {
    render: () => (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Semantic Colors" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Colors with specific meanings for success, warning, error, and informational states." })] }), _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\u0013" }), " Success"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4", children: [_jsx(ColorSwatch, { name: "green-50", value: "#f0fdf4" }), _jsx(ColorSwatch, { name: "green-100", value: "#dcfce7" }), _jsx(ColorSwatch, { name: "green-500", value: "#10b981", description: "Primary success" }), _jsx(ColorSwatch, { name: "green-700", value: "#15803d" }), _jsx(ColorSwatch, { name: "green-900", value: "#14532d" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\u26A0\uFE0F" }), " Warning"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4", children: [_jsx(ColorSwatch, { name: "yellow-50", value: "#fefce8" }), _jsx(ColorSwatch, { name: "yellow-100", value: "#fef9c3" }), _jsx(ColorSwatch, { name: "yellow-500", value: "#f59e0b", description: "Primary warning" }), _jsx(ColorSwatch, { name: "yellow-700", value: "#a16207" }), _jsx(ColorSwatch, { name: "yellow-900", value: "#713f12" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\u0015" }), " Error"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4", children: [_jsx(ColorSwatch, { name: "red-50", value: "#fef2f2" }), _jsx(ColorSwatch, { name: "red-100", value: "#fee2e2" }), _jsx(ColorSwatch, { name: "red-500", value: "#ef4444", description: "Primary error" }), _jsx(ColorSwatch, { name: "red-700", value: "#b91c1c" }), _jsx(ColorSwatch, { name: "red-900", value: "#7f1d1d" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold mb-4 flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\u2139\uFE0F" }), " Info"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4", children: [_jsx(ColorSwatch, { name: "blue-50", value: "#eff6ff" }), _jsx(ColorSwatch, { name: "blue-100", value: "#dbeafe" }), _jsx(ColorSwatch, { name: "blue-500", value: "#3b82f6", description: "Primary info" }), _jsx(ColorSwatch, { name: "blue-700", value: "#1d4ed8" }), _jsx(ColorSwatch, { name: "blue-900", value: "#1e3a8a" })] })] })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Semantic colors convey meaning and state. Always use the appropriate semantic color for feedback.',
            },
        },
    },
};
export const NeutralColors = {
    render: () => (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Neutral Colors" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Grayscale colors for text, borders, backgrounds, and subtle UI elements." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6", children: [_jsx(ColorSwatch, { name: "gray-50", value: "#f9fafb", description: "Lightest bg" }), _jsx(ColorSwatch, { name: "gray-100", value: "#f3f4f6" }), _jsx(ColorSwatch, { name: "gray-200", value: "#e5e7eb", description: "Borders" }), _jsx(ColorSwatch, { name: "gray-300", value: "#d1d5db" }), _jsx(ColorSwatch, { name: "gray-400", value: "#9ca3af" }), _jsx(ColorSwatch, { name: "gray-500", value: "#6b7280", description: "Secondary text" }), _jsx(ColorSwatch, { name: "gray-600", value: "#4b5563" }), _jsx(ColorSwatch, { name: "gray-700", value: "#374151" }), _jsx(ColorSwatch, { name: "gray-800", value: "#1f2937" }), _jsx(ColorSwatch, { name: "gray-900", value: "#111827", description: "Primary text" }), _jsx(ColorSwatch, { name: "gray-950", value: "#030712", description: "Darkest bg" })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Neutral grayscale colors for text, borders, and backgrounds. Use responsibly for visual hierarchy.',
            },
        },
    },
};
export const AllThemes = {
    render: () => {
        const themes = getAllThemes();
        return (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "All Themes" }), _jsx(StatusBadge, { status: "stable" })] }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: ["Clarity Chat includes ", themes.length, " professionally designed themes. Each theme includes both light and dark mode variants."] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: themes.map((theme) => (_jsx(ThemePreview, { themeName: theme.name }, theme.name))) })] }));
    },
    parameters: {
        docs: {
            description: {
                story: 'All available theme presets. Click on any theme in the toolbar to preview it live.',
            },
        },
    },
};
export const ThemeComparison = {
    render: () => (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Theme Comparison" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "See how a component looks across different themes. Perfect for testing your custom components." })] }), _jsx(ThemeShowcase, { themes: ['clarity-light', 'clarity-dark', 'sunset', 'ocean', 'forest'], children: _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "text-lg font-semibold", children: "Sample Component" }), _jsx("p", { className: "text-sm", children: "This is how text appears in this theme, with proper foreground and background contrast." }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "px-4 py-2 rounded-lg bg-brand-500 text-white font-medium", children: "Primary Button" }), _jsx("button", { className: "px-4 py-2 rounded-lg border-2 border-border font-medium", children: "Secondary" })] })] }) })] })),
    parameters: {
        docs: {
            description: {
                story: 'Compare how components look across different themes side-by-side.',
            },
        },
    },
};
export const CustomTheme = {
    render: () => (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Custom Themes" }), _jsx(StatusBadge, { status: "stable" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Create your own theme by providing a custom theme object to ThemeProvider." })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Example: Custom Theme" }), _jsx("pre", { className: "bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto", children: _jsx("code", { children: `import { ThemeProvider } from '@clarity-chat/react'

const myCustomTheme = {
  colors: {
    brand: {
      50: '#fff1f2',
      100: '#ffe4e6',
      // ... your custom colors
      500: '#f43f5e', // Your primary brand color
      // ... rest of scale
    },
    // ... other color overrides
  },
  // ... spacing, typography, etc.
}

function App() {
  return (
    <ThemeProvider theme={myCustomTheme}>
      <YourApp />
    </ThemeProvider>
  )
}` }) })] }), _jsxs("div", { className: "callout callout-info", children: [_jsx("p", { className: "font-semibold mb-2", children: "\uD83D\uDCA1 Pro Tip" }), _jsx("p", { className: "text-sm", children: "You can also extend an existing theme by merging your custom values with a preset theme. This way, you only need to override the values you want to change." })] })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Learn how to create custom themes for your specific brand requirements.',
            },
        },
    },
};
export const DarkMode = {
    render: () => (_jsxs("div", { className: "p-8 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Dark Mode Support" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Every theme includes carefully crafted dark mode variants. Toggle dark mode using the toolbar above." })] }), _jsx(FeatureGrid, { features: [
                    {
                        title: 'Automatic Contrast',
                        description: 'Colors automatically adjust for proper contrast in dark mode.',
                        icon: _jsx("span", { className: "text-2xl", children: "\uD83C\uDF13\u0013" }),
                    },
                    {
                        title: 'System Preference',
                        description: 'Respects user system preferences by default.',
                        icon: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCBB" }),
                    },
                    {
                        title: 'Manual Override',
                        description: 'Users can manually toggle light/dark mode.',
                        icon: _jsx("span", { className: "text-2xl", children: "\uD83D\uDD06" }),
                    },
                    {
                        title: 'Persistent',
                        description: 'Mode preference is saved in localStorage.',
                        icon: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCBE" }),
                    },
                ] }), _jsxs("div", { className: "mt-8", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Usage" }), _jsx("pre", { className: "bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto", children: _jsx("code", { children: `import { ThemeProvider } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system' }}>
      {/* Your app */}
    </ThemeProvider>
  )
}

// Options: 'light' | 'dark' | 'system'` }) })] })] })),
    parameters: {
        docs: {
            description: {
                story: 'Dark mode is fully supported with automatic color adjustments for accessibility.',
            },
        },
    },
};
//# sourceMappingURL=ColorsThemes.stories.js.map