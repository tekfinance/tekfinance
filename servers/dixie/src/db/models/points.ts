import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { TaskEnum } from "../../constants";

import { users } from "./users";

export const points = pgTable("points", {
  id: serial("id").primaryKey(),
  task: text("task", { enum: TaskEnum }).notNull(),
  point: integer("point").notNull(),
  user: serial("user").references(() => users.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
