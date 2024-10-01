import type { z } from "zod";
import { Markup } from "telegraf";
import { TransactionInstruction } from "@solana/web3.js";

import type { Repository } from "../../core";
import type { upsertUser } from "../users/user.controller";
import { getWalletsById, mapWallets } from "../wallets/wallet.controller";
import {
  getTipByUserAndId,
  updateTipByUserAndId,
} from "../tips/tip.controller";

import { SolanaWallet } from "../../lib/wallets";
import { Explorer } from "../../utils/explorer";
import { StatusError } from "../../utils/catchError";
import { cleanText, formatList, readFileSync } from "../../bot/utils";

import type { selectMintSchema } from "./telegram.schema";

export const processTip = async (
  repository: Repository,
  user: Awaited<ReturnType<typeof upsertUser>>,
  { id, data }: z.infer<typeof selectMintSchema>
) => {

  const wallet = mapWallets(repository, user.wallets);
  const { database, secret, connection, bot } = repository;
  const [tip] = await getTipByUserAndId(database, user.id, id);

  const instructions: TransactionInstruction[] = [];

  if (tip.status === "success")
    throw new StatusError(
      400,
      "Tip already processed. Try initiate another tip request"
    );

  for (const { amount, recipients } of tip.configs) {
    const wallets = (
      await getWalletsById(
        database,
        recipients.map((user) => user.wallet)
      )
    ).map(({ hash }) => {
      const wallet = new SolanaWallet(secret, hash);
      return { wallet };
    });

    const txInstructions = await wallet.solana.createTransferInstructions(
      repository.connection,
      ...wallets.map(({ wallet }) => ({
        amount,
        mint: data.mint.publicKey,
        decimals: data.mint.decimals,
        account: wallet.publicKey.toBase58(),
      }))
    );

    instructions.push(...txInstructions);
  }

  const versionedTx = await wallet.solana.createVersionedTransaction(
    connection,
    instructions
  );
  const simulationResult = await connection.simulateTransaction(versionedTx);

  if (simulationResult.value.err) {
    throw simulationResult.value;
  }

  const signature = await wallet.solana.sendVersionedTransaction(
    connection,
    versionedTx
  );

  if (user.chat)
    await bot.telegram
      .deleteMessages(
        user.chat,
        tip.messages
          .filter(({ type }) => type === "private")
          .map(({ id }) => Number(id))
      )
      .catch(() => null);

  if (tip.chat)
    await bot.telegram
      .deleteMessages(
        tip.chat,
        tip.messages
          .filter(({ type }) => type !== "private")
          .map(({ id }) => Number(id))
      )
      .catch(() => null);

  const message = cleanText(
    readFileSync("./locale/en/tip.md", "utf-8")
      .replace("%username%", user.username!)
      .replace(
        "%messages%",
        formatList(
          tip.configs.map(
            ({ amount, recipients }) =>
              formatList(recipients.map(({ username }) => "@" + username)) +
              " " +
              amount +
              " " +
              data.metadata.symbol
          )
        )
      )
  );

  const extra = {
    parse_mode: "MarkdownV2",
    reply_markup: Markup.inlineKeyboard([
      Markup.button.url("Open Explorer", Explorer.txLink(signature)),
    ]).reply_markup,
  } as const;

  if (tip.chat) await bot.telegram.sendMessage(tip.chat, message, extra);
  if (user.chat && tip.chat != user.chat)
    await bot.telegram.sendMessage(user.chat, message, extra);

  return updateTipByUserAndId(database, user.id, tip.id, {
    signature,
    messages: [],
    status: "success",
    configs: tip.configs.map((config) => {
      config.name = data.metadata.name;
      config.mint = data.mint.publicKey;
      config.decimals = data.mint.decimals;
      config.symbol = data.metadata.symbol;

      return {
        ...config,
        mint: data.mint.publicKey,
      };
    }),
  });
};
