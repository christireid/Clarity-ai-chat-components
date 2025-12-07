import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
    title: 'useErrorRecovery | Clarity Chat',
    description: 'Automatic error recovery with retry logic and exponential backoff.'
};
export default function UseErrorRecoveryPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "useErrorRecovery" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "Automatic error recovery with configurable retry logic, exponential backoff, and error classification." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage" }), _jsx("pre", { className: "bg-muted p-4 rounded-lg overflow-x-auto", children: _jsx("code", { children: `import { useErrorRecovery } from '@clarity-chat/react'

const { 
  execute, 
  retry, 
  error, 
  isLoading, 
  canRetry 
} = useErrorRecovery({
  operation: async (id) => fetchData(id),
  maxAttempts: 3,
  backoffMs: [1000, 3000, 10000],
  shouldRetry: (error) => error.message !== 'Unauthorized'
})

// Execute with retry
const loadData = async () => {
  const result = await execute(userId)
  if (result) setData(result)
}

// Manual retry
<button onClick={retry} disabled={!canRetry}>
  Retry ({attemptNumber}/{maxAttempts})
</button>` }) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Error Types" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "network:" }), " Connection errors"] }), _jsxs("li", { children: [_jsx("strong", { children: "ratelimit:" }), " Rate limit errors"] }), _jsxs("li", { children: [_jsx("strong", { children: "server:" }), " 5xx errors"] }), _jsxs("li", { children: [_jsx("strong", { children: "auth:" }), " Authentication errors"] }), _jsxs("li", { children: [_jsx("strong", { children: "unknown:" }), " Other errors"] })] })] })] }));
}
//# sourceMappingURL=page.js.map