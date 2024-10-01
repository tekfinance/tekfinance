import type { Cluster } from "@solana/web3.js";
import { buildURL } from "../bot/utils";

export const Explorer = {
  accountLink: (account: string, cluster: Cluster = "mainnet-beta") =>
    buildURL("https://explorer.solana.com/account", account, { cluster }),
  txLink: (signature: string, cluster: Cluster = "mainnet-beta") =>
    buildURL("https://explorer.solana.com/tx", signature, { cluster }),
};
