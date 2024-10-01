import { ZodError } from "zod";
import type { Context, Scenes } from "telegraf";

import { cleanText } from "./formatText";

export const catchRuntimeError = <
  T extends (context: Context & Scenes.WizardContext) => Promise<unknown>
>(
  func: T
) => {
  return (context: Context & Scenes.WizardContext) =>
    func(context).catch((error) => {
      console.error(error);
      if (error instanceof ZodError)
        return context.replyWithMarkdownV2(
          cleanText("`" + JSON.stringify(error.format(), undefined, 2) + "`")
        );
      return context.replyWithMarkdownV2(cleanText("`" + error.message + "`"));
    }) as unknown as ReturnType<T>;
};

export const privateChatOnly =
  <T extends (context: Context & Scenes.WizardContext) => Promise<any>>(
    func: T
  ) =>
  async (context: Context & Scenes.WizardContext) => {
    await context.telegram.deleteMyCommands();

    if (context.chat && "type" in context.chat) {
      const type = context.chat.type;
      if (type === "private") return func(context);
      return context.replyWithMarkdownV2(
        "This command is for private chat only"
      );
    }
  };

export function formatUser(user: string): string;
export function formatUser(user: string[]): string[];
export function formatUser(user: any): any {
  if (Array.isArray(user)) return user.map((value) => formatUser(value));
  return "@" + user;
}
