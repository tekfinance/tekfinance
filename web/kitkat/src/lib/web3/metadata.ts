import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";

import { none, publicKey, some } from "@metaplex-foundation/umi";
import { TokenState } from "@metaplex-foundation/mpl-toolbox";
import {
  type DigitalAsset,
  type DigitalAssetWithToken,
  type JsonMetadata,
  Key,
} from "@metaplex-foundation/mpl-token-metadata";

import { isNative, truncateAddress } from "./utils";

export const deadWallet = publicKey(SystemProgram.programId);
export const optionalDeadWallet = some(publicKey(SystemProgram.programId));

export const getDefaultDigitalAsset = (
  value: string,
  defaults?: { name: string; symbol: string }
): DigitalAsset => {
  const optionalValue = some(publicKey(value));

  const mint: DigitalAsset["mint"] = {
    isInitialized: true,
    mintAuthority: optionalValue,
    freezeAuthority: optionalValue,
    supply: 0n,
    publicKey: publicKey(value),
    decimals: 9,
    header: {
      executable: false,
      owner: deadWallet,
      lamports: {
        basisPoints: 0n,
        identifier: "SOL",
        decimals: 9,
      },
    },
  };

  const metadata: DigitalAsset["metadata"] = {
    uri: "",
    key: Key.MetadataV1,
    isMutable: false,
    updateAuthority: deadWallet,
    sellerFeeBasisPoints: 0,
    mint: publicKey(value),
    name: defaults?.name ?? "UNKNOWN TOKEN",
    symbol: defaults?.symbol ?? truncateAddress(value),
    tokenStandard: none(),
    collection: none(),
    collectionDetails: none(),
    creators: none(),
    editionNonce: none(),
    uses: none(),
    header: {
      executable: false,
      owner: deadWallet,
      lamports: {
        basisPoints: 0n,
        identifier: "SOL",
        decimals: 9,
      },
    },
    primarySaleHappened: true,
    programmableConfig: none(),
    publicKey: publicKey(value),
  };

  return {
    mint,
    metadata,
    publicKey: publicKey(value),
  };
};

export const getDefaultDigitalAssetWithToken = async (
  connection: Connection,
  owner: string,
  ...args: Parameters<typeof getDefaultDigitalAsset>
): Promise<DigitalAssetWithToken> => {
  const account = new PublicKey(owner);
  const digitalAsset = getDefaultDigitalAsset(...args);
  const mint = new PublicKey(digitalAsset.mint.publicKey);

  const tokenAccountAta = isNative(mint.toBase58())
    ? null
    : getAssociatedTokenAddressSync(mint, account);

  const tokenAmount = tokenAccountAta
    ? await connection
        .getTokenAccountBalance(tokenAccountAta)
        .then(({ value }) => ({
          amount: BigInt(value.amount),
          decimals: value.decimals,
        }))
    : {
        amount: BigInt(await connection.getBalance(account)),
        decimals: 9,
      };

  digitalAsset.mint.decimals = tokenAmount.decimals;

  const digitalAssetWithToken = {
    ...digitalAsset,
    token: {
      isNative: some(0n),
      delegatedAmount: 0n,
      mint: digitalAsset.publicKey,
      owner: publicKey(owner),
      amount: tokenAmount.amount,
      state: TokenState.Initialized,
      header: digitalAsset.mint.header,
      publicKey: publicKey(tokenAccountAta ?? account),
      delegate: none<import("@metaplex-foundation/umi").PublicKey>(),
      closeAuthority: none<import("@metaplex-foundation/umi").PublicKey>(),
    },
  };

  digitalAssetWithToken.mint.decimals = tokenAmount.decimals;

  return digitalAssetWithToken;
};

export const getDefaultJsonMetadata = (mint: string): JsonMetadata =>
  isNative(mint)
    ? {
        image:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      }
    : { image: undefined };
