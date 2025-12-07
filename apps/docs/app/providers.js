'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider } from 'next-themes';
import { MDXProvider } from '@mdx-js/react';
import { ToastProvider } from '@clarity-chat/react';
import { mdxComponents } from '@/components/MDX/mdx-components';
export function Providers({ children }) {
    return (_jsx(ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, children: _jsx(ToastProvider, { position: "top-right", defaultDuration: 4000, children: _jsx(MDXProvider, { components: mdxComponents, children: children }) }) }));
}
//# sourceMappingURL=providers.js.map