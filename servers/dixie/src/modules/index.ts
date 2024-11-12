import { Service } from "../core";

import { TipRoute } from "./tips/tip.route";
import { UserRoute } from "./users/user.route";
import { PointRoute } from "./points/point.route";
import { WalletRoute } from "./wallets/wallet.route";
import { CouponRoute } from "./coupons/coupon.route";
import { TelegramRoute } from "./telegram/telegram.route";
import { MicellenousRoute } from "./micellenous/micellenous.route";

export class Api extends Service {
  register() {
    const Routes = [
      UserRoute,
      WalletRoute,
      TipRoute,
      CouponRoute,
      TelegramRoute,
      PointRoute,
      MicellenousRoute,
    ];
    Routes.map((Route) => {
      const route = new Route(this.repository);
      route.register(this.repository.server);
    });
  }
}
