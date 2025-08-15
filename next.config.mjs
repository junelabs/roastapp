/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // add more as needed:
      // { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      // { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
    ],
  },
};

export default nextConfig; // ✅ ESM export
