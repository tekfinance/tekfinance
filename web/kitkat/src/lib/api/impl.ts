import type { XiorInstance } from "xior";

export abstract class ApiImpl {
  protected abstract readonly path: string;

  constructor(protected readonly xior: XiorInstance) {}

  protected buildPath(...values: PropertyKey[]) {
    return [this.path, values].map(String).join("/");
  }

  protected buildPathWithQuery<T extends Record<string, string>>(
    path: string,
    query?: T
  ) {
    const params = new URLSearchParams(query);
    return path + "?" + params;
  }
}
