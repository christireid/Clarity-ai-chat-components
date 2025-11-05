export default function sitemap() {
    const baseUrl = 'https://clarity-chat.dev';
    const currentDate = new Date();
    // Define all routes with their priorities and change frequencies
    const routes = [
        // Core pages
        { url: '', priority: 1.0, changeFrequency: 'weekly' },
        { url: '/getting-started', priority: 0.9, changeFrequency: 'monthly' },
        { url: '/installation', priority: 0.9, changeFrequency: 'monthly' },
        { url: '/components', priority: 0.9, changeFrequency: 'weekly' },
        { url: '/hooks', priority: 0.8, changeFrequency: 'weekly' },
        { url: '/examples', priority: 0.8, changeFrequency: 'weekly' },
        // Components
        { url: '/reference/components/button', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/card', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/modal', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/tabs', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/accordion', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/badge', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/avatar', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/tooltip', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/dropdown', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/pagination', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/breadcrumb', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/table', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/dialog', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/popover', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/drawer', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/spinner', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/progress', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/skeleton', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/alert', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/toast', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/input', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/select', priority: 0.8, changeFrequency: 'monthly' },
        { url: '/reference/components/textarea', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/checkbox', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/components/switch', priority: 0.7, changeFrequency: 'monthly' },
        // Hooks
        { url: '/reference/hooks/use-disclosure', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/hooks/use-debounce', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/hooks/use-local-storage', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/hooks/use-click-outside', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/hooks/use-clipboard', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/reference/hooks/use-media-query', priority: 0.7, changeFrequency: 'monthly' },
        // Examples
        { url: '/examples/auth-flow', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/examples/dashboard', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/examples/ecommerce', priority: 0.7, changeFrequency: 'monthly' },
        { url: '/examples/data-table', priority: 0.7, changeFrequency: 'monthly' },
    ];
    return routes.map((route) => ({
        url: `${baseUrl}${route.url}`,
        lastModified: currentDate,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
//# sourceMappingURL=sitemap.js.map