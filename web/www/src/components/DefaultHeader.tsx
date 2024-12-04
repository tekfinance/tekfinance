"use client";
import Image from "next/image";

import { IcLogo, IcMenu } from "@/assets";
import { useState } from "react";
import DefaultNavigation from "./DefaultNavigation";
import Link from "next/link";

export default function DefaultHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative">
      <div className="-z-10 absolute inset-x-0 -top-32  w-xs h-xs bg-gradient-to-r from-black via-primary/50 to-black blur-3xl rounded-r-full md:w-sm md:h-sm md:top-24 md:-left-8" />
      <div className="absolute inset-x-0 flex items-center px-4 md:py- z-10">
        <div className="flex space-x-2 items-center">
          <Image
            className="w-16 h-16"
            src={IcLogo}
            alt="TekFinance"
            width={256}
            height={256}
          />
        </div>
        <DefaultNavigation
          open={open}
          setOpen={setOpen}
        />
        <div className="flex space-x-8 items-center">
          <Link
            href="https://t.me/TekFinanceBot"
            target="_blank"
            className="btn border border-primary text-primary rounded-md"
          >
            Launch Bot
          </Link>
          <button
            className="p-2 md:hidden"
            onClick={() => setOpen(true)}
          >
            <Image
              alt="Menu"
              src={IcMenu}
              width={32}
              height={32}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
