import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'Theme Selector Component | Clarity Chat',
    description: 'UI component for selecting and switching between theme presets with visual previews.',
};
export default function ThemeSelectorPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Theme Selector" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "A flexible theme selection component with visual previews, available in list and dropdown variants." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Overview" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Theme Selector component provides an intuitive interface for choosing between built-in theme presets. It features visual color previews, horizontal/vertical layouts, keyboard navigation, and active theme indication." }), _jsx("h3", { className: "text-xl font-semibold mb-3 mt-6", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Visual theme preview with primary, secondary, and background colors" }), _jsx("li", { children: "Horizontal or vertical layout orientations" }), _jsx("li", { children: "Dropdown variant for compact spaces" }), _jsx("li", { children: "Active theme highlighting with checkmark" }), _jsx("li", { children: "Keyboard navigation support with ARIA radiogroup" }), _jsx("li", { children: "Theme metadata display (name, description)" }), _jsx("li", { children: "Callback for theme change events" }), _jsx("li", { children: "Integration with ThemeProvider context" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { ThemeSelector, ThemeSelectorDropdown } from '@clarity-chat/react'

// List layout
<ThemeSelector 
  showPreview
  orientation="vertical"
  onThemeChange={(theme) => console.log(theme)}
/>

// Dropdown variant
<ThemeSelectorDropdown 
  onThemeChange={(theme) => console.log(theme)}
/>` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Default" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "showPreview" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "boolean" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "true" }), _jsx("td", { className: "p-2", children: "Show color preview circles" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "orientation" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "'horizontal' | 'vertical'" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "'vertical'" }), _jsx("td", { className: "p-2", children: "Layout direction" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onThemeChange" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "(theme) => void" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "undefined" }), _jsx("td", { className: "p-2", children: "Theme change callback" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "''" }), _jsx("td", { className: "p-2", children: "Additional CSS classes" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Examples" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `// Settings page
function ThemeSettings() {
  return (
    <div>
      <h3>Choose Theme</h3>
      <ThemeSelector 
        showPreview
        orientation="vertical"
        onThemeChange={(theme) => {
          localStorage.setItem('preferred-theme', theme)
        }}
      />
    </div>
  )
}

// Header dropdown
function Header() {
  return (
    <header>
      <ThemeSelectorDropdown />
    </header>
  )
}` }) }) })] })] }));
}
//# sourceMappingURL=page.js.map