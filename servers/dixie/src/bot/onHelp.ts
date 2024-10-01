import { catchRuntimeError, readFileSync } from "./utils";

export const onHelp = catchRuntimeError(async (context) =>
  context.replyWithMarkdownV2(readFileSync("./locale/en/help.md"))
);
