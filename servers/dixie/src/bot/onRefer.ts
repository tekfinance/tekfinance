import { Markup, type Context } from "telegraf";

import { InternalLinkParams } from "../utils/link";

import {
  buildTgURL,
  buildURL,
  catchRuntimeError,
  cleanText,
  readFileSync,
} from "./utils";
import { Dixie } from ".";

export const onRefer = catchRuntimeError(async (context: Context) => {
  const referURL = buildURL(buildTgURL(context.botInfo.username), {
    start: InternalLinkParams.referValue(context.authUser!.id),
  });

  const message = cleanText(
    readFileSync("./locale/en/refer.md", "utf-8")
      .replace("%counts%", "0")
      .replace("%points%", "0")
      .replaceAll("%url%", referURL)
  );

  if (context.callbackQuery) {
    await context.deleteMessage();
    return context.replyWithMarkdownV2(
      message,
      Markup.inlineKeyboard([Markup.button.callback("Back", Dixie.menuCommand)])
    );
  } else return context.replyWithMarkdownV2(message);
});
