import type { z } from "zod";
import { and, eq } from "drizzle-orm";

import type { Database } from "../../core";
import type { insertTipSchema } from "../../db";
import { tips } from "../../db/models/tips";

export const createTip = (
  database: Database,
  values: z.infer<typeof insertTipSchema>
) => database.insert(tips).values(values).returning().execute();

export const updateTipByUserAndId = (
  database: Database,
  user: number,
  id: number,
  values: Partial<z.infer<typeof insertTipSchema>>
) =>
  database
    .update(tips)
    .set(values)
    .where(and(eq(tips.user, user), eq(tips.id, id)))
    .returning()
    .execute();

export const getTipsByUser = (database: Database, user: number) =>
  database.select().from(tips).where(eq(tips.user, user)).execute();

export const getTipByUserAndId = (
  database: Database,
  user: number,
  id: number
) =>
  database
    .select()
    .from(tips)
    .where(and(eq(tips.user, user), eq(tips.id, id)))
    .execute();
