import { apiBaseURL, debug } from "@/config";
import TelegramProvider from "@/providers/TelegramProvider";
import TelegramErrorBoundary from "@/components/TelegramErrorBoundary";
import DebugProvider from "@/providers/DebugProvider";

export default function TelegramRootLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <DebugProvider enabled={debug}>
      <TelegramErrorBoundary>
        <TelegramProvider apiBaseURL={apiBaseURL}>{children}</TelegramProvider>
      </TelegramErrorBoundary>
    </DebugProvider>
  );
}
