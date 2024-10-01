import type { Chain } from "./config";

export type Wallet = {
  id: string;
  chain: Chain;
  publicKey: string;
};
