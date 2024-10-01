import bs58 from "bs58";
import { Composer, Context, Markup, Scenes } from "telegraf";

import { Dixie } from "../bot";
import { ChainEnum, LocaleEnum } from "../constants";
import {
  capitalize,
  catchRuntimeError,
  cleanText,
  privateChatOnly,
  readFileSync,
} from "./utils";

export const onSettings = catchRuntimeError(async (context) => {
  if ("callbackQuery" in context) {
    const callbackQuery = context.callbackQuery;
    if (callbackQuery) {
      await context.deleteMessage();
    }
  }
  await context.replyWithMarkdownV2(
    cleanText(readFileSync("./locale/en/settings.md", "utf-8")),
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "Export private key",
          SettingsComposer.exportPrivateKeyAction
        ),
      ],
      [
        Markup.button.callback(
          "Switch chain",
          SettingsComposer.changeChainAction
        ),
      ],
      [
        Markup.button.callback(
          "Switch language",
          SettingsComposer.changeLanguageAction
        ),
      ],
      [Markup.button.callback("Back", Dixie.menuCommand)],
    ])
  );
});

export class SettingsComposer {
  static changeChainAction = "chain";
  static changeLanguageAction = "langauge";
  static exportPrivateKeyAction = "exportPrivateKey";

  static build() {
    const composer = new Composer<Context & Scenes.WizardContext>();
    const self = new SettingsComposer();

    composer.action(
      SettingsComposer.changeChainAction,
      privateChatOnly(catchRuntimeError(self.onChangeChain.bind(this)))
    );
    composer.action(
      SettingsComposer.changeLanguageAction,
      privateChatOnly(catchRuntimeError(self.onChangeLanguage.bind(this)))
    );
    composer.action(
      SettingsComposer.exportPrivateKeyAction,
      privateChatOnly(catchRuntimeError(self.onExportPrivateKey.bind(this)))
    );

    return composer;
  }

  async onExportPrivateKey(context: Context) {
    if ("callbackQuery" in context) {
      const callbackQuery = context.callbackQuery;
      if (callbackQuery) {
        await context.deleteMessage();
      }
    }

    return context.replyWithMarkdownV2(
      cleanText(
        readFileSync("./locale/en/privateKey.md", "utf-8").replace(
          "%key%",
          bs58.encode(context.wallets.solana.keypair.secretKey)
        )
      ),
      Markup.inlineKeyboard([
        Markup.button.callback("Back", Dixie.settingsCommand),
      ])
    );
  }

  async onChangeChain(context: Context) {
    if ("callbackQuery" in context) {
      const callbackQuery = context.callbackQuery;
      if (callbackQuery) {
        await context.deleteMessage();
      }
    }

    return context.replyWithMarkdownV2(
      cleanText(
        readFileSync("./locale/en/chain.md", "utf-8").replace(
          "%current%",
          context.authUser.settings!.chain
        )
      ),
      Markup.inlineKeyboard([
        [Markup.button.callback("Back", Dixie.settingsCommand)],
        ChainEnum.map((chain) =>
          Markup.button.callback(capitalize(chain), "chain")
        ),
      ])
    );
  }

  async onChangeLanguage(context: Context) {
    if ("callbackQuery" in context) {
      const callbackQuery = context.callbackQuery;
      if (callbackQuery) {
        await context.deleteMessage();
      }
    }

    return context.replyWithMarkdownV2(
      cleanText(
        readFileSync("./locale/en/language.md", "utf-8").replace(
          "%current%",
          context.authUser.settings!.locale
        )
      ),
      Markup.inlineKeyboard([
        [Markup.button.callback("Back", Dixie.settingsCommand)],
        LocaleEnum.map((locale) =>
          Markup.button.callback(capitalize(locale), "language")
        ),
      ])
    );
  }
}
