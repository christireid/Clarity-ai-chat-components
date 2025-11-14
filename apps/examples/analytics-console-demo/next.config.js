/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static generation to avoid SSR issues with styled-jsx
  output: 'standalone',
  experimental: {
    // Fix for styled-jsx SSR issues in Next.js 15
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
