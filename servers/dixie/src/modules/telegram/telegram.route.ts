import type { z } from "zod";
import passport from "@fastify/passport";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { Route } from "../../core/api";
import { catchRouteRuntimeError, StatusError } from "../../utils/catchError";

import { processTip } from "./processTip";
import { webDataSchema } from "./telegram.schema";
import { processCoupon } from "./processCoupon";

export class TelegramRoute extends Route {
  static override root = "telegram";

  register(fastify: FastifyInstance) {
    fastify.route({
      method: "POST",
      url: TelegramRoute.buildPath("webhook"),
      preValidation: passport.authenticate("tma"),
      handler: catchRouteRuntimeError(this.onWebhookRoute.bind(this)),
    });
  }

  async onWebhookRoute(
    request: FastifyRequest<{ Body: z.infer<typeof webDataSchema> }>
  ) {
    return webDataSchema.parseAsync(request.body).then(async (data) => {
      switch (data.action) {
        case "selectMint":
          switch (data.type) {
            case "tip":
              return await processTip(this.repository, request.user!, data);
            case "coupon":
              return await processCoupon(this.repository, request.user!, data);
            default:
              throw new StatusError(404, {
                message:
                  data.type + " not supported for " + data.action + " action",
              });
          }
      }
    });
  }
}
