"use client";
import { useEffect } from "react";

type Props = {
  enabled: boolean;
} & React.PropsWithChildren;

export default function DebugProvider({ children, enabled }: Props) {
  useEffect(() => {
    if (enabled) import("eruda").then((module) => module.default.init());
  }, [enabled]);

  return children;
}
