import { and } from "drizzle-orm";
import { tips, users } from "../../db";
import { queryBuilder, mapFilters } from "../../utils/query";

export const userFilter = queryBuilder(
  {
    timestamp: mapFilters(users.dateJoined),
  },
  and
);

export const tipFilter = queryBuilder(
  {
    timestamp: mapFilters(tips.timestamp),
  },
  and
);
