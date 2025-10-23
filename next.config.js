/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  webpack: (config) => {
    config.externals['@solana/kit'] = 'commonjs @solana/kit';
    config.externals['@solana-program/memo'] = 'commonjs @solana-program/memo';
    config.externals['@solana-program/system'] = 'commonjs @solana-program/system';
    config.externals['@solana-program/token'] = 'commonjs @solana-program/token';

    // Add path aliases
    config.resolve.alias['@'] = path.join(__dirname, 'src');

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@solana/web3.js']
  }
};

module.exports = nextConfig;
