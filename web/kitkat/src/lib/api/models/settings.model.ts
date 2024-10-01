import type { Chain, Locale } from "./config";

export type Settings = {
  id: string;
  locale: Locale;
  chain: Chain;
  user: string;
};
