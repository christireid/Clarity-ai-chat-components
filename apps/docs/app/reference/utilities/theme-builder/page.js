import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Theme Builder | Clarity Chat',
    description: 'Utility functions for creating, validating, and managing themes.'
};
export default function ThemeBuilderPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Theme Builder" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Powerful theme creation and management utilities with color manipulation and validation." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Theme creation from base colors" }), _jsx("li", { children: "Color contrast validation (WCAG compliance)" }), _jsx("li", { children: "HSL/Hex color conversion" }), _jsx("li", { children: "Theme preset management" }), _jsx("li", { children: "Dark mode generation from light themes" }), _jsx("li", { children: "Export/import theme configurations" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { 
  createTheme, 
  validateTheme, 
  hexToHsl 
} from '@clarity-chat/react/theme'

const theme = createTheme({
  primary: '#3b82f6',
  background: '#ffffff'
})

const validation = validateTheme(theme)
if (validation.valid) {
  console.log('Theme is valid!')
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map