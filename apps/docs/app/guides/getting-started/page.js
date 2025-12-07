import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Getting Started - Clarity Chat',
    description: 'Get started with Clarity Chat - installation, setup, and your first chat interface.',
};
export default async function GettingStartedGuidePage() {
    // Read markdown file - try quick-start.md first, then getting-started.md
    let content;
    try {
        const quickStartPath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'quick-start.md');
        content = await readFile(quickStartPath, 'utf-8');
    }
    catch {
        try {
            const gettingStartedPath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'getting-started.md');
            content = await readFile(gettingStartedPath, 'utf-8');
        }
        catch (error) {
            console.error('Failed to read getting-started guide', error);
            content = '# Getting Started\n\nContent not available. Please see the [Quick Start](/learn/quick-start) guide.';
        }
    }
    // Parse MDX
    const { content: mdxContent } = matter(content);
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("div", { className: "docs-content", children: _jsx("div", { className: "prose prose-lg max-w-none dark:prose-invert", children: _jsx("pre", { className: "whitespace-pre-wrap", children: mdxContent }) }) })] }));
}
//# sourceMappingURL=page.js.map