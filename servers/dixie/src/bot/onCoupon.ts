import { z } from "zod";
import { Markup, Scenes, type Context } from "telegraf";

import { Dixie } from ".";
import type { Repository } from "../core";
import { createCoupon } from "../modules/coupons/coupon.controller";
import { buildURL, catchRuntimeError, cleanText, readFileSync } from "./utils";

const couponSchema = z.object({
  count: z.number(),
});

export const onCoupon = catchRuntimeError(async (context) => {
  const message = context.message;
  if (message && "text" in message) {
    const [, count] = message.text.split(/\s/g);

    if (Number.isNaN(Number(count)))
      return context.replyWithMarkdownV2(
        readFileSync("./locale/en/couponInvalidCommand.md")
      );

    return couponSchema
      .parseAsync({ count: Number(count) })
      .then(({ count }) => {
        context.session = {
          count,
        };

        return context.scene.enter(Dixie.couponScene);
      });
  }
});

export const createCouponScene = (repository: Repository) => {
  const { database, config } = repository;

  const scene = new Scenes.WizardScene<Scenes.WizardContext & Context>(
    Dixie.couponScene,
    async (context) => {
      context.scene.session.state = {
        ...context.session,
      };

      await context.replyWithMarkdownV2(
        cleanText(readFileSync("./locale/en/couponTitle.md", "utf-8"))
      );

      return context.wizard.next();
    },
    async (context) => {
      const message = context.message;
      if (message && "text" in message) {
        const title = message.text;
        context.scene.session.state = {
          ...context.scene.session.state,
          title,
        };

        await context.replyWithMarkdownV2(
          cleanText(readFileSync("./locale/en/couponDescription.md", "utf-8"))
        );

        return context.wizard.next();
      }
    },
    async (context) => {
      const message = context.message;

      if (message && "text" in message) {
        const description = message.text;
        context.scene.session.state = {
          ...context.scene.session.state,
          description,
        };

        await context.replyWithMarkdownV2(
          cleanText(readFileSync("./locale/en/couponAmount.md", "utf-8"))
        );

        return context.wizard.next();
      }
    },
    async (context) => {
      const message = context.message;

      if (message && "text" in message) {
        const amount = message.text;
        context.scene.session.state = {
          ...context.scene.session.state,
          amount,
        };

        await context.replyWithMarkdownV2(
          cleanText(readFileSync("./locale/en/couponImage.md", "utf-8"))
        );

        return context.wizard.next();
      }
    },
    async (context) => {
      const message = context.message;

      if (message && "photo" in message) {
        const [file] = message.photo;
        const image = await context.telegram.getFileLink(file.file_id);

        const { title, description, amount, count } = context.scene.session
          .state! as unknown as Record<string, any>;

        const [coupon] = await createCoupon(database, {
          title,
          description,
          image: image.toString(),
          user: context.authUser.id,
          config: {
            amount,
            count,
          },
        });

        const selectMintURL = buildURL(config.appURL, "telegram/mints", {
          wallet: context.wallets.solana.publicKey.toBase58(),
          args: JSON.stringify({
            id: coupon.id,
            type: "coupon",
          }),
        });

        await context.replyWithMarkdownV2(
          cleanText(readFileSync("./locale/en/couponSelectMint.md", "utf-8")),
          Markup.inlineKeyboard([
            Markup.button.webApp("Select mint", selectMintURL),
          ])
        );

        return context.scene.leave();
      } else
        return context.replyWithMarkdownV2(
          cleanText(readFileSync("./locale/en/couponImageRequired.md", "utf-8"))
        );
    }
  );

  return scene;
};
