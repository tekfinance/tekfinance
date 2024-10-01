import { Input, Markup, type Context } from "telegraf";

import { Dixie } from ".";
import { createQRCode } from "./utils/qrCode";
import { catchRuntimeError } from "./utils/methods";
import { cleanText, readFileSync } from "./utils/formatText";

export const chainReverse = (chain: string) => {
  switch (chain) {
    case "solana":
      return "solana and spl token";
    case "ethereum":
      return "ethereum and src-20 tokens";
    default:
      throw new Error("Unsupported chain");
  }
};

export const onFund = catchRuntimeError(async (context: Context) => {
  const { wallets } = context;
  const address = wallets.solana.publicKey.toBase58();

  const qrCode = await createQRCode(address).toBuffer("png");
  const file = Input.fromBuffer(qrCode);
  const caption = cleanText(
    readFileSync("./locale/en/fund.md", "utf-8")
      .replace("%address%", address)
      .replaceAll("%chain%", chainReverse("solana"))
  );

  if (context.callbackQuery) {
    await context.deleteMessage();
    return context.replyWithPhoto(file, {
      caption,
      parse_mode: "MarkdownV2",
      reply_markup: Markup.inlineKeyboard([
        Markup.button.callback("Back", Dixie.menuCommand),
      ]).reply_markup,
    });
  } else
    return context.replyWithPhoto(file, {
      caption,
      parse_mode: "MarkdownV2",
    });
});
