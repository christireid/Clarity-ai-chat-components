import { jsx as _jsx } from "react/jsx-runtime";
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
export const metadata = {
    title: 'Multi-Provider Chat | Clarity Chat Demo',
    description: 'Switch between OpenAI, Anthropic Claude, and Google Gemini',
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", children: _jsx("body", { className: inter.className, children: children }) }));
}
//# sourceMappingURL=layout.js.map