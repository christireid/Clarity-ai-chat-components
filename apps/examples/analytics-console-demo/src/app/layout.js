import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Analytics Console Demo - Clarity Chat',
    description: 'Real-time AI analytics dashboard with token tracking, cost monitoring, and performance metrics',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { suppressHydrationWarning: true, children: children }) }));
}
//# sourceMappingURL=layout.js.map