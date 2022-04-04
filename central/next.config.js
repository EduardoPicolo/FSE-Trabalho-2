/**
 * @type {import('next').NextConfig}
 */
const nextConfig = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  swcMinify: true,
  experimental: {
    outputStandalone: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
})

module.exports = nextConfig
