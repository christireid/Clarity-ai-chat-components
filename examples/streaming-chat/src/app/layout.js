import { jsx as _jsx } from "react/jsx-runtime";
import './globals.css';
export const metadata = {
    title: 'Streaming Chat Demo',
    description: 'Real-time AI chat with Server-Sent Events streaming',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { children: children }) }));
}
//# sourceMappingURL=layout.js.map