import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://clarity-chat.dev'
  const currentDate = new Date()

  // Define all routes with their priorities and change frequencies
  const routes = [
    // Core pages
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/getting-started', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/installation', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/components', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/hooks', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/examples', priority: 0.8, changeFrequency: 'weekly' as const },
    
    // Components
    { url: '/reference/components/button', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/card', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/modal', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/tabs', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/accordion', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/badge', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/avatar', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/tooltip', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/dropdown', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/pagination', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/breadcrumb', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/table', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/dialog', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/popover', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/drawer', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/spinner', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/progress', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/skeleton', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/alert', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/toast', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/input', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/select', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/reference/components/textarea', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/checkbox', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/components/switch', priority: 0.7, changeFrequency: 'monthly' as const },
    
    // Hooks
    { url: '/reference/hooks/use-disclosure', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/hooks/use-debounce', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/hooks/use-local-storage', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/hooks/use-click-outside', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/hooks/use-clipboard', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/reference/hooks/use-media-query', priority: 0.7, changeFrequency: 'monthly' as const },
    
    // Examples
    { url: '/examples/auth-flow', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/examples/dashboard', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/examples/ecommerce', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/examples/data-table', priority: 0.7, changeFrequency: 'monthly' as const },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
