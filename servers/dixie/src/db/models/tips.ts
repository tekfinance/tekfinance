import { json, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import type { SolanaConfig } from "../../types";
import { ChainEnum, StatusEnum } from "../../constants";

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  chain: text("chain", { enum: ChainEnum }).default("solana").notNull(),
  configs: json("config").$type<SolanaConfig[]>().notNull(),
  status: text("status", { enum: StatusEnum }).default("idle").notNull(),
  user: serial("user")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  chat: text("chat").notNull(),
  messages: json("messages")
    .default([])
    .$type<{ id: string; type: "private" | "public" }[]>()
    .notNull(),
  signature: text("signature"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
