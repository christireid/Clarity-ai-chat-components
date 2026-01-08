import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Headless Mode - Clarity Chat',
    description: 'Use Clarity Chat hooks with your own custom UI',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: "antialiased", children: children }) }));
}
//# sourceMappingURL=layout.js.map