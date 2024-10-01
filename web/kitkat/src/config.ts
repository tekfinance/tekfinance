export const apiBaseURL = (process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL)!;
export const debug = Boolean(
  process.env.DEBUG || process.env.NEXT_PUBLIC_DEBUG
)!;
export const rpcURL = (process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL)!;
