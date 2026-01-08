import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Security Examples - Clarity Chat',
    description: 'Security features demo including prompt injection detection, PII redaction, and jailbreak prevention',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { className: "antialiased", children: children }) }));
}
//# sourceMappingURL=layout.js.map