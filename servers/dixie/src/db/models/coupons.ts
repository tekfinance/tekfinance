import {
  boolean,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { ChainEnum } from "../../constants";
import type { CouponSolanaConfig } from "../../types";

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  chain: text("chain", { enum: ChainEnum }).default("solana"),
  title: text("title").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  config: json("config")
    .$type<Omit<CouponSolanaConfig, "recipients">>()
    .notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  user: serial("user")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
