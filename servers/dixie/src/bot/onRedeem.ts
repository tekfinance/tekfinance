import { Input, Markup } from "telegraf";

import { Dixie } from "../bot";
import { getCouponById } from "../modules/coupons/coupon.controller";

import { catchRuntimeError, cleanText, readFileSync } from "./utils";

export const onRedeem = catchRuntimeError(async (context) => {
  const id = context.session.value;
  const {
    repository: { database },
  } = context;

  if (id) {
    const coupon = await getCouponById(database, id);
    if (coupon) {
      return context.sendPhoto(Input.fromURLStream(coupon.image), {
        caption: cleanText(
          readFileSync("./locale/en/couponRedeem.md", "utf-8")
            .replace("%title%", coupon.title)
            .replace("%description%", coupon.description)
            .replace("%username%", coupon.user.username!)
        ),
        parse_mode: "MarkdownV2",
        reply_markup:
          coupon.enabled && coupon.config.count > 0
            ? Markup.inlineKeyboard([
                Markup.button.callback(
                  "Redeem " + coupon.config.amount + " " + coupon.config.symbol,
                  Dixie.confirmRedeemCommand + coupon.id
                ),
              ]).reply_markup
            : undefined,
      });
    } else
      return context.replyWithMarkdownV2(
        readFileSync("./locale/en/couponInvalid.md")
      );
  }
});
