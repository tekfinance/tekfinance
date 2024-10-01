import { Chain, SolanaConfig, Status } from "./config";

export type Tip = {
  id: string;
  chain: Chain;
  config: SolanaConfig[];
  status: Status;
  user: string;
  signature: string;
  timestamp: string;
};
