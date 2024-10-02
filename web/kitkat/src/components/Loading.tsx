import clsx from "clsx";

import type { PropsWithClassName } from "@/types";

export default function Loading({ className }: PropsWithClassName) {
  return (
    <div
      className={clsx(
        "w-4 h-4 border-2 border-t-transparent border-violet-500 rounded-full animate-spin",
        className
      )}
    />
  );
}
