import {
  pgTable,
  text,
  timestamp,
  unique,
  serial,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { coupons } from "./coupons";
import { StatusEnum } from "../../constants";

export const redeems = pgTable(
  "redeems",
  {
    id: serial("id").primaryKey(),
    coupon: uuid("coupon")
      .references(() => coupons.id, { onDelete: "cascade" })
      .notNull(),
    user: serial("user")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    status: text("status", { enum: StatusEnum }).default("idle").notNull(),
    signature: text("signature"),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (column) => ({
    coupon_per_user: unique("coupon_per_user").on(column.coupon, column.user),
  })
);
