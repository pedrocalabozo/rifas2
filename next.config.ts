import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      { // For Google User Images
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Environment variables should be managed via .env.local or your hosting provider's settings.
  // Keeping this empty encourages best practices.
  // Example .env.local content:
  // NEXTAUTH_URL=http://localhost:9002
  // NEXTAUTH_SECRET=your_strong_secret
  // GOOGLE_CLIENT_ID=your_google_client_id
  // GOOGLE_CLIENT_SECRET=your_google_client_secret
  // DB_HOST=your_mysql_host
  // DB_DATABASE=your_mysql_database
  // DB_USER=your_mysql_user
  // DB_PASSWORD=your_mysql_password
  // DB_PORT=3306
};

export default nextConfig;
