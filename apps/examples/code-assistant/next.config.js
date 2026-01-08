/**
 * Next.js 16 Configuration for Code Assistant Example
 */
const nextConfig = {
    reactStrictMode: true,
    // Turbopack configuration (Next.js 16 - stable)
    turbopack: {},
    transpilePackages: ['@clarity-chat/react', '@clarity-chat/types'],
    typescript: {
        ignoreBuildErrors: true,
    },
};
export default nextConfig;
//# sourceMappingURL=next.config.js.map