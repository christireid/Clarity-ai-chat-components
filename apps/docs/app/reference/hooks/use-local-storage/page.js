import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useLocalStorage | Clarity Chat',
    description: 'Persist state to localStorage with automatic serialization.'
};
export default function UseLocalStoragePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useLocalStorage" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Persist state to localStorage with automatic serialization and cross-tab synchronization." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { useLocalStorage } from '@clarity-chat/react'

const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
const [user, setUser] = useLocalStorage('user', null)

<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  Toggle theme
</button>` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Automatic JSON serialization" }), _jsx("li", { children: "Cross-tab synchronization" }), _jsx("li", { children: "SSR-safe (works with Next.js)" }), _jsx("li", { children: "Custom serializers supported" }), _jsx("li", { children: "Remove function included" })] })] })] }));
}
//# sourceMappingURL=page.js.map