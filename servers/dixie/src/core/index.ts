import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

export * from "./secret";
export * from "./service";
export * from "./repository";

export const createDB = <T extends Record<string, unknown>>(
  url: string,
  schema: T
) => {
  const client = postgres(url);

  return drizzle(client, { schema });
};
