/**
 * Next.js 16 Configuration for Customer Support Example
 *
 * Static export configuration for demo deployment.
 */
const nextConfig = {
    reactStrictMode: true,
    // Turbopack configuration (Next.js 16 - stable)
    turbopack: {},
    transpilePackages: [
        '@clarity-chat/react',
        '@clarity-chat/primitives',
        '@clarity-chat/types',
    ],
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Static export for demo deployment
    output: 'export',
};
export default nextConfig;
//# sourceMappingURL=next.config.js.map