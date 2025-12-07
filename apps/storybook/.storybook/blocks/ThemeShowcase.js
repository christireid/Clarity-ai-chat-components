import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ThemeProvider } from '@clarity-chat/react';
const defaultThemes = ['clarity-light', 'clarity-dark', 'sunset', 'ocean', 'forest'];
export const ThemeShowcase = ({ children, themes = defaultThemes, title = 'Theme Variations' }) => {
    return (_jsxs("div", { className: "my-8 space-y-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: title }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: themes.map((theme) => (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-sm font-semibold capitalize text-gray-700 dark:text-gray-300", children: theme.replace(/-/g, ' ') }), _jsx(ThemeProvider, { defaultTheme: { preset: theme }, children: _jsx("div", { className: "p-6 rounded-xl border-2 border-border bg-background text-foreground shadow-sm", children: children }) })] }, theme))) })] }));
};
//# sourceMappingURL=ThemeShowcase.js.map