import { TelegramContext } from "@/providers/TelegramProvider";
import { useContext, useEffect, useState } from "react";

export const useTelegram = function () {
  const [module, setModule] =
    useState<typeof import("@telegram-apps/sdk-react")>();

  useEffect(() => {
    import("@telegram-apps/sdk-react").then((module) => setModule(module));
  }, []);

  return module;
};

export const useWebApp = () =>
  useContext(
    TelegramContext
  ) as import("@/providers/TelegramProvider").TelegramContext;
