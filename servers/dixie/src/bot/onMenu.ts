import { Markup, type Context } from "telegraf";

import { Dixie } from "../bot";
import { Explorer } from "../utils/explorer";
import { buildURL, catchRuntimeError, cleanText, readFileSync } from "./utils";

export const onMenu = catchRuntimeError(async (context: Context) => {
  const {
    wallets,
    repository: { config, connection },
  } = context;

  const address = wallets.solana.publicKey.toBase58();
  const solanaBalance =
    (await connection.getBalance(wallets.solana.publicKey)) / Math.pow(10, 9);

  const balanceLink = buildURL(config.appURL, "telegram/mints", {
    wallet: address,
  });

  const message = cleanText(
    readFileSync("./locale/en/menu.md", "utf-8")
      .replace("%balance%", solanaBalance.toString())
      .replace("%address%", address)
  );
  const buttons = Markup.inlineKeyboard([
    [
      Markup.button.callback("Wallet", Dixie.fundCommand),
      // Markup.button.callback("Referal Link", Dixie.referCommand),
    ],
    [Markup.button.webApp("Token Balance", balanceLink)],
    [
      Markup.button.url(
        "Open Explorer",
        Explorer.accountLink(address)
      ),
    ],
    [Markup.button.callback("Settings", Dixie.settingsCommand)],
  ]);

  if (context.callbackQuery) await context.deleteMessage();
  return context.replyWithMarkdownV2(message, buttons);
});
