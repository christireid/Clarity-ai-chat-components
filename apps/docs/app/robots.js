export default function robots() {
    const baseUrl = 'https://clarity-chat.dev';
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/private/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
//# sourceMappingURL=robots.js.map