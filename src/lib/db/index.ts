import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import * as lobsterSchema from "./schema-lobster";
import * as eventsSchema from "./schema-events";

const client = createClient({
  url: process.env.DATABASE_URL || "file:./lobster.db",
});

export const db = drizzle(client, {
  schema: { ...schema, ...lobsterSchema, ...eventsSchema },
});

export * from "./schema";
export * from "./schema-lobster";
export * from "./schema-events";
