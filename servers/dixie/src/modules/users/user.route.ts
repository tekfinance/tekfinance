import passport from "@fastify/passport";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { Route } from "../../core/api";
import { catchRouteRuntimeError } from "../../utils/catchError";

export class UserRoute extends Route {
  static override root = "users";

  register(fastify: FastifyInstance) {
    fastify.route({
      method: "GET",
      url: UserRoute.buildPath("me"),
      preValidation: passport.authenticate("tma"),
      handler: catchRouteRuntimeError(this.getUserRoutes.bind(this)),
    });
  }

  async getUserRoutes(request: FastifyRequest) {
    return request.user;
  }
}
