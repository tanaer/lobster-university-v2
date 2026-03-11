import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import * as lobsterSchema from "./schema-lobster";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./lobster.db",
});

export const db = drizzle(client, { schema: { ...schema, ...lobsterSchema } });

export * from "./schema";
export * from "./schema-lobster";
