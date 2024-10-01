import type { z } from "zod";
import { and, eq, or } from "drizzle-orm";

import type { Database } from "../../core";
import {
  generateAndHashEthereumKeypair,
  generateAndHashSolanaKeypair,
  insertUserSchema,
  selectUserSchema,
  settings,
  users,
  wallets,
} from "../../db";

type NonNullable<T> = {
  [K in keyof T]-?: Exclude<T[K], null>;
};

export const upsertUser = async (
  database: Database,
  values: NonNullable<z.infer<typeof insertUserSchema>>
) => {
  const userExists = await database.query.users
    .findFirst({
      where: or(
        and(eq(users.uid, values.uid), eq(users.social, values.social)),
        and(
          eq(users.username, values.username),
          eq(users.social, values.social)
        )
      ),
      columns: { id: true },
    })
    .execute();

  if (!userExists) {
    const solana = generateAndHashSolanaKeypair();
    const ethereum = generateAndHashEthereumKeypair();

    const [user] = await database
      .insert(users)
      .values(values)
      .returning()
      .execute();

    await database.transaction(async (database) => {
      return [
        database
          .insert(settings)
          .values({
            chain: "solana",
            user: user.id,
          })
          .execute(),
        database
          .insert(wallets)
          .values({
            user: user.id,
            chain: "solana",
            hash: solana,
          })
          .execute(),
        database
          .insert(wallets)
          .values({
            user: user.id,
            chain: "ethereum",
            hash: ethereum,
          })
          .execute(),
      ];
    });
  }

  return (await database.query.users.findFirst({
    with: {
      settings: true,
      wallets: true,
    },
    where: or(
      and(eq(users.uid, values.uid), eq(users.social, values.social)),
      and(eq(users.username, values.username), eq(users.social, values.social))
    ),
  }))!;
};

export const updateUser = (
  database: Database,
  user: number,
  values: Partial<z.infer<typeof selectUserSchema>>
) =>
  database
    .update(users)
    .set(values)
    .where(eq(users.id, user))
    .returning()
    .execute();

export const getUserById = (database: Database, id: number) =>
  database.query.users
    .findFirst({
      where: eq(users.id, id),
      with: { wallets: true, settings: true },
    })
    .execute();
