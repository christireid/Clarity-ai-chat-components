/**
 * Next.js 16 Configuration for Marketing Site
 *
 * Modernized configuration using TypeScript with:
 * - Turbopack support
 * - Modern image optimization with remotePatterns
 * - Optimized package imports for tree-shaking
 */
const nextConfig = {
    reactStrictMode: true,
    // Turbopack configuration (Next.js 16 - stable)
    turbopack: {},
    // Optimize package imports for better tree-shaking (stable in Next.js 15.5+)
    experimental: {
        optimizePackageImports: [
            '@clarity-chat/react',
            '@clarity-chat/primitives',
            'lucide-react',
            'framer-motion',
        ],
    },
    // Modern image optimization with remotePatterns (replaces deprecated 'domains')
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'clarity-chat.dev',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
    // Redirects for commercial pages
    async redirects() {
        return [
            {
                source: '/buy',
                destination: '/pricing',
                permanent: false,
            },
            {
                source: '/purchase',
                destination: '/pricing',
                permanent: false,
            },
        ];
    },
};
export default nextConfig;
//# sourceMappingURL=next.config.js.map