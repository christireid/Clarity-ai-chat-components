import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Model Comparison Demo - Clarity Chat',
    description: 'Compare AI model responses side-by-side with streaming support',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: "antialiased", children: children }) }));
}
//# sourceMappingURL=layout.js.map