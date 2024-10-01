import type { z } from "zod";
import { count, eq, sum } from "drizzle-orm";

import type { Database } from "../../core";
import { points, type insertPointSchema } from "../../db";

export const createPoint = (
  database: Database,
  values: z.infer<typeof insertPointSchema>
) => database.insert(points).values(values).returning().execute();

export const getPointsByUser = (database: Database, user: number) =>
  database.select().from(points).where(eq(points.user, user)).execute();

export const getPointsAggregrateByUser = (database: Database, user: number) =>
  database
    .select({ points: sum(points.point), count: count(points.user) })
    .from(points)
    .where(eq(points.user, user))
    .groupBy(points.user)
    .execute();
