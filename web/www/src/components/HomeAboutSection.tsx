import clsx from "clsx";

import Image from "next/image";
import { IcLogo } from "@/assets";
import { homeAbouts } from "@/config/about";

export default function HomeAboutSection() {
  return (
    <section className="flex flex-col space-y-16 p-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center md:justify-center space-x-2">
          <h1 className="text-2xl font-medium">
            About <span className="text-primary">Tek Finance</span>
          </h1>
          <Image
            src={IcLogo}
            width={48}
            height={48}
            alt="tek finance"
          />
        </div>
        <div className="flex flex-col space-y-4">
          <h1 className="text-xl uppercase text-primary md:hidden">Our Ethos</h1>
          <div className="flex flex-col space-y-2 md:self-center md:max-w-lg text-cyan-50">
            <p className="md:text-center">
              TekFinance is a crypto reward, gifting and distribution system for
              friends, families , influencers, group managers, founders,
              developers and more. <br className="lt-md:hidden" /> Beyond just
              rewarding and tipping, we offer loyalty programs through our open
              loyalty initiatives.
            </p>
            <p className="md:text-center">
              TekBot is powered by TekFinance, designed specifically as an
              decentralized management tool in Telegram groups and Discord
              server for rewarding users in Sol and other SPL tokens.
            </p>
            <p className="md:text-center">
              The idea behind TekFinance tipping bot is to enable users to send
              zero-fee digital assets payment using social tags to enhance
              community engagement with no wallet app installs necessary.
            </p>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col space-y-8">
        <h1 className="text-xl uppercase md:text-xl">Why use us?</h1>
        <div className="self-center grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {homeAbouts.map((about, index) => (
            <div
              key={index}
              className={clsx(
                "min-h-40 flex flex-col space-y-4 bg-gradient-to-r px-4 py-8 rounded-xl backdrop-blur-3xl lg:w-sm",
                [
                  index % 2 == 0
                    ? "from-dark via-secondary/20 to-secondary/50"
                    : "border border-secondary bg-stone-950",
                ]
              )}
            >
              <h1 className="flex-1 text-lg font-bold pr-16 capitalize">
                {about.title}
              </h1>
              <p>{about.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
