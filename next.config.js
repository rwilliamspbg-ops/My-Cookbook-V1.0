/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Allow cross-origin requests in development
  allowedDevOrigins: ['10.0.0.4'],

  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Empty config to silence the warning
    // Turbopack handles most things automatically
  },

  // Webpack configuration (fallback for production builds)
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here if needed
    // For example, handling SQLite in browser contexts:
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Image optimization domains (add if you use external images)
  images: {
    domains: [
      // Add domains for external images here
      // Example: 'your-cdn.com', 's3.amazonaws.com'
    ],
    // Optionally set image formats
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables available on client side
  env: {
    // Add any public env vars here if needed
  },

  // Redirects (optional)
  async redirects() {
    return [
      // Example redirect
      // {
      //   source: '/old-route',
      //   destination: '/new-route',
      //   permanent: true,
      // },
    ];
  },

  // Headers (optional - useful for security)
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

  // Experimental features (remove if not needed)
  experimental: {
    // App Router is stable now, no experimental flag needed
    // serverActions: true, // Enable if you use Server Actions
  },

  // TypeScript configuration
  typescript: {
    // Set to true to allow production builds even with TS errors
    // ⚠️ NOT recommended - fix errors instead!
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Set to true to allow production builds even with ESLint errors
    // ⚠️ NOT recommended - fix errors instead!
    ignoreDuringBuilds: false,
  },

  // Output configuration for deployment
  // output: 'standalone', // Uncomment for Docker deployments

  // Internationalization (i18n) - remove if not needed
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
};

export default nextConfig;
