import type { Scenes } from "telegraf";

import * as models from "./db/models";
import type { createDB, Repository } from "./core";
import type { upsertUser } from "./modules/users/user.controller";
import { EthereumWallet, SolanaWallet } from "./lib/wallets";

type User = NonNullable<Awaited<ReturnType<typeof upsertUser>>>;
type Wallet = {
  solana: SolanaWallet;
  ethereum: EthereumWallet;
};

declare module "telegraf" {
  interface Context extends Scenes.WizardContext {
    authUser: User;
    repository: Repository;
    wallets: Wallet;
    session: Record<string, any>;
  }
}

declare module "fastify" {
  interface PassportUser extends User {}
}

declare module "./core/repository" {
  type Config = {
    rpcURL: string;
    secret: string;
    appURL: string;
    port: number;
    host: string;
    domain?: string;
  };

  type Database = ReturnType<typeof createDB<typeof models>>;
}
