import { PublicKey, SystemProgram } from "@solana/web3.js";

export const isNative = (mint: string) =>
  SystemProgram.programId.equals(new PublicKey(mint));
