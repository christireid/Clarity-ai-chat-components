import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Rbac - Clarity Chat',
    description: 'Guide for rbac in Clarity Chat',
};
export default async function RbacGuidePage() {
    // Read markdown file
    let content;
    try {
        const filePath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'rbac.md');
        content = await readFile(filePath, 'utf-8');
    }
    catch (error) {
        console.error('Failed to read rbac guide', error);
        content = '# Rbac\n\nContent not available.';
    }
    // Parse MDX
    const { content: mdxContent } = matter(content);
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("div", { className: "docs-content", children: _jsx("div", { className: "prose prose-lg max-w-none dark:prose-invert", children: _jsx("pre", { className: "whitespace-pre-wrap", children: mdxContent }) }) })] }));
}
//# sourceMappingURL=page.js.map