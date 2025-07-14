// Application configuration - uses environment variables when available

// Database configuration for PostgreSQL
export const databaseConfig = {
  url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_CeoRpbVaU05q@ep-holy-mud-a5j0jeek.us-east-2.aws.neon.tech/neondb?sslmode=require"
};