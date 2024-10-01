import type { Context, Scenes, Telegraf } from "telegraf";
import type { Repository } from "./repository";

export abstract class Service {
  constructor(readonly repository: Repository) {}

  abstract register(...args: unknown[]): void;
}
