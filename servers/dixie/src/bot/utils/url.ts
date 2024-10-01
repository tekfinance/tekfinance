export function buildURL<T extends Record<string, any>>(
  baseURL: string,
  search: T
): string;
export function buildURL<T extends Record<string, any>>(
  baseURL: string,
  path: string,
  search: T
): string;
export function buildURL(...args: any[]): string {
  let params;
  let baseURL = "";
  let $path = "";

  if (args.length === 2) [baseURL, params] = args;
  else [baseURL, $path, params] = args;

  const q = new URLSearchParams(params);
  return [baseURL, $path].join("/") + "?" + q;
}

export const buildTgURL = (username: string, escape = false) => {
  if (escape) return ("t.me/" + username).replace(/\_/g, "\\_");
  else return "t.me/" + username;
};
