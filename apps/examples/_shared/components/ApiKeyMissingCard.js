import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const providerConfig = {
    OpenAI: {
        envVar: 'OPENAI_API_KEY',
        url: 'https://platform.openai.com/api-keys',
        placeholder: 'sk-...',
    },
    Anthropic: {
        envVar: 'ANTHROPIC_API_KEY',
        url: 'https://console.anthropic.com/settings/keys',
        placeholder: 'sk-ant-...',
    },
    Google: {
        envVar: 'GOOGLE_API_KEY',
        url: 'https://aistudio.google.com/app/apikey',
        placeholder: 'AIza...',
    },
};
export function ApiKeyMissingCard({ provider, envVarName, getKeyUrl, }) {
    const config = providerConfig[provider] || {
        envVar: envVarName || `${provider.toUpperCase()}_API_KEY`,
        url: getKeyUrl || '#',
        placeholder: 'your-api-key-here',
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center text-3xl", children: "\u26A0\uFE0F" }), _jsx("h1", { className: "text-xl font-bold text-slate-900 mb-2", children: "API Key Required" }), _jsxs("p", { className: "text-slate-600 mb-6", children: ["This demo requires a ", _jsx("strong", { children: provider }), " API key to function."] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-4 mb-6 text-left", children: [_jsxs("p", { className: "text-sm font-mono mb-2", children: ["1. Create a", ' ', _jsx("code", { className: "bg-slate-200 px-1.5 py-0.5 rounded", children: ".env.local" }), ' ', "file"] }), _jsxs("p", { className: "text-sm font-mono", children: ["2. Add:", ' ', _jsxs("code", { className: "bg-slate-200 px-1.5 py-0.5 rounded", children: [config.envVar, "=", config.placeholder] })] })] }), _jsxs("a", { href: config.url, target: "_blank", rel: "noopener noreferrer", className: "block w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors", children: ["Get ", provider, " API Key \u2192"] })] }) }));
}
export default ApiKeyMissingCard;
//# sourceMappingURL=ApiKeyMissingCard.js.map