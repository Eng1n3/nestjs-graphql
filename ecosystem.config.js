module.exports = {
  apps: [
    {
      name: 'adam-onboard-app',
      script: './dist/main.js',
      watch: false,
      instances: 1,
      exec_mode: 'cluster',
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
