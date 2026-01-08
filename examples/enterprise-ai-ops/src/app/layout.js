import { jsx as _jsx } from "react/jsx-runtime";
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Enterprise AI Ops - Clarity Chat Example',
    description: 'AI operations dashboard with monitoring, evaluation, and safety features',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { className: inter.className, children: children }) }));
}
//# sourceMappingURL=layout.js.map