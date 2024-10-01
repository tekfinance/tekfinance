import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  NATIVE_MINT,
  NATIVE_MINT_2022,
} from "@solana/spl-token";

export const truncateAddress = (address: string) =>
  address.slice(0, 6) + "..." + address.slice(address.length - 4);

export const isTokenAccount = (owner: PublicKey) =>
  TOKEN_PROGRAM_ID.equals(owner) || TOKEN_2022_PROGRAM_ID.equals(owner);

export const isNative = (value: string) => {
  const key = new PublicKey(value);
  return (
    SystemProgram.programId.equals(key) ||
    NATIVE_MINT.equals(key) ||
    NATIVE_MINT_2022.equals(key)
  );
};

export const SafeJson = {
  stringify: <T extends object>(value: T, indentation?: number) =>
    JSON.stringify(
      value,
      (_, value) => {
        if (typeof value === "bigint") return value.toString();
        return value;
      },
      indentation
    ),
};
