import type { Chain, SolanaConfig } from "./config";

export type Coupon = {
  id: string;
  chain: Chain;
  title: string;
  image: string;
  description: string;
  config: SolanaConfig,
  enabled: boolean;
  user: string;
  timestamp: string;
};
