import { IconType } from "react-icons";
import {
  FaFacebook,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa6";

type Social = {
  icon: IconType;
  href: string;
};

export const defaultSocials: Social[] = [
  {
    icon: FaTelegram,
    href: "https://t.me/tekfinance",
  },
  {
    icon: FaTwitter,
    href: "https://x.com/tek_finance",
  },
];
