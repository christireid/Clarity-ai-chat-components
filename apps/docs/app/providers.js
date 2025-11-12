'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider } from 'next-themes';
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from '@/components/MDX/mdx-components';
export function Providers({ children }) {
    return (
    // @ts-expect-error - next-themes has type incompatibility with React 19
    _jsx(ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, children: _jsx(MDXProvider, { components: mdxComponents, children: children }) }));
}
//# sourceMappingURL=providers.js.map