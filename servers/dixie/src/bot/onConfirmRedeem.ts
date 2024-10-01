import { Markup } from "telegraf";

import { repository } from "..";
import { Explorer } from "../utils/explorer";
import {
  getCouponById,
  updateCouponById,
  updateCouponByUserAndId,
} from "../modules/coupons/coupon.controller";
import {
  getRedeemByUserAndCoupon,
  createRedeem,
  updateRedeemByUserAndId,
} from "../modules/redeems/redeem.controller";
import { mapWallets } from "../modules/wallets/wallet.controller";

import { catchRuntimeError, cleanText, readFileSync } from "./utils";

export const onConfirmRedeem = catchRuntimeError(async (context) => {
  const {
    authUser,
    repository: { database, connection },
    wallets,
  } = context;

  if (context.callbackQuery && "data" in context.callbackQuery) {
    const [, data] = context.callbackQuery.data
      .split(/(^confirmRedeem)/)
      .filter(Boolean);

    const coupon = await getCouponById(database, data);
    if (coupon && coupon.config.count > 0) {
      if (coupon.enabled) {
        let redeemed = await getRedeemByUserAndCoupon(
          database,
          authUser.id,
          coupon.id
        );

        if (!redeemed || redeemed.status === "error") {
          if (!redeemed)
            [redeemed] = await createRedeem(database, {
              user: authUser.id,
              coupon: coupon.id,
              status: "success",
            });

          const couponWallets = mapWallets(repository, coupon.user.wallets);
          const instructions =
            await couponWallets.solana.createTransferInstructions(connection, {
              amount: coupon.config.amount,
              mint: coupon.config.mint!,
              decimals: coupon.config.decimals!,
              account: wallets.solana.publicKey.toBase58(),
            });

          const versionedTx =
            await couponWallets.solana.createVersionedTransaction(
              connection,
              instructions
            );

          const simulationResults = await connection.simulateTransaction(
            versionedTx
          );

          if (simulationResults.value.err) {
            await updateRedeemByUserAndId(database, authUser.id, redeemed.id, {
              status: "error",
            });
            return context.replyWithMarkdownV2(
              cleanText(
                readFileSync(
                  "./locale/en/transactionError.md",
                  "utf-8"
                ).replace("%logs%", simulationResults.value.logs!.join("\n"))
              )
            );
          }

          const signature = await couponWallets.solana.sendVersionedTransaction(
            connection,
            versionedTx
          );

          await updateCouponById(database, coupon.id, {
            config: {
              ...coupon.config,
              count: coupon.config.count - 1,
            },
          });

          await updateRedeemByUserAndId(database, authUser.id, redeemed.id, {
            signature,
            status: "success",
          });

          return context.editMessageCaption(
            cleanText(
              readFileSync("./locale/en/redeem.md", "utf-8")
                .replace("%username%", coupon.user.username!)
                .replace("%amoun%", coupon.config.amount.toString())
                .replace("%symbol%", coupon.config.symbol!)
            ),
            Markup.inlineKeyboard([
              Markup.button.url("Open explorer", Explorer.txLink(signature)),
            ])
          );
        }
      }
    }
  }
});
