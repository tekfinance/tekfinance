import { SafeJson } from "../web3/utils";
import { CrudApi } from "./crud";
import { ApiImpl } from "./impl";
import type {
  Coupon,
  Point,
  Redeem,
  Settings,
  Status,
  Tip,
  User,
  Wallet,
} from "./models";

type WebhookArgs = {
  action: "selectMint";
};

export class CouponApi extends CrudApi<Coupon> {
  path = "coupons";
}

export class PointApi extends CrudApi<Point> {
  path = "points";
}

export class RedeemApi extends CrudApi<Redeem> {
  path = "redeems";
}

export class SettingsApi extends CrudApi<Settings> {
  path = "settings";
}

export class TipApi extends CrudApi<Tip> {
  path = "tips";
}

export class UserApi extends CrudApi<User> {
  path = "users";
}

export class WalletApi extends CrudApi<Wallet> {
  path = "wallets";
}

export class TelegramApi extends ApiImpl {
  protected path: string = "telegram";

  sendWebhook<T extends WebhookArgs, U extends object>(args: T, data: U) {
    return this.xior.post(
      this.buildPath("webhook"),
      JSON.parse(SafeJson.stringify({ ...args, data }))
    );
  }
}

export class MicellenousApi extends ApiImpl {
  path = "micellenous";

  getStatus(filter?: Record<string, string>) {
    return this.xior.get<import("./models/status.model").Status>(
      this.buildPathWithQuery(this.buildPath("status"), filter)
    );
  }
}
