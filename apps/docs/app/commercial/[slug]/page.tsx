import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { readFile } from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/MDX/mdx-components'

interface CommercialPageProps {
  params: Promise<{ slug: string }>
}

// Commercial page metadata
const commercialPages: Record<string, { title: string; description: string }> = {
  pricing: {
    title: 'Pricing - Clarity Chat',
    description: 'Choose the plan that fits your needs. All plans include our core component library.',
  },
  'case-studies': {
    title: 'Case Studies - Clarity Chat',
    description: 'See how teams are using Clarity Chat to build amazing AI chat experiences.',
  },
  terms: {
    title: 'Terms of Service - Clarity Chat',
    description: 'Terms and conditions for using Clarity Chat products and services.',
  },
  privacy: {
    title: 'Privacy Policy - Clarity Chat',
    description: 'How we collect, use, and protect your personal information.',
  },
  enterprise: {
    title: 'Enterprise - Clarity Chat',
    description: 'Enterprise features, support, and custom solutions for large organizations.',
  },
}

// Map slugs to file names
const slugToFile: Record<string, string> = {
  pricing: 'PRICING.md',
  'case-studies': 'CASE_STUDIES.md',
  terms: 'TERMS_OF_SERVICE.md',
  privacy: 'PRIVACY_POLICY.md',
  enterprise: 'ENTERPRISE_FEATURES.md', // Will be in enterprise subdirectory
}

export async function generateStaticParams() {
  return Object.keys(commercialPages).map((slug) => ({ slug ))
}

export async function generateMetadata({ params }: CommercialPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = commercialPages[slug]

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: page.title,
    description: page.description,
  }
}

export default async function CommercialPage({ params }: CommercialPageProps) {
  const { slug } = await params
  const page = commercialPages[slug]

  if (!page) {
    notFound()
  }

  // Read markdown file
  let content: string
  try {
    const fileName = slugToFile[slug]
    if (!fileName) {
      notFound()
    }

    // Check if it's an enterprise page (in subdirectory)
    const filePath = slug === 'enterprise'
      ? join(process.cwd(), 'content', 'guides-migration', 'enterprise', fileName)
      : join(process.cwd(), 'content', 'commercial', fileName)
    
    content = await readFile(filePath, 'utf-8')
  } catch (error) {
    console.error(`Failed to read commercial page: ${slug}`, error)
    notFound()
  }

  // Parse MDX
  const { content: mdxContent } = matter(content)
  )

  return (
    <>
      <Breadcrumbs />
      
      <div className="docs-content">
        <Link
          href="/commercial"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Commercial
        </Link>

        <article>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MDXRemote source={mdxContent} components={mdxComponents} />
          </div>
        </article>
      </div>
    </>
  )
}
