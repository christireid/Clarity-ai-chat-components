import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Rbac - Clarity Chat',
  description: 'Guide for rbac in Clarity Chat',
}

export default async function RbacGuidePage() {
  // Read markdown file
  let content: string
  try {
    const filePath = join(process.cwd(), 'content', 'vitepress-migration', 'guide', 'rbac.md')
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    console.error('Failed to read rbac guide', error)
    content = '# Rbac\n\nContent not available.'
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
