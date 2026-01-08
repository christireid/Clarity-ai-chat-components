import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Advanced Features - Clarity Chat',
    description: 'Advanced AI chat features including enhanced suggestions, summarization, battery awareness, and performance analytics',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { className: "antialiased", children: children }) }));
}
//# sourceMappingURL=layout.js.map