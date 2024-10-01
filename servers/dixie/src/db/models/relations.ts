import { relations } from "drizzle-orm";

import { tips } from "./tips";
import { users } from "./users";
import { points } from "./points";
import { coupons } from "./coupons";
import { wallets } from "./wallets";
import { redeems } from "./redeems";
import { settings } from "./settings";

export const userRelations = relations(users, ({ many, one }) => ({
  wallets: many(wallets),
  referals: many(users),
  tips: many(tips),
  coupons: many(coupons),
  settings: one(settings),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, { fields: [settings.user], references: [users.id] }),
}));

export const walletRelations = relations(wallets, ({ one }) => ({
  user: one(users, { fields: [wallets.user], references: [users.id] }),
}));

export const tipRelations = relations(tips, ({ one }) => ({
  user: one(users, { fields: [tips.user], references: [users.id] }),
}));

export const pointRelations = relations(points, ({ one }) => ({
  user: one(users, { fields: [points.user], references: [users.id] }),
}));

export const couponRelations = relations(coupons, ({ one, many }) => ({
  user: one(users, { fields: [coupons.user], references: [users.id] }),
  redeems: many(redeems),
}));

export const redeemRelations = relations(redeems, ({ one }) => ({
  user: one(users, { fields: [redeems.user], references: [users.id] }),
  coupon: one(coupons, { fields: [redeems.coupon], references: [coupons.id] }),
}));
