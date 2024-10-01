import type { FastifyInstance } from "fastify";
import { Route } from "../../core/api";

export class WalletRoute extends Route {
  static override root ="wallets";

  register(fastify: FastifyInstance): void {}
}
