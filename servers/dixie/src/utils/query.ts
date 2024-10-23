import {
  and,
  Column,
  eq,
  gt,
  gte,
  like,
  lt,
  lte,
  ne,
  or,
  SQL,
} from "drizzle-orm";
import { normalizeValue } from "./normalize";

export const Grammer = {
  eq,
  lt,
  lte,
  gt,
  gte,
  like,
  ne,
};

export const mapFilters = function (column: Column) {
  return (filters: string[], value: any) => {
    const queries: SQL[] = [];
    const cleanValue = normalizeValue(column, value);

    if (filters.length === 0) return eq(column, cleanValue);

    for (const filter of filters) {
      if (filter in Grammer) {
        const grammer = Grammer[filter as unknown as keyof typeof Grammer](
          column,
          cleanValue
        );
        queries.push(grammer);
      } else queries.push(eq(column, value));
    }

    if (queries.length > 0) return or(...queries);
    return queries.at(0);
  };
};

export type QueryBuilder = {
  [key: string]: (filter: string[], value: string) => SQL | undefined;
};

export const queryBuilder = <T extends QueryBuilder>(
  builder: T,
  condition: typeof and | typeof or = and
) => {
  return (query: Record<string, string>) => {
    const sqlWrappers: (SQL | undefined)[] = [];

    for (const [key, value] of Object.entries(query)) {
      const [column, ...filters] = key.split("__");
      if (column in builder) {
        const results = builder[column](filters, value);
        sqlWrappers.push(results);
      }
    }
    if (sqlWrappers.length > 0) return condition(...sqlWrappers);

    return sqlWrappers.at(0);
  };
};
