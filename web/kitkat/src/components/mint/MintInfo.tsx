import xior from "xior";
import { useQuery } from "@tanstack/react-query";
import type { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";

import clsx from "clsx";
import Image from "next/image";

import { isNative } from "@/lib/web3/utils";
import { toUIAmount } from "@/lib/web3/number";
import { getDefaultJsonMetadata } from "@/lib/web3/metadata";

type Props = {
  disabled: boolean;
  info: DigitalAssetWithToken;
  onSelect: React.Dispatch<React.SetStateAction<DigitalAssetWithToken>>;
  action?: React.ReactNode;
};

export default function MintInfo({ disabled, info, onSelect, action }: Props) {
  const {
    mint: { decimals, publicKey },
    token: { amount },
    metadata: { name, symbol, uri },
  } = info;

  const { isPending, data } = useQuery({
    queryKey: [uri],
    queryFn: () => {
      return isNative(publicKey)
        ? getDefaultJsonMetadata(publicKey)
        : xior.get(uri).then(({ data }) => data);
    },
  });

  return (
    <div
      className={clsx(
        "flex items-center space-x-2 bg-black/10 p-2 rounded-md  hover:bg-black/20 active:bg-black/10",
        [disabled ? "cursor-none" : "cursor-pointer"]
      )}
      onClick={() => {
        if (disabled) return;
        else onSelect(info);
      }}
    >
      {isPending ? (
        <div className="w-8 h-8 bg-black/20 animate-pulse rounded-full" />
      ) : data ? (
        <Image
          src={data.image}
          alt={name}
          width={32}
          height={32}
          crossOrigin="anonymous"
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div />
      )}
      <div className="flex-1 flex flex-col text-start">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-black/75">
          {toUIAmount(amount, decimals)} {symbol}
        </p>
      </div>
      {action}
    </div>
  );
}
