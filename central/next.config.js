/**
 * @type {import('next').NextConfig}
 */
const nextConfig = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  swcMinify: true
})

module.exports = nextConfig
