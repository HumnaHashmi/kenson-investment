/**
 * Environment configuration
 * Add your environment-specific variables here.
 * Use react-native-config or similar for .env support.
 */

const ENV = {
  development: {
    API_BASE_URL: 'https://dev-api.kensoninvestment.com',
    APP_ENV: 'development',
    LOG_LEVEL: 'debug',
  },
  staging: {
    API_BASE_URL: 'https://staging-api.kensoninvestment.com',
    APP_ENV: 'staging',
    LOG_LEVEL: 'warn',
  },
  production: {
    API_BASE_URL: 'https://api.kensoninvestment.com',
    APP_ENV: 'production',
    LOG_LEVEL: 'error',
  },
};

const getEnv = () => {
  // Replace with your env detection logic (e.g., __DEV__, react-native-config)
  if (__DEV__) return ENV.development;
  return ENV.production;
};

export default getEnv();
