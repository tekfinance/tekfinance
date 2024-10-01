import type { Status } from "./config";

export type Redeem = {
  id: string;
  coupon: string;
  user: string;
  status: Status;
  timestamp: string;
};
