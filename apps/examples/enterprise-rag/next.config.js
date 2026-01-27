// @ts-check
const baseNextConfig = require('../../../config/examples/next.config.base.cjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseNextConfig,
  // Add example-specific overrides here
}

module.exports = nextConfig
