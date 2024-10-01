import { useMemo } from "react";

export const useMintParams = () => {
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  return {
    args: searchParams.get("args"),
    wallet: searchParams.get("wallet"),
  };
};
