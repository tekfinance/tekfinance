import { FastifyInstance, FastifyRequest } from "fastify";
import { Route } from "../../core/api";
import { catchRouteRuntimeError } from "../../utils/catchError";

import { tipFilter, userFilter } from "./micellenous.query";
import { getTipStatus, getUserStatus } from "./micellenous.controller";

export class MicellenousRoute extends Route {
  static override root = "micellenous";

  register(fastify: FastifyInstance): void {
    fastify.route({
      method: "GET",
      url: MicellenousRoute.buildPath("status"),
      handler: catchRouteRuntimeError(this.getStatus.bind(this)),
    });
  }

  getStatus(request: FastifyRequest<{ Querystring: Record<string, string> }>) {
    return this.repository.database.transaction(async (database) => {
      const [user] = await getUserStatus(database, userFilter(request.query));

      const [tip] = await getTipStatus(database, tipFilter(request.query));

      return {
        user,
        tip,
      };
    });
  }
}
