import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Clarity Chat Quickstart',
    description: 'Get started with Clarity Chat in 5 minutes',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: "antialiased", children: children }) }));
}
//# sourceMappingURL=layout.js.map