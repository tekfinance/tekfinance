import { z } from "zod";
import { and, eq } from "drizzle-orm";

import type { Database } from "../../core";
import { insertRedeemSchema, redeems } from "../../db";

export const createRedeem = (
  database: Database,
  values: z.infer<typeof insertRedeemSchema>
) => database.insert(redeems).values(values).returning().execute();

export const getRedeemByUserAndCoupon = (
  database: Database,
  user: number,
  coupon: string
) =>
  database.query.redeems.findFirst({
    where: and(eq(redeems.user, user), eq(redeems.coupon, coupon)),
  });

export const updateRedeemByUserAndId = (
  database: Database,
  user: number,
  id: number,
  values: Partial<z.infer<typeof insertRedeemSchema>>
) =>
  database
    .update(redeems)
    .set(values)
    .where(and(eq(redeems.user, user), eq(redeems.id, id)));
