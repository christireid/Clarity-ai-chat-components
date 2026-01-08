import { jsx as _jsx } from "react/jsx-runtime";
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Basic Chat | Clarity Chat Demo',
    description: 'The simplest possible AI chat implementation with Clarity Chat',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { className: inter.className, children: children }) }));
}
//# sourceMappingURL=layout.js.map