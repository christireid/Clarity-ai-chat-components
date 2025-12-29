/**
 * Structured Data (JSON-LD) Component
 *
 * Adds structured data to pages for better SEO, rich snippets, and AI indexing.
 * Learn more: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 *
 * AI Optimization Notes:
 * - Uses schema.org vocabulary for maximum compatibility
 * - Includes detailed metadata for RAG retrieval
 * - Supports component and hook documentation types
 */

import { getStableTimestamp } from '@/lib/ai/types'

export interface StructuredDataProps {
  type?:
    | 'website'
    | 'software'
    | 'documentation'
    | 'article'
    | 'component'
    | 'hook'
    | 'howto'
    | 'faq'
  title?: string
  description?: string
  url?: string
  // Extended props for component/hook documentation
  componentName?: string
  category?: string
  version?: string
  dependencies?: string[]
  codeExample?: string
  props?: Array<{ name: string; type: string; description: string }>
  // HowTo specific props
  steps?: Array<{ name: string; text: string; code?: string }>
  // FAQ specific props
  faqs?: Array<{ question: string; answer: string }>
}

export function StructuredData({
  type = 'website',
  title = 'Clarity Chat UI - Beautiful, Accessible React Components',
  description = 'A comprehensive React UI library for building beautiful, accessible chat interfaces with 200+ components, 95+ hooks, and 150+ animations.',
  url = 'https://clarity-chat.dev',
  componentName,
  category,
  version = '0.1.0',
  dependencies,
  codeExample,
  props,
  steps,
  faqs,
}: StructuredDataProps) {
  const baseUrl = 'https://clarity-chat.dev'

  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    }

    switch (type) {
      case 'software':
        return {
          ...baseData,
          '@type': 'SoftwareApplication',
          name: title,
          description,
          url,
          applicationCategory: 'DeveloperApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          operatingSystem: 'Any',
          softwareVersion: version,
          author: {
            '@type': 'Organization',
            name: 'Clarity Chat Team',
          },
          license: 'https://opensource.org/licenses/MIT',
          // AI-friendly metadata
          programmingLanguage: ['TypeScript', 'JavaScript', 'React'],
          runtimePlatform: 'Node.js',
          softwareRequirements: 'React 19+, Node.js 20+',
        }

      case 'documentation':
        return {
          ...baseData,
          '@type': 'TechArticle',
          headline: title,
          description,
          url,
          author: {
            '@type': 'Organization',
            name: 'Clarity Chat Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Clarity Chat',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
          dateModified: getStableTimestamp(),
          inLanguage: 'en-US',
        }

      case 'article':
        return {
          ...baseData,
          '@type': 'Article',
          headline: title,
          description,
          url,
          author: {
            '@type': 'Organization',
            name: 'Clarity Chat Team',
          },
          dateModified: getStableTimestamp(),
        }

      // New type: Component documentation
      case 'component':
        return {
          ...baseData,
          '@type': 'TechArticle',
          headline: `${componentName || title} - React Component`,
          name: componentName || title,
          description,
          url,
          articleSection: category || 'Components',
          author: {
            '@type': 'Organization',
            name: 'Clarity Chat Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Clarity Chat',
          },
          dateModified: getStableTimestamp(),
          about: {
            '@type': 'SoftwareSourceCode',
            name: componentName || title,
            programmingLanguage: {
              '@type': 'ComputerLanguage',
              name: 'TypeScript',
            },
            runtimePlatform: 'React',
            ...(codeExample && { text: codeExample }),
            ...(dependencies && { dependencies: dependencies.join(', ') }),
          },
          // Include props as structured data for AI retrieval
          ...(props && {
            hasPart: props.map((prop) => ({
              '@type': 'PropertyValue',
              name: prop.name,
              value: prop.type,
              description: prop.description,
            })),
          }),
          version,
        }

      // New type: Hook documentation
      case 'hook':
        return {
          ...baseData,
          '@type': 'TechArticle',
          headline: `${componentName || title} - React Hook`,
          name: componentName || title,
          description,
          url,
          articleSection: 'Hooks',
          author: {
            '@type': 'Organization',
            name: 'Clarity Chat Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Clarity Chat',
          },
          dateModified: getStableTimestamp(),
          about: {
            '@type': 'SoftwareSourceCode',
            name: componentName || title,
            programmingLanguage: {
              '@type': 'ComputerLanguage',
              name: 'TypeScript',
            },
            runtimePlatform: 'React',
            ...(codeExample && { text: codeExample }),
          },
          version,
        }

      // New type: HowTo for tutorials
      case 'howto':
        return {
          ...baseData,
          '@type': 'HowTo',
          name: title,
          description,
          url,
          ...(steps && {
            step: steps.map((step, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: step.name,
              text: step.text,
              ...(step.code && {
                itemListElement: {
                  '@type': 'HowToDirection',
                  text: step.code,
                },
              }),
            })),
          }),
          tool: {
            '@type': 'HowToTool',
            name: '@clarity-chat/react',
          },
        }

      // New type: FAQ for common questions
      case 'faq':
        return {
          ...baseData,
          '@type': 'FAQPage',
          name: title,
          description,
          url,
          ...(faqs && {
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }

      case 'website':
      default:
        return {
          ...baseData,
          '@type': 'WebSite',
          name: title,
          description,
          url,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
          // AI-friendly site metadata
          inLanguage: 'en-US',
          copyrightYear: 2025, // Static to prevent hydration mismatch
          creator: {
            '@type': 'Organization',
            name: 'Clarity Chat Team',
          },
        }
    }
  }

  const structuredData = getStructuredData()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

/**
 * Organization structured data
 */
export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Clarity Chat',
    url: 'https://clarity-chat.dev',
    logo: 'https://clarity-chat.dev/logo.png',
    description:
      'Building beautiful, accessible React components for chat interfaces',
    sameAs: [
      'https://github.com/christireid/Clarity-ai-chat-components',
      'https://twitter.com/claritychat',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Breadcrumb structured data
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: BreadcrumbItem[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Software Library structured data
 *
 * Comprehensive schema for the entire Clarity Chat library,
 * optimized for AI indexing and discovery.
 */
export function SoftwareLibraryStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'Clarity Chat',
    alternateName: '@clarity-chat/react',
    description:
      'Enterprise-grade React component library for building beautiful, accessible AI chat interfaces. Features 200+ components, 95+ hooks, 15 themes, and comprehensive token optimization.',
    url: 'https://clarity-chat.dev',
    codeRepository: 'https://github.com/christireid/Clarity-ai-chat-components',
    programmingLanguage: [
      {
        '@type': 'ComputerLanguage',
        name: 'TypeScript',
      },
      {
        '@type': 'ComputerLanguage',
        name: 'React',
      },
    ],
    runtimePlatform: 'Node.js',
    targetProduct: {
      '@type': 'SoftwareApplication',
      name: 'AI Chat Applications',
      applicationCategory: 'DeveloperApplication',
    },
    author: {
      '@type': 'Organization',
      name: 'Clarity Chat Team',
      url: 'https://clarity-chat.dev',
    },
    license: 'https://opensource.org/licenses/MIT',
    version: '0.1.0',
    dateModified: getStableTimestamp(),
    keywords: [
      'react',
      'typescript',
      'chat',
      'ai',
      'llm',
      'components',
      'ui library',
      'streaming',
      'accessibility',
      'wcag',
      'token optimization',
      'enterprise',
    ].join(', '),
    // AI-specific discovery metadata
    isAccessibleForFree: true,
    hasPart: [
      {
        '@type': 'SoftwareSourceCode',
        name: 'Components',
        description:
          '70+ production-ready React components for chat interfaces',
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'Hooks',
        description: '35+ custom React hooks for chat functionality',
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'Themes',
        description: '11+ pre-built themes with full customization support',
      },
      {
        '@type': 'SoftwareSourceCode',
        name: 'Token Optimization',
        description: 'Utilities for reducing API costs by up to 70%',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Documentation site structured data
 *
 * Helps AI systems understand the documentation structure.
 */
export function DocumentationSiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Clarity Chat Documentation',
    alternateName: 'Clarity Chat Docs',
    url: 'https://clarity-chat.dev',
    description:
      'Official documentation for Clarity Chat - Enterprise-grade React components for AI chat interfaces',
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'SoftwareApplication',
      name: 'Clarity Chat',
      url: 'https://clarity-chat.dev',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Documentation Sections',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Getting Started',
          url: 'https://clarity-chat.dev/learn/quick-start',
          description: 'Quick start guide and installation instructions',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Components',
          url: 'https://clarity-chat.dev/reference/components',
          description: 'API reference for all 200+ components',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Hooks',
          url: 'https://clarity-chat.dev/reference/hooks',
          description: 'API reference for all 95+ hooks',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Examples',
          url: 'https://clarity-chat.dev/examples',
          description: 'Working code examples and demos',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Cookbook',
          url: 'https://clarity-chat.dev/cookbook',
          description: 'Recipes for common implementation patterns',
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Guides',
          url: 'https://clarity-chat.dev/guides',
          description: 'In-depth guides for advanced topics',
        },
      ],
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://clarity-chat.dev/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    // AI-specific endpoints
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'llms.txt',
        value: 'https://clarity-chat.dev/llms.txt',
        description: 'AI-optimized documentation overview',
      },
      {
        '@type': 'PropertyValue',
        name: 'Components API',
        value: 'https://clarity-chat.dev/api/ai/components',
        description: 'JSON API for component discovery',
      },
      {
        '@type': 'PropertyValue',
        name: 'Hooks API',
        value: 'https://clarity-chat.dev/api/ai/hooks',
        description: 'JSON API for hook discovery',
      },
      {
        '@type': 'PropertyValue',
        name: 'Search API',
        value: 'https://clarity-chat.dev/api/ai/search',
        description: 'Searchable documentation index',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
