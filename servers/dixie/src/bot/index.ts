import type { Update } from "telegraf/types";
import { Scenes, session, type Context, type Middleware } from "telegraf";

import { Service } from "../core";
import { mapWallets } from "../modules/wallets/wallet.controller";
import { updateUser, upsertUser } from "../modules/users/user.controller";

import { onTip } from "./onTip";
import { onHelp } from "./onHelp";
import { onMenu } from "./onMenu";
import { onFund } from "./onFund";
import { onStart } from "./onStart";
import { onRefer } from "./onRefer";
import { onChain } from "./onChain";
import { onRedeem } from "./onRedeem";
import { onLanguage } from "./onLanguage";
import { privateChatOnly } from "./utils/methods";
import { onConfirmRedeem } from "./onConfirmRedeem";
import { createCouponScene, onCoupon } from "./onCoupon";
import { onSettings, SettingsComposer } from "./onSettings";

export class Dixie extends Service {
  static tipCommand = "tip";
  static fundCommand = "fund";
  static menuCommand = "menu";
  static referCommand = "refer";
  static cancelCommand = "cancel";
  static redeemCommand = "redeem";
  static couponCommand = "coupon";
  static confirmCommand = "confirm";
  static couponScene = "couponScene";
  static redeemScene = "redeemScene";
  static settingsCommand = "settings";
  static confirmRedeemCommand = "coxnfirmRedeem";

  register(): void {
    const { bot } = this.repository;

    const scenes = [createCouponScene(this.repository)];

    const stage = new Scenes.Stage(scenes);

    bot.use(session());
    bot.use(stage.middleware());
    bot.use(this.authenticationMiddleware());
    bot.use(SettingsComposer.build());

    const defaults = [
      {
        command: Dixie.tipCommand,
        description: "Tip a single or multiple telegram user.",
      },
    ];

    bot.telegram.setMyCommands(defaults, { scope: { type: "default" } });
    bot.telegram.setMyCommands(defaults, {
      scope: { type: "all_group_chats" },
    });
    bot.telegram.setMyCommands(
      [
        {
          command: "start",
          description: "Start or restart bot with latest version.",
        },
        { command: Dixie.menuCommand, description: "Show menu interface." },
        { command: Dixie.settingsCommand, description: "Update bot settings." },
        {
          command: Dixie.fundCommand,
          description: "Get wallet address and QRCode.",
        },
        // {
        //   command: Dixie.referCommand,
        //   description: "Refer a friend to earn points.",
        // },
        // {
        //   command: Dixie.couponCommand,
        //   description: "Create and fund a new coupon",
        // },
        ...defaults,
        { command: "help", description: "Help and bot command guide." },
      ],
      {
        scope: { type: "all_private_chats" },
      }
    );

    scenes.map((scene) => scene.use(this.authenticationMiddleware()));

    const startCommand = privateChatOnly(onStart);
    const menuCommand = privateChatOnly(onMenu);
    const fundCommand = privateChatOnly(onFund);
    //const referCommand = privateChatOnly(onRefer);
    // const couponCommand = privateChatOnly(onCoupon);
    // const redeemCommand = privateChatOnly(onRedeem);
    const settingsCommand = privateChatOnly(onSettings);
    //const confirmRedeemCommand = privateChatOnly(onConfirmRedeem);
    const chainCommand = privateChatOnly(onChain);
    const languageCommand = privateChatOnly(onLanguage);

    bot.help(onHelp);
    bot.start(startCommand);
    bot.action(/language/, languageCommand);
    bot.action(Dixie.menuCommand, onMenu);
    bot.action(Dixie.fundCommand, fundCommand);
    bot.action(/chain/, chainCommand);
    // bot.action(Dixie.referCommand, referCommand);
    bot.action(Dixie.settingsCommand, settingsCommand);
    // bot.action(/^confirmRedeem/, confirmRedeemCommand);

    bot.command(Dixie.tipCommand, onTip);
    bot.command(Dixie.menuCommand, menuCommand);
    bot.command(Dixie.fundCommand, fundCommand);
    // bot.command(Dixie.referCommand, referCommand);
    // bot.command(Dixie.redeemCommand, redeemCommand);
    // bot.command(Dixie.couponCommand, couponCommand);
    bot.command(Dixie.settingsCommand, settingsCommand);
  }

  authenticationMiddleware(): Middleware<Context<Update>> {
    return async (context, next) => {
      const from = context.from!;

      let user = await upsertUser(this.repository.database, {
        uid: String(from.id!),
        username: from.username!,
        social: "telegram",
      });

      if (context.chat && context.chat.type === "private") {
        const [updatedUser] = await updateUser(
          this.repository.database,
          user.id,
          {
            uid: String(from.id),
            username: from.username,
            chat: String(context.chat.id),
          }
        );

        user.uid = updatedUser.uid;
        user.chat = updatedUser.chat;
        user.username = updatedUser.username;
      }

      context.authUser = user;
      context.repository = this.repository;
      context.wallets = mapWallets(this.repository, user.wallets);

      return next();
    };
  }
}
