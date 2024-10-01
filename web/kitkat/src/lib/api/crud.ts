import { ApiImpl } from "./impl";

export abstract class CrudApi<T> extends ApiImpl {
  create(values: Partial<T>) {
    return this.xior.post<T>(this.path, values);
  }

  list() {
    return this.xior.get<T[]>(this.path);
  }

  get(id: string) {
    return this.xior.get<T>(this.buildPath(id));
  }

  update(id: string, values: Partial<T>) {
    return this.xior.patch<T>(this.buildPath(id), values);
  }

  delete(id: string) {
    return this.xior.delete<T>(this.buildPath(id));
  }
}
