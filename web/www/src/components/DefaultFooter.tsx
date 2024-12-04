import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/assets";
import { defaultSocials } from "@/config/social";

export default function DefaultFooter() {
  return (
    <footer className="relative flex flex-col space-y-8 md:space-y-16 p-4 md:px-8">
      <div className="flex flex-col space-y-8 md:flex-row md:space-x-8 md:items-center">
        <div className="flex-1 flex flex-col space-y-8 lt-md:items-center lt-md:justify-center">
          <Image
            src={Logo}
            width={128}
            height={128}
            alt="TekFinance"
          />
          <p className="text-lg lt-md:text-center ">
            Building a sustainable Financial Reward
            <br className="lt-md:hidden" /> System On Solana
          </p>
        </div>
        <div className="self-center flex space-x-2">
          {defaultSocials.map((social, index) => (
            <Link
              key={index}
              href={social.href}
              target="_blank"
              className="bg-dark p-4 rounded-full cursor-pointer"
            >
              {<social.icon className="text-xl" />}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="text-center">
          © Build by TekFinance. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
