import type { Context, Scenes, Telegraf } from "telegraf";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { Connection } from "@solana/web3.js";
import type { Umi } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { Secret } from "./secret";
import type { Service } from "./service";

export class Repository {
  readonly umi: Umi;
  readonly secret: Secret;
  readonly connection: Connection;

  private readonly services: Service[];

  constructor(
    readonly server: FastifyInstance,
    readonly bot: Telegraf<Context & Scenes.WizardContext>,
    readonly config: Config,
    readonly database: Database
  ) {
    this.services = [];
    this.secret = new Secret(config.secret);
    this.connection = new Connection(config.rpcURL);
    this.umi = createUmi(this.connection);
  }

  register<
    T extends new (...args: ConstructorParameters<typeof Service>) => Service
  >(Service: T) {
    this.services.push(new Service(this));
  }

  async run() {
    const tasks = [];
    this.services.map((service) => service.register());

    if (this.config.domain) {
      const webhook = await this.bot.createWebhook({
        domain: this.config.domain,
      });
      this.server.post(
        "/telegraf/" + this.bot.secretPathComponent(),
        webhook as unknown as (request: FastifyRequest) => void
      );
    } else tasks.push(this.bot.launch());

    tasks.push(
      this.server.listen({
        port: this.config.port,
        host: this.config.host,
      })
    );

    process.on("SIGINT", () => {
      this.bot.stop("SIGINT");
      return this.server.close();
    });
    process.on("SIGTERM", () => {
      this.bot.stop("SIGTERM");
      return this.server.close();
    });

    await Promise.all(tasks);
  }
}
