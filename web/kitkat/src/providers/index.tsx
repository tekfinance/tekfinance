"use client";

import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

type Props = {
  rpcURL: string;
} & React.PropsWithChildren;

export default function Provider({ children, rpcURL }: Props) {
  return (
    <ConnectionProvider endpoint={rpcURL}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConnectionProvider>
  );
}
