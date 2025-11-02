/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Remove unnecessary externals for better tree shaking
  webpack: (config, { isServer }) => {
    // Add path aliases
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    // Only add externals for server-side builds
    if (isServer) {
      config.externals['@solana/kit'] = 'commonjs @solana/kit';
      config.externals['@solana-program/memo'] = 'commonjs @solana-program/memo';
      config.externals['@solana-program/system'] = 'commonjs @solana-program/system';
      config.externals['@solana-program/token'] = 'commonjs @solana-program/token';
    }

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@solana/web3.js']
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
