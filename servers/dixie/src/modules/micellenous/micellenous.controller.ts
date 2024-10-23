import { isNull, not, SQL, sum } from "drizzle-orm";

import { Database } from "../../core";
import { tips, users } from "../../db";
import { caseWhen, coalesce, integer } from "../../db/functions";

export const getUserStatus = (database: Database, where?: SQL) => {
  const qStatus = database.$with("users").as(
    database
      .select({
        id: users.id,
        active: caseWhen(not(isNull(users.uid)), 1, 0).as("active"),
        inactive: caseWhen(isNull(users.uid), 1, 0).as("inactive"),
        dataJoined: users.dateJoined,
      })
      .from(users)
  );

  return database
    .with(qStatus)
    .select({
      active: coalesce(sum(integer(qStatus.active)), 0).mapWith(Number),
      inactive: coalesce(sum(integer(qStatus.inactive)), 0).mapWith(Number),
    })
    .from(qStatus)
    .where(where);
};

export const getTipStatus = (database: Database, where?: SQL) => {
  const qStatus = database.$with("tips").as(
    database
      .select({
        id: tips.id,
        completed: caseWhen(not(isNull(tips.signature)), 1, 0).as("complete"),
        incomplete: caseWhen(isNull(tips.signature), 1, 0).as("incomplete"),
        timestamp: tips.timestamp,
      })
      .from(tips)
  );

  return database
    .with(qStatus)
    .select({
      completed: coalesce(sum(integer(qStatus.completed)), 0).mapWith(Number),
      incomplete: coalesce(sum(integer(qStatus.incomplete)), 0).mapWith(Number),
    })
    .from(qStatus)
    .where(where);
};
