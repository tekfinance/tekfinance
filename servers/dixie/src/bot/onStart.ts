import { Context, Markup } from "telegraf";

import { Dixie } from ".";
import { onRedeem } from "./onRedeem";
import { Explorer } from "../utils/explorer";
import { catchRuntimeError, cleanText, readFileSync } from "./utils";
import { createPoint } from "../modules/points/point.controller";
import { getUserById, updateUser } from "../modules/users/user.controller";

const onRefer = async (context: Context) => {
  const {
    authUser,
    repository: { database },
  } = context;
  const referer = context.session.value;

  if (referer) {
    const user = await getUserById(database, referer);

    if (user) {
      await context.telegram.sendMessage(
        user.chat!,
        cleanText(
          readFileSync("./locale/en/notifyReferer.md", "utf-8").replace(
            "%referer%",
            authUser.username!
          )
        )
      );
      await database.transaction(async (database) => {
        await createPoint(database, {
          task: "refer",
          point: 100,
        });

        await updateUser(database, authUser.id, { referer });
      });
    }
  }
};

export const onStart = catchRuntimeError(async (context) => {
  const {
    wallets,
    message,
    repository: { connection },
  } = context;

  if (message && "text" in message) {
    const [, value] = message.text.split(/\s/g);

    if (value) {
      const [delimeter, text] = value.split(/^(refer|redeem)=/).filter(Boolean);
      context.session.value = text;

      switch (delimeter) {
        case "refer":
          await onRefer(context);
          break;
        case "redeem":
          return onRedeem(context);
      }
    }
  }

  const address = wallets.solana.publicKey;
  const link = Explorer.accountLink(address.toBase58());
  const balance = (await connection.getBalance(address)) / Math.pow(10, 9);

  return context.replyWithHTML(
    readFileSync("./locale/en/start.md", "utf-8")
      .replace("%address%", address.toBase58())
      .replace("%link%", link)
      .replace("%balance%", balance.toString()),
    Markup.inlineKeyboard([Markup.button.callback("Menu", Dixie.menuCommand)])
  );
});
