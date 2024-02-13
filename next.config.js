const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({enabled: true})
    : (config) => config

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/info/%E4%BA%8B%E6%A5%AD%E5%86%85%E5%AE%B9',
        destination: '/works',
        permanent: true,
      },
      {
        source: '/info/%E4%BC%9A%E7%A4%BE%E6%A6%82%E8%A6%81',
        destination: '/company',
        permanent: true,
      },
    ]
  },
}

module.exports = withBundleAnalyzer(nextConfig)
