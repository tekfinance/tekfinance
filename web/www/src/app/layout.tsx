import clsx from "clsx";
import "@unocss/reset/tailwind.css";

import type { Metadata, Viewport } from "next";

import "../globals.css";
import { defaultFont } from "@/fonts";
import DefaultHeader from "@/components/DefaultHeader";
import DefaultFooter from "@/components/DefaultFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://tekfinance.vercel.app"),
  title: "Sustainable Finance System On Solana | TekFinance",
  description:
    "Tip, loyalty, reward, airdrop and manage community growth using Solana and other SPL tokens.",
  openGraph: {
    images: ["/banner.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#6AF2CE",
  colorScheme: "dark",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={clsx(
          defaultFont.className,
          "fixed inset-0 flex flex-col bg-black text-white text-[14px] overflow-x-hidden overflow-y-scroll"
        )}
      >
        <div className="flex-1 flex flex-col bg-gradient-to-r from-primary/10 overflow-x-hidden overflow-y-scroll">
          <div className="flex flex-col space-y-32 2xl:self-center">
            <DefaultHeader />
            <div>
              {children}
              <DefaultFooter />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
