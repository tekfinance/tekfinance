import { ZodError } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { HttpCodes } from "fastify/types/utils";

export const catchRouteError = (reply: FastifyReply) => {
  return <T>(error: T) => {
    console.debug(error);
    if (error instanceof ZodError) {
      return reply.status(400).send(error.format());
    }

    if (error instanceof StatusError) {
      return reply.status(error.status).send(error.message);
    }

    return reply.status(500).send(error);
  };
};

export const catchRouteRuntimeError = <
  T extends FastifyRequest,
  U extends FastifyReply,
  K extends object | null | undefined | void
>(
  fn: (request: T, reply: U) => Promise<K>
) => {
  return (request: T, reply: U) =>
    fn(request, reply).catch(catchRouteError(reply));
};

export class StatusError<T extends string | object> {
  constructor(readonly status: HttpCodes, readonly message: T) {}
}
