import { logger } from '@clarity-chat/utils/logger';
import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/MDX/mdx-components'

export const metadata: Metadata = {
  title: 'Messages - Clarity Chat',
  description: 'Guide for messages in Clarity Chat',
}

export default async function MessagesGuidePage() {
  // Read markdown file
  let content: string
  try {
    const filePath = join(
      process.cwd(),
      'content',
      'vitepress-migration',
      'guide',
      'messages.md'
    )
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    logger.logger.error('Failed to read messages guide', error)
    content = '# Messages\n\nContent not available.'
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
