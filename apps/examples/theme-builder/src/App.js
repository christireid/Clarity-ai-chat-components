import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Theme Builder
 *
 * Interactive tool for customizing the design system theme
 */
import { useState } from 'react';
import { Button, Card, Input } from '@clarity-chat/primitives';
const defaultTheme = {
    colors: {
        primary: '221.2 83.2% 53.3%',
        secondary: '210 40% 96.1%',
        background: '0 0% 100%',
        foreground: '222.2 84% 4.9%',
        border: '214.3 31.8% 91.4%',
    },
    radius: '0.5rem',
    shadows: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
};
const presets = {
    default: defaultTheme,
    ocean: {
        ...defaultTheme,
        colors: {
            primary: '199 89% 48%',
            secondary: '195 53% 79%',
            background: '0 0% 100%',
            foreground: '199 18% 20%',
            border: '195 20% 85%',
        },
    },
    forest: {
        ...defaultTheme,
        colors: {
            primary: '142 76% 36%',
            secondary: '142 30% 85%',
            background: '0 0% 100%',
            foreground: '142 20% 15%',
            border: '142 15% 80%',
        },
    },
    sunset: {
        ...defaultTheme,
        colors: {
            primary: '14 100% 57%',
            secondary: '14 100% 92%',
            background: '0 0% 100%',
            foreground: '14 20% 15%',
            border: '14 30% 85%',
        },
    },
};
export default function App() {
    const [theme, setTheme] = useState(defaultTheme);
    const [activeColorPicker, setActiveColorPicker] = useState(null);
    const updateColor = (key, value) => {
        setTheme(prev => ({
            ...prev,
            colors: {
                ...prev.colors,
                [key]: value,
            },
        }));
    };
    const applyTheme = () => {
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.colors.primary);
        root.style.setProperty('--secondary', theme.colors.secondary);
        root.style.setProperty('--background', theme.colors.background);
        root.style.setProperty('--foreground', theme.colors.foreground);
        root.style.setProperty('--border', theme.colors.border);
        root.style.setProperty('--radius', theme.radius);
    };
    const exportTheme = () => {
        const css = `:root {
  --primary: ${theme.colors.primary};
  --secondary: ${theme.colors.secondary};
  --background: ${theme.colors.background};
  --foreground: ${theme.colors.foreground};
  --border: ${theme.colors.border};
  --radius: ${theme.radius};
}`;
        navigator.clipboard.writeText(css);
        alert('Theme CSS copied to clipboard!');
    };
    const loadPreset = (presetName) => {
        setTheme(presets[presetName]);
        setTimeout(() => applyTheme(), 100);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("header", { className: "border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10", children: _jsxs("div", { className: "container mx-auto px-4 py-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Theme Builder" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Customize your design system theme" })] }) }), _jsx("div", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "grid grid-cols-12 gap-8", children: [_jsx("aside", { className: "col-span-12 lg:col-span-4", children: _jsxs("div", { className: "space-y-6 sticky top-24", children: [_jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Theme Presets" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.keys(presets).map((preset) => (_jsx(Button, { variant: "outline", size: "sm", onClick: () => loadPreset(preset), className: "capitalize", children: preset }, preset))) })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Colors" }), _jsx("div", { className: "space-y-4", children: Object.entries(theme.colors).map(([key, value]) => (_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium capitalize", children: key }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: value, onChange: (e) => updateColor(key, e.target.value), className: "font-mono text-xs" }), _jsx("button", { onClick: () => setActiveColorPicker(activeColorPicker === key ? null : key), className: "w-10 h-10 rounded-md ring-1 ring-border/50 shadow-xs", style: { backgroundColor: `hsl(${value})` } })] })] }, key))) })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Border Radius" }), _jsx(Input, { value: theme.radius, onChange: (e) => setTheme(prev => ({ ...prev, radius: e.target.value })), placeholder: "0.5rem" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: applyTheme, className: "flex-1", children: "Apply Theme" }), _jsx(Button, { onClick: exportTheme, variant: "outline", className: "flex-1", children: "Export" })] })] }) }), _jsx("main", { className: "col-span-12 lg:col-span-8", children: _jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Component Preview" }), _jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "See how your theme looks across different components" })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-medium mb-4", children: "Buttons" }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx(Button, { children: "Primary" }), _jsx(Button, { variant: "secondary", children: "Secondary" }), _jsx(Button, { variant: "outline", children: "Outline" }), _jsx(Button, { variant: "ghost", children: "Ghost" }), _jsx(Button, { variant: "destructive", children: "Destructive" })] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-medium mb-4", children: "Form Elements" }), _jsxs("div", { className: "space-y-4 max-w-md", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Input Field" }), _jsx(Input, { placeholder: "Enter text..." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Focused Input" }), _jsx(Input, { placeholder: "Focused state", className: "ring-[3px] ring-ring/50" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium mb-4", children: "Cards" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Card, { className: "p-6", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Default Card" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "A basic card with default styling" })] }), _jsxs(Card, { className: "p-6 ring-2 ring-primary/50", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Selected Card" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "With ring-2 ring-primary/50" })] }), _jsxs(Card, { className: "p-6 cursor-pointer hover:shadow-sm hover:-translate-y-[2px] transition-all duration-200", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Hover Card" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Interactive with hover effect" })] })] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-medium mb-4", children: "Typography" }), _jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-4xl font-bold", children: "Heading 1" }), _jsx("h2", { className: "text-3xl font-bold", children: "Heading 2" }), _jsx("h3", { className: "text-2xl font-bold", children: "Heading 3" }), _jsx("h4", { className: "text-xl font-semibold", children: "Heading 4" }), _jsx("p", { className: "text-base", children: "Body text - Regular paragraph" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Small text - Muted foreground" })] })] }), _jsxs(Card, { className: "p-6", children: [_jsx("h3", { className: "font-medium mb-4", children: "Status Colors" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "p-3 rounded-md bg-primary/10 text-primary ring-1 ring-primary/20", children: "Primary status message" }), _jsx("div", { className: "p-3 rounded-md bg-green-500/10 text-green-600 ring-1 ring-green-500/20", children: "Success status message" }), _jsx("div", { className: "p-3 rounded-md bg-yellow-500/10 text-yellow-600 ring-1 ring-yellow-500/20", children: "Warning status message" }), _jsx("div", { className: "p-3 rounded-md bg-destructive/10 text-destructive ring-1 ring-destructive/20", children: "Error status message" })] })] })] }) })] }) })] }));
}
//# sourceMappingURL=App.js.map