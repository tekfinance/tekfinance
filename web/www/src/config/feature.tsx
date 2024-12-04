import { IcCommunities, IcOrganisation, IcUsers } from "@/assets";

type Feature = {
  image: typeof import("*.png");
  title: string;
  description: React.ReactNode;
};

export const homeFeatures: Feature[] = [
  {
    image: IcUsers,
    title: "Personal",
    description:
      "Users can easily transfer cryptocurrencies to their contacts using the platform",
  },
  {
    image: IcCommunities,
    title: "Community",
    description: (
      <>
        Community managers and project managers
        can use this bot to randomly tip their 
        community members, Perhaps during games
        or when tasks are completed
      </>
    ),
  },
  {
    image: IcOrganisation,
    title: "Organisation",
    description:
      "Organisations can use TekBot to pay salaries and reward workers during award events",
  },
];
