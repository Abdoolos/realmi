/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  
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
