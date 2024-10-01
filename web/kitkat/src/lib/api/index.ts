import xior from "xior";
import {
  CouponApi,
  PointApi,
  RedeemApi,
  SettingsApi,
  TelegramApi,
  TipApi,
  UserApi,
  WalletApi,
} from "./api";

export class Api {
  readonly tip: TipApi;
  readonly user: UserApi;
  readonly point: PointApi;
  readonly coupon: CouponApi;
  readonly redeem: RedeemApi;
  readonly wallet: WalletApi;
  readonly settings: SettingsApi;
  readonly telegram: TelegramApi;

  constructor(
    baseURL: string,
    accessToken: string,
    authorization: string = "tma"
  ) {
    const xiorInstance = xior.create({
      baseURL,
      headers: {
        Authorization: authorization + " " + accessToken,
      },
    });

    this.tip = new TipApi(xiorInstance);
    this.user = new UserApi(xiorInstance);
    this.point = new PointApi(xiorInstance);
    this.coupon = new CouponApi(xiorInstance);
    this.redeem = new RedeemApi(xiorInstance);
    this.wallet = new WalletApi(xiorInstance);
    this.settings = new SettingsApi(xiorInstance);
    this.telegram = new TelegramApi(xiorInstance);
  }
}
