import "dotenv/config";
import type { z } from "zod";
import { readFileSync } from "fs";

import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import { type Context, type Scenes, Telegraf } from "telegraf";

import { Dixie } from "./bot";
import { Api } from "./modules";
import { createDB } from "./core";
import * as models from "./db/models";
import { TelegramStrategy } from "./lib";
import type { selectUserSchema } from "./db";
import { Repository } from "./core/repository";
import { getUserById, upsertUser } from "./modules/users/user.controller";

const port = Number(process.env.PORT!);
const host = process.env.HOST!;
const rpcURL = process.env.RPC_URL!;
const secret = process.env.SECRET_KEY!;
const appURL = process.env.APP_URL!;
const domain = process.env.RENDER_EXTERNAL_HOSTNAME;
const telegramAccessToken = process.env.TELEGRAM_ACCESS_TOKEN!;

const database = createDB(process.env.DATABASE_URL!, models);

const fastify = Fastify({
  logger: true,
  ignoreDuplicateSlashes: true,
  ignoreTrailingSlash: true,
});

fastify.register(fastifySecureSession, {
  key: readFileSync("secret-key"),
});
fastify.register(fastifyPassport.initialize());
fastify.register(fastifyPassport.secureSession());
fastify.register(cors, {
  origin: [/127.0.0.1/, /localhost/, /.tekfinance.fun$/],
});

fastifyPassport.use(
  "tma",
  TelegramStrategy(telegramAccessToken, async (payload, done) => {
    const user = await upsertUser(database, {
      uid: String(payload.user!.id!),
      username: payload.user!.username!,
      social: "telegram",
    });

    done(null, user);
  })
);

fastifyPassport.registerUserSerializer<
  z.infer<typeof selectUserSchema>,
  number
>(async (user) => user.id);

fastifyPassport.registerUserDeserializer<
  number,
  Awaited<ReturnType<typeof getUserById>>
>(async (id) => getUserById(repository.database, id));

const bot = new Telegraf<Context & Scenes.WizardContext>(telegramAccessToken);

export const repository: Repository = new Repository(
  fastify,
  bot,
  {
    rpcURL,
    secret,
    appURL,
    port,
    host,
    domain,
  },
  database
);

repository.register(Api);
repository.register(Dixie);

repository.run();
