"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { DigitalAssetWithToken } from "@metaplex-foundation/mpl-token-metadata";

import { fetchTokenPorfolio } from "@/lib/web3/portfolio";

import Loading from "../Loading";
import MintInfo from "./MintInfo";
import MintInfoSkeleton from "./MintInfo.skeleton";

type Props = {
  wallet: string;
  onSelect: (selected: DigitalAssetWithToken) => Promise<void>;
};

export default function MintPage({ wallet, onSelect }: Props) {
  const { connection } = useConnection();
  const umi = useMemo(() => createUmi(connection), [connection]);

  const { isPending, data, error } = useQuery({
    queryKey: [wallet],
    queryFn: () => fetchTokenPorfolio(connection, umi, wallet!),
  });

  return (
    <main className="flex-1  flex flex-col p-4">
      <div className="flex-1 flex flex-col space-y-4">
        <nav className="flex bg-dark-700 p-1 rounded-md">
          <button className="flex-1 bg-cyan-500 text-black p-2 rounded hover:bg-cyan active:bg-cyan-500">
            Mint
          </button>
          <button className="flex-1  text-white/75">NFT</button>
        </nav>
        <div className="flex-1 flex flex-col space-y-2">
          {isPending ? (
            <MintInfoSkeleton items={24} />
          ) : (
            data &&
            data.map((info) => (
              <MintItem
                key={info.publicKey}
                info={info}
                onSelect={onSelect}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

type MintItemProps = {
  info: DigitalAssetWithToken;
  onSelect: (selected: DigitalAssetWithToken) => Promise<void>;
};

function MintItem({ info, onSelect }: MintItemProps) {
  const [loading, setLoading] = useState(false);

  return (
    <MintInfo
      info={info}
      disabled={loading}
      onSelect={async () => {
        setLoading(true);
        await onSelect(info).finally(() => setLoading(false));
      }}
      action={loading && <Loading />}
    />
  );
}
