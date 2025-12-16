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
  title: 'Error Handling - Clarity Chat',
  description:
    'Robust error handling keeps conversations resilient even when downstream models or tools fail.',
}

export default async function ErrorHandlingGuidePage() {
  // Read markdown file
  let content: string
  try {
    const filePath = join(
      process.cwd(),
      'content',
      'vitepress-migration',
      'guide',
      'error-handling.md'
    )
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    logger.logger.error('Failed to read error-handling guide', error)
    content = '# Error Handling\n\nContent not available.'
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
