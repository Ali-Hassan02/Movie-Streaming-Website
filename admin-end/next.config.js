/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '20mb', // Increase the body size limit to 20MB (you can adjust this as needed)
    },
  },
};

export default nextConfig;
