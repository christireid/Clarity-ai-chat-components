import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { Navigation } from '@/components/Navigation/Navigation';
import { Footer } from '@/components/Layout/Footer';
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
});
export const metadata = {
    title: {
        default: 'Clarity Chat UI - Beautiful, Accessible React Components',
        template: '%s | Clarity Chat UI',
    },
    description: 'A comprehensive React UI library for building beautiful, accessible chat interfaces with 70+ components, 30+ hooks, and 150+ animations.',
    keywords: [
        'react',
        'ui library',
        'chat ui',
        'components',
        'typescript',
        'tailwind',
        'framer motion',
        'accessibility',
        'design system',
    ],
    authors: [{ name: 'Clarity Chat Team' }],
    creator: 'Clarity Chat Team',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://clarity-chat.dev',
        title: 'Clarity Chat UI - Beautiful, Accessible React Components',
        description: 'A comprehensive React UI library for building beautiful, accessible chat interfaces.',
        siteName: 'Clarity Chat UI',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Clarity Chat UI - Beautiful, Accessible React Components',
        description: 'A comprehensive React UI library for building beautiful, accessible chat interfaces.',
        creator: '@claritychat',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, className: `${inter.variable} ${jetbrainsMono.variable}`, children: _jsx("body", { className: inter.className, children: _jsxs(Providers, { children: [_jsx("a", { href: "#main-content", className: "skip-to-content", children: "Skip to content" }), _jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Navigation, {}), _jsx("main", { id: "main-content", className: "flex-1", children: children }), _jsx(Footer, {})] })] }) }) }));
}
//# sourceMappingURL=layout.js.map