import BN from "bn.js";
import { safeBN, unsafeBnToNumber } from "@solocker/safe-bn";

export const toUIAmount = (amount: bigint | BN, decimals: number) => {
  return unsafeBnToNumber(
    safeBN(new BN(amount.toString())).div(new BN(Math.pow(10, decimals)))
  );
};
