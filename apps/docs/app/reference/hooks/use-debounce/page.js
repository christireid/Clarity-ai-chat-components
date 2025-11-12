import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useDebounce | Clarity Chat',
    description: 'Debounce values and callbacks for performance optimization.'
};
export default function UseDebouncePage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useDebounce" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Debounce values and callbacks to reduce unnecessary function calls and improve performance." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { useDebounce, useDebouncedCallback } from '@clarity-chat/react'

// Debounce value
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  searchAPI(debouncedSearch)
}, [debouncedSearch])

// Debounce callback
const debouncedSave = useDebouncedCallback(
  (value) => saveToAPI(value),
  1000
)

<input onChange={(e) => debouncedSave(e.target.value)} />` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Functions" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "useDebounce(value, delay):" }), " Returns debounced value"] }), _jsxs("li", { children: [_jsx("strong", { children: "useDebouncedCallback(fn, delay):" }), " Returns debounced function"] })] })] })] }));
}
//# sourceMappingURL=page.js.map