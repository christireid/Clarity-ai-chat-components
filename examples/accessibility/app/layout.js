import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Accessibility | Clarity Chat Demo',
    description: 'WCAG 2.1 AA compliant AI chat interface with comprehensive accessibility features',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsxs("body", { className: inter.className, children: [_jsx("a", { href: "#main-content", className: "skip-link", children: "Skip to main content" }), children] }) }));
}
//# sourceMappingURL=layout.js.map