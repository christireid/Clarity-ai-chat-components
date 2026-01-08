import { jsx as _jsx } from "react/jsx-runtime";
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Streaming Chat | Clarity Chat Demo',
    description: 'Advanced SSE streaming demo with cancel, retry, and token tracking',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", className: "dark", children: _jsx("body", { className: inter.className, children: children }) }));
}
//# sourceMappingURL=layout.js.map