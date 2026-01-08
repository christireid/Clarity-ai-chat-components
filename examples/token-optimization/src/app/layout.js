import { jsx as _jsx } from "react/jsx-runtime";
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Token Optimization - Clarity Chat Example',
    description: 'Demonstrations of TOON format, prompt caching, compression, and cost tracking',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { className: inter.className, children: children }) }));
}
//# sourceMappingURL=layout.js.map