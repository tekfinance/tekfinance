import type { z } from "zod";
import { and, eq } from "drizzle-orm";

import type { Database } from "../../core";
import { coupons, type insertCouponSchema } from "../../db";

export const createCoupon = (
  database: Database,
  values: z.infer<typeof insertCouponSchema>
) => database.insert(coupons).values(values).returning().execute();

export const updateCouponById = (
  database: Database,
  id: string,
  values: Partial<z.infer<typeof insertCouponSchema>>
) =>
  database
    .update(coupons)
    .set(values)
    .where(and(eq(coupons.id, id)))
    .returning()
    .execute();

export const updateCouponByUserAndId = (
  database: Database,
  user: number,
  id: string,
  values: Partial<z.infer<typeof insertCouponSchema>>
) =>
  database
    .update(coupons)
    .set(values)
    .where(and(eq(coupons.user, user), eq(coupons.id, id)))
    .returning()
    .execute();

export const getCouponsByUser = (database: Database, user: number) =>
  database.select().from(coupons).where(eq(coupons.user, user)).execute();

export const getCouponByUserAndId = (
  database: Database,
  user: number,
  id: string
) =>
  database
    .select()
    .from(coupons)
    .where(and(eq(coupons.user, user), eq(coupons.id, id)))
    .execute();

export const getCouponById = (database: Database, id: string) =>
  database.query.coupons.findFirst({
    where: eq(coupons.id, id),
    with: {
      user: {
        with: {
          wallets: true,
        },
      },
    },
    columns: {
      id: true,
      title: true,
      image: true,
      enabled: true,
      description: true,
      config: true,
    },
  });

export const deleteCouponByUserAndId = (
  database: Database,
  user: number,
  id: string
) =>
  database
    .delete(coupons)
    .where(and(eq(coupons.user, user), eq(coupons.id, id)))
    .returning()
    .execute();
