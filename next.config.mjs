/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ss3-octupus.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // Define NEXTAUTH_URL
  },
  async headers() {
    return [
      {
        source: "/api/auth/(.*)", // Aplica a todas las rutas de autenticación de NextAuth
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // Permite solicitudes desde tu dominio Amplify
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
