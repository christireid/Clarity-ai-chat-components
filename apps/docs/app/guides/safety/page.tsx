import { logger } from '@clarity-chat/utils/logger';
import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

export const metadata: Metadata = {
  title: 'Safety - Clarity Chat',
  description: 'Guide for safety in Clarity Chat',
}

export default async function SafetyGuidePage() {
  // Read markdown file
  let content: string
  try {
    const filePath = join(
      process.cwd(),
      'content',
      'vitepress-migration',
      'guide',
      'safety.md'
    )
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    logger.logger.error('Failed to read safety guide', error)
    content = '# Safety\n\nContent not available.'
  }

  // Parse MDX
  const { content: mdxContent } = matter(content)

  return (
    <>
      <Breadcrumbs />

      <div className="docs-content">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <pre className="whitespace-pre-wrap">{mdxContent}</pre>
        </div>
      </div>
    </>
  )
}
