/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "swalay-music-files.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "swalay-test-files.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  
  // Increase build timeout
  staticPageGenerationTimeout: 120,

  // Remove transpilePackages since we're not using @tanstack/react-table anymore
  // transpilePackages: ['@tanstack/react-table'],

  // Optimize webpack for better build performance
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Increase memory limit for server-side builds
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  async headers() {
    return [
      {
        source: '/api/albums/getAlbums',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/albums/getAlbumsDetails',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/track/getTracks',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/shemaroo/getalbums',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/shemaroo/updatealbumstatus',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/shemaroo/login',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },



    ];
  }
};

export default nextConfig;
