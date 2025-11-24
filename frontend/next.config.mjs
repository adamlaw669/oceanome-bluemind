/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone mode - works without backend
  output: 'standalone',
  
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Enable compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Environment variables - no backend needed
  env: {
    NEXT_PUBLIC_API_URL: '', // Using localStorage instead
  },
}

export default nextConfig