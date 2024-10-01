export type Chain = "solana" | "ethereum";
export type Task = "tip" | "refer" | "coupon";
export type Status = "idle" | "pending" | "error" | "success";
export type Locale = "en";
export type Social = "telegram" | "discord";

export type SolanaConfig = {
  mint: string;
  amount: string;
  usernames: string[];
};
