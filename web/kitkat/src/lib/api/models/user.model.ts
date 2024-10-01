import type { Social } from "./config";
import { Wallet } from "./wallet.model";
import { Settings } from "./settings.model";

export type User = {
  id: string;
  chat?: string;
  username?: string;
  socials: Social;
  linked: string[];
  referer?: string;
  dateJoined: string;
  settings: Settings;
  wallets: Wallet[];
};
