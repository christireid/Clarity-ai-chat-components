import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/MDX/mdx-components';
export const dynamic = 'force-dynamic'; // Avoid React version conflicts during static generation
export const metadata = {
    title: 'Interactive - Clarity Chat',
    description: 'Guide for interactive in Clarity Chat',
};
export default async function InteractiveGuidePage() {
    // Read markdown file
    let content;
    try {
        const filePath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'interactive.md');
        content = await readFile(filePath, 'utf-8');
    }
    catch (error) {
        console.error('Failed to read interactive guide', error);
        content = '# Interactive\n\nContent not available.';
    }
    // Parse MDX
    const { content: mdxContent } = matter(content);
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("div", { className: "docs-content", children: _jsx("div", { className: "prose prose-lg max-w-none dark:prose-invert", children: _jsx(MDXRemote, { source: mdxContent, components: mdxComponents }) }) })] }));
}
//# sourceMappingURL=page.js.map