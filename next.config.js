/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  swcMinify: true,
  
  // Disable some experimental features that might cause issues
  experimental: {
    // Disable features that might cause build issues
    serverComponentsExternalPackages: [],
  },
  
  // Basic webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Only apply basic optimizations in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig 