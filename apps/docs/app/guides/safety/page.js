import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Safety - Clarity Chat',
    description: 'Guide for safety in Clarity Chat',
};
export default async function SafetyGuidePage() {
    // Read markdown file
    let content;
    try {
        const filePath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'safety.md');
        content = await readFile(filePath, 'utf-8');
    }
    catch (error) {
        console.error('Failed to read safety guide', error);
        content = '# Safety\n\nContent not available.';
    }
    // Parse MDX
    const { content: mdxContent } = matter(content);
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("div", { className: "docs-content", children: _jsx("div", { className: "prose prose-lg max-w-none dark:prose-invert", children: _jsx("pre", { className: "whitespace-pre-wrap", children: mdxContent }) }) })] }));
}
//# sourceMappingURL=page.js.map