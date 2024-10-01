import passport from "@fastify/passport";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Route } from "../../core/api";
import { TelegramRoute } from "../telegram/telegram.route";
import { catchRouteRuntimeError } from "../../utils/catchError";

import { getPointsAggregrateByUser, getPointsByUser } from "./point.controller";

export class PointRoute extends Route {
  static override root ="points";

  register(fastify: FastifyInstance) {
    fastify.route({
      method: "GET",
      url: PointRoute.buildPath(),
      preValidation: passport.authenticate("tma"),
      handler: catchRouteRuntimeError(this.getPointsRoute.bind(this)),
    });

    fastify.route({
      method: "GET",
      url: TelegramRoute.buildPath("analytic"),
      preValidation: passport.authenticate("tma"),
      handler: catchRouteRuntimeError(this.getPointsAnalyticRoute.bind(this)),
    });
  }

  async getPointsRoute(request: FastifyRequest) {
    const user = request.user!;
    const { database } = this.repository;

    return getPointsByUser(database, user.id);
  }

  async getPointsAnalyticRoute(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user!;
    const { database } = this.repository;

    const [aggregrate] = await getPointsAggregrateByUser(database, user.id);

    return aggregrate;
  }
}
