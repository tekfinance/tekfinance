import type { z } from "zod";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { Route } from "../../core/api";
import { catchRouteRuntimeError } from "../../utils/catchError";
import { insertCouponSchema, selectCouponSchema } from "../../db";
import {
  createCoupon,
  deleteCouponByUserAndId,
  getCouponByUserAndId,
  updateCouponByUserAndId,
} from "./coupon.controller";

export class CouponRoute extends Route {
  static override root = "coupons";

  register(fastify: FastifyInstance) {
    fastify.route({
      method: "POST",
      url: CouponRoute.buildPath(),
      handler: catchRouteRuntimeError(this.createCouponRoute.bind(this)),
    });

    fastify.route({
      method: "GET",
      url: CouponRoute.buildPath(),
      handler: catchRouteRuntimeError(this.getCouponsRoute.bind(this)),
    });

    fastify.route({
      method: "GET",
      url: CouponRoute.buildPath(":id"),
      handler: catchRouteRuntimeError(this.getCouponRoute.bind(this)),
    });

    fastify.route({
      method: "PATCH",
      url: CouponRoute.buildPath(),
      handler: catchRouteRuntimeError(this.updateCouponRoute.bind(this)),
    });

    fastify.route({
      method: "DELETE",
      url: CouponRoute.buildPath(),
      handler: catchRouteRuntimeError(this.deleteCouponRoute.bind(this)),
    });
  }

  async createCouponRoute(
    request: FastifyRequest<{ Body: z.infer<typeof insertCouponSchema> }>
  ) {
    const user = request.user!;
    const { database } = this.repository;

    return insertCouponSchema
      .parseAsync({ ...request.body, user: user.id })
      .then(async (data) => {
        const [coupon] = await createCoupon(database, data);
        return coupon;
      });
  }

  async getCouponsRoute(request: FastifyRequest) {}

  async getCouponRoute(
    request: FastifyRequest<{
      Params: Pick<z.infer<typeof selectCouponSchema>, "id">;
    }>,
    reply: FastifyReply
  ) {
    const user = request.user!;
    const { database } = this.repository;
    const coupons = await getCouponByUserAndId(
      database,
      user.id,
      request.params.id
    );
    if (coupons.length > 0) {
      const [coupon] = coupons;

      return coupon;
    }

    return reply.status(400).send({ message: "coupon with id not found" });
  }

  async updateCouponRoute(
    request: FastifyRequest<{
      Params: Pick<z.infer<typeof selectCouponSchema>, "id">;
      Body: z.infer<typeof insertCouponSchema>;
    }>,
    reply: FastifyReply
  ) {
    const user = request.user!;
    const { database } = this.repository;
    return insertCouponSchema
      .partial()
      .parseAsync(request.body)
      .then(async (data) => {
        const coupons = await updateCouponByUserAndId(
          database,
          user.id,
          request.params.id,
          data
        );

        if (coupons.length > 0) {
          const [coupon] = coupons;
          return coupon;
        }

        return reply.status(400).send({ message: "Coupon with id not found" });
      });
  }

  async deleteCouponRoute(
    request: FastifyRequest<{
      Params: Pick<z.infer<typeof selectCouponSchema>, "id">;
    }>,
    reply: FastifyReply
  ) {
    const user = request.user!;
    const { database } = this.repository;
    const coupons = await deleteCouponByUserAndId(
      database,
      user.id,
      request.params.id
    );

    if (coupons.length > 0) {
      const [coupon] = coupons;
      return coupon;
    }

    return reply.status(400).send({ message: "coupon with id not found" });
  }
}
