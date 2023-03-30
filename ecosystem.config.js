module.exports = {
  apps: [
    {
      name: 'adam-onboard-app',
      script: './dist/main.js',
      watch: false,
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
