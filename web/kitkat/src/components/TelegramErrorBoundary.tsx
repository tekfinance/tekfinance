"use client";

import Link from "next/link";
import { MdBolt } from "react-icons/md";
import { ErrorBoundary } from "react-error-boundary";

export default function TelegramErrorBoundary({
  children,
}: React.PropsWithChildren) {
  return (
    <ErrorBoundary
      fallback={<InvalidContext />}
      onError={(error, info) => {
        console.error(error);
        console.error(info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

function InvalidContext() {
  return (
    <div className="flex flex-col lt-md:flex-1 md:min-h-xl md:m-auto">
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full">
          <MdBolt className="text-xl text-black" />
        </div>
        <div className="flex flex-col  max-w-xs md:max-w-sm md:text-center">
          <h1 className="text-lg font-medium">
            Oops! This is page is not opened from telegram
          </h1>
          <p className="text-sm text-black/75">
            Make sure you are opening this page from our telegram web app. Click
            the bot below to open on telegram.
          </p>
        </div>
      </div>
      <div className="flex flex-col px-4 py-4">
        <Link
          href="https://t.me/SolTransfer_Bot"
          className="flex items-center justify-center bg-black text-white p-3 rounded"
        >
          Open Bot
        </Link>
      </div>
    </div>
  );
}
