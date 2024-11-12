import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { ChainEnum, LocaleEnum } from "../../constants";

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  locale: text("locale", { enum: LocaleEnum }).default("en").notNull(),
  chain: text("chain", { enum: ChainEnum }).default("solana").notNull(),
  user: serial("user")
    .references(() => users.id, {onDelete: "cascade"})
    .unique()
    .notNull(),
});
