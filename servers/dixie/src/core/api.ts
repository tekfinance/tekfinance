import path from "path";
import type { FastifyInstance } from "fastify";

import type { Repository } from "./repository";

export abstract class Route {
  static root: string;

  constructor(protected readonly repository: Repository) {}

  abstract register(fastify: FastifyInstance): void;

  protected static buildPath(...value: string[]) {
    return "/" + path.join(this.root, ...value) + "/";
  }
}
