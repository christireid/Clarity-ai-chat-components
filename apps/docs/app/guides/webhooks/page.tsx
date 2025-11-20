import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/MDX/mdx-components'

export const dynamic = 'force-dynamic' // Avoid React version conflicts during static generation

export const metadata: Metadata = {
  title: 'Webhooks - Clarity Chat',
  description: 'Guide for webhooks in Clarity Chat',
}

export default async function WebhooksGuidePage() {
  // Read markdown file
  let content: string
  try {
    const filePath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'webhooks.md')
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    console.error('Failed to read webhooks guide', error)
    content = '# Webhooks\n\nContent not available.'
  }

  // Parse MDX
  const { content: mdxContent } = matter(content)


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
