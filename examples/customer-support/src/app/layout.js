import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Customer Support Chat',
    description: 'AI-powered customer support with conversation history',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { children: children }) }));
}
//# sourceMappingURL=layout.js.map