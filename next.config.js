/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Bundle the SQLite seed DB into serverless functions (copied to /tmp at runtime)
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./prisma/dev.db'],
      '/api/**/*': ['./prisma/dev.db'],
      '/admin/**/*': ['./prisma/dev.db'],
      '/learner/**/*': ['./prisma/dev.db'],
      '/courses/**/*': ['./prisma/dev.db'],
    },
  },
};

module.exports = nextConfig;
