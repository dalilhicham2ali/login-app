/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['maps.googleapis.com', 'maps.gstatic.com'],
  },
  compiler: {
    styledComponents: true,
  }
}

module.exports = nextConfig;
