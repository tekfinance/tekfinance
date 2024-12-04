import Image from "next/image";
import { homeFeatures } from "@/config/feature";

export default function HomeFeatureSection() {
  return (
    <section className="relative flex flex-col space-y-8">
      <div className="flex  snap-x overflow-x-scroll flex-nowrap px-8 lt-md:flex-col  lt-md:space-y-4 md:space-x-4">
        {homeFeatures.map((feature, index) => (
          <div
            key={index}
            className={
              "shrink-0 snap-center flex flex-col space-y-4  p-4 md:px-8 rounded-xl backdrop-blur-3xl md:w-96 hover:!bg-gradient-to-b hover:!from-secondary hover:!to-primary bg-gradient-to-r bg-secondary/10 bg-black/10  border-gradient cursor-pointer  md:w-84"
            }
          >
            <div className="flex-1 flex flex-col space-y-4">
              <Image
                src={feature.image}
                width={32}
                height={32}
                alt={feature.title}
              />
              <div className="flex-1 flex flex-col space-y-4">
                <h1 className="text-2xl font-medium">{feature.title}</h1>
                <p className="text-sm text-white/80 whitespace-pre-line capitalize">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="-z-30 absolute top-64 self-center w-xl h-xl bg-secondary/30 rounded-full blur-3xl md:w-sm md:h-sm md:top-24" />
    </section>
  );
}
