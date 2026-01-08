/**
 * Next.js 16 Configuration for AI Research Platform Example
 *
 * Static export configuration for demo deployment.
 */
const nextConfig = {
    reactStrictMode: true,
    // Turbopack configuration (Next.js 16 - stable)
    turbopack: {},
    transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives'],
    typescript: {
        ignoreBuildErrors: true,
    },
    // Static export for demo deployment
    output: 'export',
};
export default nextConfig;
//# sourceMappingURL=next.config.js.map