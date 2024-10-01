export type SolanaConfig = {
  mint?: string;
  symbol?: string;
  name?: string;
  amount: number;
  decimals?: number;
  recipients: { username: string; wallet: number }[];
};

export type CouponSolanaConfig = {
  count: number;
  amount: number;
  mint?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  owner?: string;
};
