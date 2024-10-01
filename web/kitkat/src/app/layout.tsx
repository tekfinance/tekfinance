import clsx from "clsx";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "@unocss/reset/tailwind.css";
import "./global.css";

import Provider from "@/providers";
import { rpcURL } from "@/config";

export const metadata: Metadata = {
  title: "TekBot | Rewarding made fun",
  description:
    "We are tekfinance, we help you reward communities, friends, family and followers with ease.",
};

const defaultFont = Open_Sans({
  subsets: ["latin"],
});

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={clsx(
          defaultFont.className,
          "antialiased fixed inset-0 flex flex-col bg-dark-900 text-white text-[15px]"
        )}
      >
        <Provider rpcURL={rpcURL}>
          <div className="flex-1 flex flex-col md:mx-auto md:min-w-xl">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
