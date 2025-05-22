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
  env: {
    // These are placeholders. In a real app, use a .env.local file
    // and do not commit sensitive keys to version control.
    // NEXTAUTH_URL is usually automatically set by Vercel or similar platforms.
    // For local development, set it in .env.local if needed (e.g., NEXTAUTH_URL=http://localhost:3000)
    // NEXTAUTH_SECRET: 'your_strong_nextauth_secret_here',
    // GOOGLE_CLIENT_ID: 'your_google_client_id.apps.googleusercontent.com',
    // GOOGLE_CLIENT_SECRET: 'your_google_client_secret',
    // MYSQL_HOST: 'your_mysql_host',
    // MYSQL_DATABASE: 'your_mysql_database',
    // MYSQL_USER: 'your_mysql_user',
    // MYSQL_PASSWORD: 'your_mysql_password',
    // MYSQL_PORT: '3306',
  },
};

export default nextConfig;
