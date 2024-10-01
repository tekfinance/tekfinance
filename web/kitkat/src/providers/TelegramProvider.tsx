"use client";

import { createContext, useEffect } from "react";
import { SDKProvider, postEvent } from "@telegram-apps/sdk-react";

import ApiProvider from "./ApiProvider";
import AuthProvider from "./AuthProvider";
import { useTelegram, useWebApp } from "@/composables/useTelegram";

export type TelegramContext = {
  telegram: NonNullable<Awaited<ReturnType<typeof useTelegram>>>;
};

export const TelegramContext = createContext<Partial<TelegramContext>>({});

type Props = {
  apiBaseURL: string;
} & React.PropsWithChildren;

export default function TelegramProvider({ children, apiBaseURL }: Props) {
  const telegram = useTelegram();

  return (
    <SDKProvider>
      {telegram && (
        <TelegramContext.Provider value={{ telegram }}>
          <Component apiBaseURL={apiBaseURL}>{children}</Component>
        </TelegramContext.Provider>
      )}
    </SDKProvider>
  );
}

function Component({ apiBaseURL, children }: Omit<Props, "debug">) {
  const { telegram } = useWebApp();
  const initData = telegram.retrieveLaunchParams();

  useEffect(() => {
    postEvent("web_app_expand");
  }, [telegram]);

  return (
    <ApiProvider
      baseURL={apiBaseURL}
      accessToken={initData.initDataRaw!}
    >
      <AuthProvider>{children}</AuthProvider>
    </ApiProvider>
  );
}
