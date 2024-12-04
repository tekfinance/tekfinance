export type Navigation = {
  subtitle: string;
  navigations: {
    name: string;
  }[];
};

export const footerNavigations: Navigation[] = [
  {
    subtitle: "MarketPlace",
    navigations: [
      {
        name: "Buy Token",
      },
      {
        name: "Sell Token",
      },
    ],
  },
  {
    subtitle: "Resource",
    navigations: [
      {
        name: "Hot News",
      },
      {
        name: "Tek Narrative",
      },
      {
        name: "Creator Info",
      },
    ],
  },
  {
    subtitle: "About Us",
    navigations: [
      {
        name: "Out Commitment",
      },
      {
        name: "Blog",
      },
      {
        name: "Community Learning",
      },
    ],
  },
  {
    subtitle: "Contact Us",
    navigations: [
      {
        name: "Support Center",
      },
      {
        name: "Our Status",
      },
    ],
  },
];
