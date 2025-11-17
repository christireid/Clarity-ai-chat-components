import { MetadataRoute } from 'next'
import { searchData } from '@/lib/search-data'

/**
 * Dynamic sitemap generation
 *
 * Automatically includes all pages from the search index.
 * Regenerate search index to update sitemap: `node scripts/generate-search-index.mjs`
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clarity-chat.dev'
  const currentDate = new Date()

  // Helper function to determine priority and change frequency by type
  function getPageConfig(type: string, href: string) {
    // Homepage gets highest priority
    if (href === '/') {
      return { priority: 1.0, changeFrequency: 'weekly' as const }
    }

    // Quick start and installation pages
    if (href.includes('quick-start') || href.includes('installation')) {
      return { priority: 0.9, changeFrequency: 'monthly' as const }
    }

    // Priority and change frequency by content type
    switch (type) {
      case 'component':
        return { priority: 0.8, changeFrequency: 'monthly' as const }
      case 'hook':
        return { priority: 0.8, changeFrequency: 'monthly' as const }
      case 'guide':
        return { priority: 0.8, changeFrequency: 'monthly' as const }
      case 'example':
        return { priority: 0.7, changeFrequency: 'monthly' as const }
      case 'cookbook':
        return { priority: 0.7, changeFrequency: 'monthly' as const }
      case 'concept':
        return { priority: 0.8, changeFrequency: 'monthly' as const }
      case 'deployment':
        return { priority: 0.7, changeFrequency: 'monthly' as const }
      case 'integration':
        return { priority: 0.7, changeFrequency: 'monthly' as const }
      default:
        return { priority: 0.6, changeFrequency: 'monthly' as const }
    }
  }

  // Generate sitemap entries from search data
  const pages = searchData
    .filter(item => {
      // Filter out template pages and invalid hrefs
      return !item.href.includes('[') && !item.href.includes('{') && item.href.startsWith('/')
    })
    .map((item) => {
      const config = getPageConfig(item.type, item.href)
      return {
        url: `${baseUrl}${item.href}`,
        lastModified: currentDate,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      }
    })

  // Add homepage explicitly if not in search data
  const hasHomepage = pages.some(p => p.url === baseUrl || p.url === `${baseUrl}/`)
  if (!hasHomepage) {
    pages.unshift({
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    })
  }

  return pages
}
