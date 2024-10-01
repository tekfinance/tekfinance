import type { z } from "zod";
import passport from "@fastify/passport";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { Route } from "../../core/api";
import { insertTipSchema } from "../../db";
import { createTip, getTipsByUser } from "./tip.controller";
import { catchRouteRuntimeError } from "../../utils/catchError";

export class TipRoute extends Route {
  static override root = "tips";

  register(fastify: FastifyInstance) {
    fastify.route({
      method: "POST",
      url: TipRoute.buildPath(),
      preValidation: passport.authenticate("tma"),
      handler: catchRouteRuntimeError(this.createTipRoute.bind(this)),
    });
    fastify.route({
      method: "GET",
      url: TipRoute.buildPath(),
      preValidation: passport.authenticate("tma"),
      handler: catchRouteRuntimeError(this.getTipsRoute.bind(this)),
    });
  }

  async createTipRoute(
    request: FastifyRequest<{
      Body: Omit<z.infer<typeof insertTipSchema>, "user">;
    }>
  ) {
    const user = request.user!;
    const { database } = this.repository;

    return insertTipSchema
      .parseAsync({ ...request.body, user: user.id })
      .then(async (data) => {
        const [tip] = await createTip(database, data);

        return tip;
      });
  }

  async getTipsRoute(request: FastifyRequest) {
    const user = request.user!;
    const { database } = this.repository;

    return getTipsByUser(database, user.id);
  }
}
