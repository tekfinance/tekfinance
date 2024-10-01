import { NATIVE_MINT } from "@solana/spl-token";
import {
  SystemProgram,
  type Connection,
  type PublicKey,
} from "@solana/web3.js";

import { publicKey, type Umi } from "@metaplex-foundation/umi";
import { fetchAllDigitalAssetWithTokenByOwner } from "@metaplex-foundation/mpl-token-metadata";

import { getDefaultDigitalAssetWithToken } from "./metadata";

export const fetchTokenPorfolio = async (
  connection: Connection,
  umi: Umi,
  account: string | PublicKey
) => {
  const nonNativeTokens = await fetchAllDigitalAssetWithTokenByOwner(
    umi,
    publicKey(account)
  );

  const nativeToken = await getDefaultDigitalAssetWithToken(
    connection,
    publicKey(account),
    SystemProgram.programId.toBase58(),
    { name: "Solana", symbol: "SOL" }
  );

  return [nativeToken, ...nonNativeTokens];
};
