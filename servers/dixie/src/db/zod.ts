import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { coupons, points, redeems, users, wallets } from "./models";
import { tips } from "./models/tips";

export const configSchema = z.object({
  mint: z.string().optional(),
  amount: z.number(),
  recipients: z.array(
    z.object({
      wallet: z.number(),
      username: z.string(),
    })
  ),
});

export const couponConfig = configSchema.omit({ recipients: true }).and(
  z.object({
    count: z.number(),
  })
);

export const messageSchema = z.object({
  id: z.string(),
  type: z.literal("private").or(z.literal("public")),
});

export const selectUserSchema = createSelectSchema(users, {
  linked: z.array(z.string()).optional(),
});
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  linked: true,
  dateJoined: true,
  chat: true,
  referer: true
});

export const selectWalletSchema = createSelectSchema(wallets);
export const insertWalletSchema = createInsertSchema(wallets);

export const selectTipSchema = createSelectSchema(tips, {
  messages: z.array(messageSchema),
  configs: z.array(configSchema),
});
export const insertTipSchema = createInsertSchema(tips, {
  messages: z.array(messageSchema),
  configs: z.array(configSchema),
});

export const selectPointSchema = createSelectSchema(points);
export const insertPointSchema = createInsertSchema(points);

export const selectCouponSchema = createSelectSchema(coupons, {
  config: couponConfig,
});
export const insertCouponSchema = createInsertSchema(coupons, {
  config: couponConfig,
});



export const selectRedeemSchema = createSelectSchema(redeems);
export const insertRedeemSchema = createInsertSchema(redeems);
