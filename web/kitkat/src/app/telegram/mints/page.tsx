"use client";

import { useApi } from "@/composables/useApi";
import MintPage from "@/components/mint/MintPage";
import { useWebApp } from "@/composables/useTelegram";
import { useMintParams } from "@/composables/useMintParams";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function Mint() {
  const { wallet, args } = useMintParams();
  const { api } = useApi();
  const {
    telegram: { useMiniApp },
  } = useWebApp();
  const sdk = useMiniApp();
  console.log("params=", wallet, args);
  const parsedArgs = args ? JSON.parse(args) : undefined;

  return (
    wallet && (
      <MintPage
        wallet={wallet}
        onSelect={async (mint) => {
          if (args) {
            await api.telegram.sendWebhook(
              Object.assign({ action: "selectMint" } as const, parsedArgs),
              mint
            );

            sdk.close();
          }
        }}
      />
    )
  );
}
