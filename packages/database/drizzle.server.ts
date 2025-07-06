import { neonConfig, Pool as NeonPool } from "@neondatabase/serverless";
import { drizzle as drizzleNeonServerless } from "drizzle-orm/neon-serverless";
import { Pool as PgPool } from "pg";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

import * as schema from "./src/schema";

let db:
  | ReturnType<typeof drizzleNeonServerless>
  | ReturnType<typeof drizzlePg>
  | null = null;

function initializeDatabase() {
  if (db) return db;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString)
    throw new Error("DATABASE_URL environment variable is required");

  if (process.env.NODE_ENV === "production") {
    neonConfig.fetchConnectionCache = true;
    neonConfig.poolQueryViaFetch = true;
    neonConfig.webSocketConstructor = undefined;

    const pool = new NeonPool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 0,
      connectionTimeoutMillis: 5000,
    });

    db = drizzleNeonServerless(pool, { schema });
  } else {
    const pool = new PgPool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    db = drizzlePg(pool, { schema });
  }

  return db;
}

const databaseProxy = new Proxy({} as ReturnType<typeof initializeDatabase>, {
  get(target, prop) {
    const database = initializeDatabase();
    return database[prop as keyof typeof database];
  },
});

export default databaseProxy;
