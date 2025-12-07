import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/MDX/mdx-components';
import matter from 'gray-matter';
export const dynamic = 'force-dynamic'; // Avoid React version conflicts during static generation
// Blog post metadata
const blogPosts = {
    'ai-chat-ux-pain-points-and-solutions': {
        title: 'I Built 20 AI Chat Interfaces. Here Are The 7 Mistakes That Cost Me $200K',
        date: '2024-01-15',
        readTime: '12 min read',
        excerpt: 'Spoiler: You\'re probably making all of them right now.',
    },
    'the-7-ux-disasters-killing-ai-chat-apps-v2': {
        title: 'The 7 UX Disasters Killing AI Chat Apps (V2)',
        date: '2024-02-01',
        readTime: '10 min read',
        excerpt: 'Updated analysis of the most common UX mistakes.',
    },
    'the-7-ux-disasters-killing-ai-chat-apps': {
        title: 'The 7 UX Disasters Killing AI Chat Apps',
        date: '2023-12-10',
        readTime: '8 min read',
        excerpt: 'The fundamental UX mistakes that kill AI chat apps.',
    },
    'viral-strategies-research': {
        title: 'Viral Strategies Research',
        date: '2024-01-20',
        readTime: '15 min read',
        excerpt: 'Research and insights on creating viral AI chat experiences.',
    },
};
// Use existing MDX components from the docs-site
export async function generateStaticParams() {
    return Object.keys(blogPosts).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = blogPosts[slug];
    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }
    return {
        title: post.title,
        description: post.excerpt,
    };
}
export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = blogPosts[slug];
    if (!post) {
        notFound();
    }
    // Read markdown file
    let content;
    try {
        const filePath = join(process.cwd(), 'content', 'blog', `${slug}.md`);
        content = await readFile(filePath, 'utf-8');
    }
    catch (error) {
        console.error(`Failed to read blog post: ${slug}`, error);
        notFound();
    }
    // Parse frontmatter if present
    const { content: mdxContent } = matter(content);
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsxs("div", { className: "docs-content", children: [_jsxs(Link, { href: "/blog", className: "inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Blog"] }), _jsxs("article", { children: [_jsxs("header", { className: "mb-8", children: [_jsx("span", { className: "docs-badge", children: "Blog Post" }), _jsx("h1", { className: "text-4xl font-bold mt-2 mb-4", children: post.title }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-text-tertiary mb-6", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("time", { dateTime: post.date, children: new Date(post.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }) })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-4 h-4" }), post.readTime] })] })] }), _jsx("div", { className: "prose prose-lg max-w-none dark:prose-invert", children: _jsx(MDXRemote, { source: mdxContent, components: mdxComponents }) })] })] })] }));
}
//# sourceMappingURL=page.js.map