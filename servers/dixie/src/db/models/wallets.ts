import bs58 from "bs58";
import { ethers } from "ethers";
import { Keypair } from "@solana/web3.js";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

import { users } from "./users";
import { Secret } from "../../core";

const secret = new Secret(process.env.SECRET_KEY!);

export const generateAndHashSolanaKeypair = () => {
  const keypair = Keypair.generate();
  return secret.encrypt({
    secretKey: bs58.encode(keypair.secretKey),
  });
};

export const generateAndHashEthereumKeypair = () => {
  const keypair = ethers.Wallet.createRandom();
  return secret.encrypt({ secretKey: keypair.privateKey });
};

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  chain: text("chain", { enum: ["solana", "ethereum"] }).notNull(),
  user: serial("user")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  hash: text("hash").notNull(),
});
