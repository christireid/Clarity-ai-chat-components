// @ts-check
import baseNextConfig from '../../../config/examples/next.config.base.cjs';

/**
 * Next.js 16 Configuration for Analytics Console Demo
 *
 * Extends base config with standalone output for deployment flexibility.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...baseNextConfig,

  // Override base 'export' with 'standalone' for containerized deployments
  output: 'standalone',

  // Optimize package imports for tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig;
