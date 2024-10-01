import crypto from "crypto";
import type { z } from "zod";
import { and, eq, or } from "drizzle-orm";

import type { Database, Repository } from "../../core";
import { SocialEnum, ChainEnum } from "../../constants";
import { SolanaWallet, EthereumWallet } from "../../lib/wallets";
import {
  generateAndHashEthereumKeypair,
  generateAndHashSolanaKeypair,
  users,
  wallets,
  type selectWalletSchema,
} from "../../db";

export const getWalletsByUsernames = async (
  database: Database,
  chain: (typeof ChainEnum)[number],
  social: (typeof SocialEnum)[number],
  usernames: string[]
) => {
  const existingUsers = await database
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(
      or(
        ...usernames.map((username) =>
          and(eq(users.social, social), eq(users.username, username))
        )
      )
    )
    .execute();

  const nonExistingUsers = usernames.filter(
    (username) => !existingUsers.find((user) => user.username === username)
  );

  const newUsers = (
    await database.transaction(async (database) => {
      return Promise.all(
        nonExistingUsers.flatMap((username) =>
          database
            .insert(users)
            .values({
              
              username,
              social,
              id: crypto.randomInt(0, 10000000),
            })
            .returning({ id: users.id, username: users.username })
            .execute()
        )
      );
    })
  ).flat();

  const combinedUsers = [...existingUsers, ...newUsers];

  await database.transaction(async (database) => {
    return Promise.all(
      newUsers.flatMap(async (user) => [
        await database
          .insert(wallets)
          .values({
            user: user.id,
            chain: "solana",
            hash: generateAndHashSolanaKeypair(),
          })
          .execute(),
        await database
          .insert(wallets)
          .values({
            user: user.id,
            chain: "ethereum",
            hash: generateAndHashEthereumKeypair(),
          })
          .execute(),
      ])
    );
  });

  return database.query.wallets.findMany({
    where: or(
      ...combinedUsers.map(({ id }) =>
        and(eq(wallets.user, id), eq(wallets.chain, chain))
      )
    ),
    with: {
      user: {
        columns: {
          username: true,
        }
      }
    }
  });
};

export const getWalletsById = (database: Database, ids: number[]) =>
  database.query.wallets
    .findMany({
      where: or(...ids.map((id) => eq(wallets.id, id))),
      columns: {
        hash: true,
      },
      with: {
        user: true,
      },
    })
    .execute();

export const mapWallets = (
  repository: Repository,
  wallets: z.infer<typeof selectWalletSchema>[]
) => {
  const solana = new SolanaWallet(
    repository.secret,
    wallets.find((wallet) => wallet.chain === "solana")!.hash
  );
  const ethereum = new EthereumWallet(
    repository,
    wallets.find((wallet) => wallet.chain === "ethereum")!.hash
  );

  return {
    solana,
    ethereum,
  };
};
