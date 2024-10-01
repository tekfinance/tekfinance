import { createContext, useMemo } from "react";
import { Api } from "@/lib";

export type ApiContext = {
  api: Api;
};

export const ApiContext = createContext<Partial<ApiContext>>({});

type Props = {
  baseURL: string;
  accessToken: string;
  authorization?: string;
} & React.PropsWithChildren;

export default function ApiProvider({
  baseURL,
  accessToken,
  authorization,
  children,
}: Props) {
  const api = useMemo(
    () => new Api(baseURL, accessToken, authorization),
    [baseURL, accessToken, authorization]
  );

  return <ApiContext.Provider value={{ api }}>{children}</ApiContext.Provider>;
}
