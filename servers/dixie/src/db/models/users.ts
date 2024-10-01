import {
  json,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { SocialEnum } from "../../constants";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    uid: text("uid"),
    chat: text("chat"),
    username: text("username"),
    referer: text("referer"),
    social: text("social", { enum: SocialEnum }).default("telegram").notNull(),
    linked: json("linked").$type<string[]>().default([]).notNull(),
    dateJoined: timestamp("date_joined").defaultNow(),
  },
  (column) => ({
    unique_id_and_username: unique("unique_social_and_id")
      .on(column.social, column.id)
      .nullsNotDistinct(),
    unique_social_and_username: unique("unique_social_and_username")
      .on(column.social, column.username)
      .nullsNotDistinct(),
  })
);
