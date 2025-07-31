import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Supabase configuration
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // API configuration
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  // Logging configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Security configuration
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  
  // File upload configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10mb',
  
  // Validation configuration
  PHONE_NUMBER_REGEX: /^\+?[1-9]\d{1,14}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Business logic configuration
  DEFAULT_PATIENT_LANGUAGE: process.env.DEFAULT_PATIENT_LANGUAGE || 'English',
  DEFAULT_WHATSAPP_OPT_IN: process.env.DEFAULT_WHATSAPP_OPT_IN === 'false' ? false : true,
  DEFAULT_DOCTOR_CONSULTATION_MODE: process.env.DEFAULT_DOCTOR_CONSULTATION_MODE || 'Both'
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_KEY', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Check if environment is production
export const isProduction = () => config.NODE_ENV === 'production';

// Check if environment is development
export const isDevelopment = () => config.NODE_ENV === 'development';

// Check if environment is test
export const isTest = () => config.NODE_ENV === 'test'; 