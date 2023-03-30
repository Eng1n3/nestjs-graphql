module.exports = {
  apps: [
    {
      name: 'adam-onboard-app',
      script: './adam-onboard/dist/main.js',
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 19004,
        NODE_ENV: 'production',
      },
    },
  ],
};
