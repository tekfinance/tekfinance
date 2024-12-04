import Image from "next/image";

import { Orbit, Robot } from "@/assets";

export default function HomeHeroSection() {
  return (
    <section className="flex flex-col space-y-8 px-8">
      <div className="flex flex-col space-y-8 md:flex-row md:items-center">
        <div className="flex-1 flex flex-col space-y-8">
          <div className="flex flex-col space-y-2 lt-md:text-center md:space-y-4">
            <h1 className="text-4xl font-medium md:text-6xl">
              Building A <br className="lt-md:hidden" /> Sustainable
              <br className="lt-md:hidden" /> Financial
              <span className="text-primary"> System</span>
            </h1>
            <p>
              A telegram and discord based tipping bot, enable users
              <br className="lt-md:hidden" /> send and tip Solana and other SPL
              tokens
            </p>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center">
          <div className="z-0 absolute bg-gradient-to-r from-primary/30 to-primary/50 w-sm h-sm md:w-lg md:h-lg rounded-full blur-3xl md:-right-40" />
          <Image
            src={Orbit}
            width={512}
            height={512}
            alt="orbit"
          />
          <Image
            src={Robot}
            width={1024}
            height={1024}
            alt="Tek Bot"
            className="absolute md:w-2xl md:h-2xl"
          />
        </div>
      </div>
      <h1 className="text-xl font-medium text-center capitalize">
        Providing trust and Confidence <br className="md:hidden" /> for
        <br className="lt-md:hidden" /> long term projects and communities on
        <br className="md:hidden" />
        <span className="text-primary"> Tek Finance</span>
      </h1>
    </section>
  );
}
