import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { databaseConfig } from "./config/app-config";

// Optimize Neon configuration for better performance
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false;
neonConfig.pipelineTLS = false;

// Optimized connection pool configuration
export const pool = new Pool({ 
  connectionString: databaseConfig.url,
  max: 10, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 5000, // 5 seconds connection timeout
});

export const db = drizzle({ client: pool, schema });