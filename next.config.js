//  @type {import('next').NextConfig}
const nextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "*" }] },
  // redirects: async () => {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/en/auth/login",
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
