import Image from "next/image";
import Link from "next/link";
import { MdClose } from "react-icons/md";

import { IcLogo } from "@/assets";
import { defaultNavigations } from "@/config/navigation";
import clsx from "clsx";

type DefaultNavigationProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DefaultNavigation({
  open,
  setOpen,
}: DefaultNavigationProps) {
  return (
    <div className="flex-1 flex">
      <div
        className={clsx(
          "flex-1 lt-md:space-y-8 lt-md:fixed lt-md:inset-0 lt-md:bg-[#06170e] lt-md:px-4",
          [
            open
              ? "lt-md:flex lt-md:flex-col animate-slide-in-up animate-duration-100"
              : "lt-md:hidden lt-md:pointer-events-none",
          ]
        )}
      >
        <header className="flex items-center md:hidden">
          <div className="flex-1">
            <Image
              className="w-16 h-16"
              src={IcLogo}
              alt="TekFinance"
              width={256}
              height={256}
            />
          </div>
          <button className="p-4">
            <MdClose
              className="text-4xl"
              onClick={() => setOpen(false)}
            />
          </button>
        </header>
        <div className="flex lt-md:flex-col lt-md:space-y-8 md:items-center md:justify-center md:space-x-4">
          {defaultNavigations.map((navigation, index) => (
            <Link
              key={index}
              href={navigation.href}
              className="flex space-x-2 px-4 py-2 lt-md:text-center lt-md:font-medium lt-md:hover:text-primary md:hover:text-white/50"
            >
              <span className="text-lg font-mono text-primary md:hidden">
                0{index + 1}.
              </span>
              <span className="lt-md:text-2xl ">{navigation.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
