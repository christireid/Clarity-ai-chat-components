# Markdown Rendering Guide
**How to Render Markdown Files as Next.js Pages**

This guide explains how to set up markdown rendering for the integrated content sections.

---

## 📋 Current Status

### Route Pages Created ✅
- `/blog` - Blog listing page
- `/commercial` - Commercial documentation hub
- `/research` - Research documentation hub
- `/enterprise-standalone` - Enterprise features hub
- `/reference/api-standalone` - Standalone API docs hub

### Markdown Files Available ✅
All markdown files are in place and ready to be rendered.

---

## 🛠️ Setup Options

### Option 1: Using `next-mdx-remote` (Recommended)

The `next-mdx-remote` package is already installed in `apps/docs/package.json`.

#### Step 1: Create Dynamic Route Pages

For each markdown file, create a dynamic route page:

**Example: `/blog/[slug]/page.tsx`**
```tsx
import { Metadata } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'

export async function generateStaticParams() {
  const blogDir = path.join(process.cwd(), 'app/blog')
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))
  
  return files.map(file => ({
    slug: file.replace('.md', ''),
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: params.slug,
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const filePath = path.join(process.cwd(), 'app/blog', `${params.slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const mdxSource = await serialize(fileContents)
  
  return (
    <div className="container-docs py-12">
      <article className="prose prose-lg dark:prose-invert max-w-4xl">
        <MDXRemote {...mdxSource} />
      </article>
    </div>
  )
}
```

#### Step 2: Update Blog Listing Page

Update `apps/docs/app/blog/page.tsx` to dynamically read markdown files:

```tsx
import fs from 'fs'
import path from 'path'

export default async function BlogPage() {
  const blogDir = path.join(process.cwd(), 'app/blog')
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'))
  
  const posts = files.map(file => ({
    slug: file.replace('.md', ''),
    title: extractTitle(file), // Extract from frontmatter or filename
  }))
  
  // ... rest of component
}
```

---

### Option 2: Using `@next/mdx` (Alternative)

#### Step 1: Configure `next.config.js`

```js
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})
```

#### Step 2: Create MDX Components

Create `mdx-components.tsx`:

```tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

#### Step 3: Move Markdown Files

Move markdown files to match Next.js routing:
- `blog/the-7-ux-disasters-killing-ai-chat-apps.md` → `blog/the-7-ux-disasters-killing-ai-chat-apps/page.mdx`

---

## 📝 Content Pages Needed

### Blog Posts (3 pages)
- `/blog/the-7-ux-disasters-killing-ai-chat-apps`
- `/blog/ai-chat-ux-pain-points-and-solutions`
- `/blog/viral-strategies-research`

### Commercial Pages (8 pages)
- `/commercial/pricing` → `PRICING.md`
- `/commercial/license-pro` → `LICENSE-PRO.md`
- `/commercial/license-enterprise` → `LICENSE-ENTERPRISE.md`
- `/commercial/terms-of-service` → `TERMS_OF_SERVICE.md`
- `/commercial/privacy-policy` → `PRIVACY_POLICY.md`
- `/commercial/sales-deck` → `SALES_DECK_OUTLINE.md`
- `/commercial/case-studies` → `CASE_STUDIES.md`
- `/commercial/implementation-guide` → `IMPLEMENTATION_GUIDE.md`

### Research Pages (5 pages)
- `/research/vercel-ai-sdk-competitive-analysis`
- `/research/vercel-ai-sdk-feature-audit`
- `/research/vercel-ai-sdk-integration-guide`
- `/research/vercel-ai-observability-adapter`
- `/research/create-clarity-assistant-design`

### Enterprise Pages (2 pages)
- `/enterprise-standalone/enterprise-features` → `ENTERPRISE_FEATURES.md`
- `/enterprise-standalone/quick-reference` → `QUICK_REFERENCE.md`

### API Standalone Pages (4 pages)
- `/reference/api-standalone/react-components`
- `/reference/api-standalone/primitives`
- `/reference/api-standalone/token-optimization`
- `/reference/api-standalone/vercel-ai-sdk-hooks`

**Total**: 22 content pages needed

---

## 🎨 Styling

### Using Tailwind Typography

The `@tailwindcss/typography` plugin is already installed. Use it in your markdown pages:

```tsx
<article className="prose prose-lg dark:prose-invert max-w-4xl">
  <MDXRemote {...mdxSource} />
</article>
```

### Custom MDX Components

Create custom components for markdown:

```tsx
// components/MDX/CustomComponents.tsx
export const components = {
  h1: (props) => <h1 className="text-4xl font-bold mb-4" {...props} />,
  h2: (props) => <h2 className="text-3xl font-bold mb-3 mt-8" {...props} />,
  p: (props) => <p className="mb-4 text-text-secondary" {...props} />,
  // ... more components
}
```

---

## 🔗 Frontmatter Support

Add frontmatter to markdown files for metadata:

```markdown
---
title: "Blog Post Title"
description: "Blog post description"
date: "2024-01-01"
author: "Author Name"
---

# Blog Post Content
```

Parse frontmatter using `gray-matter`:

```bash
npm install gray-matter
```

```tsx
import matter from 'gray-matter'

const { data, content } = matter(fileContents)
```

---

## 📦 Dependencies

### Already Installed ✅
- `next-mdx-remote`: ^4.4.1
- `@next/mdx`: ^16.0.1
- `@mdx-js/react`: ^3.0.0
- `@tailwindcss/typography`: ^0.5.10

### May Need to Install
- `gray-matter` (for frontmatter parsing)
- `remark-gfm` (for GitHub Flavored Markdown)
- `rehype-highlight` (for syntax highlighting)

---

## 🚀 Quick Start

1. **Choose rendering method** (next-mdx-remote recommended)
2. **Create dynamic route pages** for each content section
3. **Add frontmatter** to markdown files (optional)
4. **Style with Tailwind Typography**
5. **Test routes** and verify rendering

---

## 📚 Resources

- [next-mdx-remote Documentation](https://github.com/hashicorp/next-mdx-remote)
- [Next.js MDX Documentation](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)

---

**Status**: Route pages created, markdown rendering setup pending  
**Priority**: Optional enhancement (content is accessible via route pages)
