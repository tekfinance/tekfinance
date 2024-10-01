import type { z } from "zod";

import type { Repository } from "../../core";
import { InternalLinkParams } from "../../utils/link";
import type { upsertUser } from "../users/user.controller";
import {
  getCouponByUserAndId,
  updateCouponByUserAndId,
} from "../coupons/coupon.controller";
import { buildTgURL, buildURL, cleanText, readFileSync } from "../../bot/utils";

import type { selectMintSchema } from "./telegram.schema";

export const processCoupon = async (
  repository: Repository,
  user: Awaited<ReturnType<typeof upsertUser>>,
  { id, data }: z.infer<typeof selectMintSchema>
) => {
  const { database } = repository;
  const [coupon] = await getCouponByUserAndId(database, user.id, id);
  coupon.config.mint = data.mint.publicKey;
  coupon.config.decimals = data.mint.decimals;
  coupon.config.name = data.metadata.name;
  coupon.config.symbol = data.metadata.symbol;
  coupon.config.amount = coupon.config.amount / coupon.config.count;

  await updateCouponByUserAndId(database, user.id, id, {
    config: coupon.config,
  });

  const couponLink = buildURL(
    buildTgURL(repository.bot.botInfo!.username, true),
    {
      start: InternalLinkParams.redeemValue(coupon.id),
    }
  );

  if (user.chat)
    await repository.bot.telegram.sendMessage(
      user.chat,
      cleanText(
        readFileSync("./locale/en/couponLink.md", "utf-8")
          .replace("%amount%", String(coupon.config.amount))
          .replace("%symbol%", data.metadata.symbol)
          .replace("%username%", user.username!)
          .replace("%link%", couponLink)
      ),
      {
        parse_mode: "MarkdownV2",
      }
    );

  return coupon;
};
