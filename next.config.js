import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  
  // Disable ESLint during build (using Biome instead)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Set output file tracing root to silence Next.js workspace warning
  outputFileTracingRoot: __dirname,
  
  // Configure path aliases similar to Vite
  experimental: {
    esmExternals: true,
  },

  // Handle static files and images
  images: {
    unoptimized: true, // Disable Next.js image optimization for now to preserve exact layout
  },

  // Configure webpack for better module resolution
  webpack: (config) => {
    // Handle ESM modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.jsx', '.ts', '.tsx'],
    };

    return config;
  },

  // Configure trailing slash behavior to match Vite
  trailingSlash: false,

  // Configure redirects if needed
  async redirects() {
    return [
      // Add any necessary redirects here
    ];
  },

  // Configure rewrites if needed
  async rewrites() {
    return [
      // Add any necessary redirects here
    ];
  },
};

export default nextConfig;
