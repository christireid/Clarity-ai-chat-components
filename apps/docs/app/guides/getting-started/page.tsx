import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/MDX/mdx-components'

export const metadata: Metadata = {
  title: 'Getting Started - Clarity Chat',
  description: 'Get started with Clarity Chat - installation, setup, and your first chat interface.',
}

export default async function GettingStartedGuidePage() {
  // Read markdown file - try quick-start.md first, then getting-started.md
  let content: string
  try {
    const quickStartPath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'quick-start.md')
    content = await readFile(quickStartPath, 'utf-8')
  } catch {
    try {
      const gettingStartedPath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'getting-started.md')
      content = await readFile(gettingStartedPath, 'utf-8')
    } catch (error) {
      console.error('Failed to read getting-started guide', error)
      content = '# Getting Started\n\nContent not available. Please see the [Quick Start](/learn/quick-start) guide.'
    }
  }

  // Parse MDX
  const { content: mdxContent } = matter(content)
  )

  return (
    <>
      <Breadcrumbs />
      
      <div className="docs-content">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDXRemote source={mdxContent} components={mdxComponents} />
        </div>
      </div>
    </>
  )
}
