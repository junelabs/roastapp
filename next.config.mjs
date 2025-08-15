// ✅ new
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // add any others you load images from:
      // { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      // { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig; // or `export default nextConfig` if using ESM
