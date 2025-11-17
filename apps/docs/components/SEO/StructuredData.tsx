/**
 * Structured Data (JSON-LD) Component
 *
 * Adds structured data to pages for better SEO and rich snippets.
 * Learn more: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

export interface StructuredDataProps {
  type?: 'website' | 'software' | 'documentation' | 'article'
  title?: string
  description?: string
  url?: string
}

export function StructuredData({
  type = 'website',
  title = 'Clarity Chat UI - Beautiful, Accessible React Components',
  description = 'A comprehensive React UI library for building beautiful, accessible chat interfaces with 70+ components, 35+ hooks, and 150+ animations.',
  url = 'https://clarity-chat.dev'
}: StructuredDataProps) {
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
          softwareVersion: '0.1.0',
          author: {
            '@type': 'Organization',
            name: 'Clarity Chat Team',
          },
          license: 'https://opensource.org/licenses/MIT',
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
              url: `${url}/logo.png`,
            },
          },
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
              urlTemplate: `${url}/?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
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
    description: 'Building beautiful, accessible React components for chat interfaces',
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

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
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
