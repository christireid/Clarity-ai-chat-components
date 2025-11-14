import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/MDX/mdx-components'

export const metadata: Metadata = {
  title: 'Interactive - Clarity Chat',
  description: 'Guide for interactive in Clarity Chat',
}

export default async function InteractiveGuidePage() {
  // Read markdown file
  let content: string
  try {
    const filePath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'interactive.md')
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    console.error('Failed to read interactive guide', error)
    content = '# Interactive\n\nContent not available.'
  }

  // Parse MDX
  const mdxSource = await serialize(content, {
    parseFrontmatter: true,
  })

  return (
    <>
      <Breadcrumbs />
      
      <div className="docs-content">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </div>
      </div>
    </>
  )
}
