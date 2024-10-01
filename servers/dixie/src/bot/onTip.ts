import { z } from "zod";
import { Markup, type Context } from "telegraf";

import type { messageSchema } from "../db";
import {
  createTip,
  updateTipByUserAndId,
} from "../modules/tips/tip.controller";
import {
  buildTgURL,
  buildURL,
  catchRuntimeError,
  checkTippedUsers,
  cleanText,
  formatList,
  parseTip,
  readFileSync,
} from "./utils";
import { getWalletsByUsernames } from "../modules/wallets/wallet.controller";

const tipCommandSchema = z.array(
  z.tuple([z.number(), z.array(z.string().startsWith("@"))])
);

export const onTip = catchRuntimeError(async (context: Context) => {
  const message = context.message;
  const authUser = context.authUser;
  const { config, database } = context.repository;
  const tgBotURL = buildTgURL(context.botInfo.username);
  const openTgBotURL = buildURL(tgBotURL, {
    start: message?.from.id,
  });
  const messages: z.infer<typeof messageSchema>[] = [];

  if (!authUser.chat)
    return context.replyWithMarkdownV2(
      cleanText(
        readFileSync("./locale/en/setup.md", "utf-8").replace(
          "%username%",
          authUser.username!
        )
      ),
      Markup.inlineKeyboard([Markup.button.url("Open Bot", openTgBotURL)])
    );

  if (message && "text" in message) {
    const commands = await tipCommandSchema.parseAsync(parseTip(message.text));

    if (commands.length === 0)
      return context.replyWithMarkdownV2(
        readFileSync("./locale/en/tipInvalidCommand.md")
      );

    const configs = await Promise.all(
      commands.map(async ([amount, usernames]) => {
        return {
          amount,
          recipients: (
            await getWalletsByUsernames(
              database,
              "solana",
              "telegram",
              usernames.map((username) => username.replace(/^@/, ""))
            )
          ).flatMap(({ id, user: { username } }) => ({
            wallet: id,
            username: username!,
          })),
        };
      })
    );

    const [tip] = await createTip(database, {
      configs,
      messages: [],
      user: authUser.id!,
      chat: String(message.chat!.id),
    });

    const [usernames, tippedUsernames] = checkTippedUsers(
      message.text,
      commands
    );

    if (usernames.length !== tippedUsernames.length) {
      const untippedUsers = usernames.filter(
        (username) => !tippedUsernames.includes(username)
      );

      return context.replyWithMarkdownV2(
        cleanText(
          readFileSync("./locale/en/tipError.md", "utf-8").replace(
            "%usernames%",
            formatList(untippedUsers)
          )
        )
      );
    }

    const selectMintURL = buildURL(config.appURL, "telegram/mints", {
      wallet: context.wallets.solana.publicKey.toBase58(),
      args: JSON.stringify({
        id: tip.id,
        type: "tip",
      }),
    });

    if (message.chat.type !== "private") {
      const notifyChatMessage = await context.replyWithMarkdownV2(
        cleanText(
          readFileSync("./locale/en/tipInitialize.md", "utf-8").replace(
            "%username%",
            authUser.username!
          )
        ),
        Markup.inlineKeyboard([Markup.button.url("Open bot", tgBotURL)])
      );

      messages.push({
        id: String(notifyChatMessage.message_id),
        type: "public",
      });
    }

    const selectMintMessage = await context.telegram.sendMessage(
      authUser.chat!,
      cleanText(
        readFileSync("./locale/en/tipSelectMint.md", "utf-8").replace(
          "%usernames%",
          formatList(tippedUsernames)
        )
      ),
      {
        parse_mode: "MarkdownV2",
        reply_markup: Markup.inlineKeyboard([
          Markup.button.webApp("Select Mint", selectMintURL),
        ]).reply_markup,
      }
    );

    messages.push({
      id: String(selectMintMessage.message_id),
      type: "private",
    });

    return updateTipByUserAndId(database, authUser.id, tip.id, {
      messages,
    });
  }
});
