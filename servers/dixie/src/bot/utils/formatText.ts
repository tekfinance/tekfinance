import { type PathOrFileDescriptor, readFileSync as read } from "fs";

export function cleanText(value: string) {
  return value
    .replace(/\_/g, "\\_")
    .replace(/\~/g, "\\~")
    .replace(/\#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/\-/g, "\\-")
    .replace(/\=/g, "\\=")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\./g, "\\.")
    .replace(/\!/g, "\\!");
}

export function readFileSync(...params: Parameters<typeof read>): string;
export function readFileSync(descriptor: PathOrFileDescriptor): string;
export function readFileSync(
  descriptor: PathOrFileDescriptor,
  ...args: any[]
): string {
  if (args.length === 0) {
    const text = read(descriptor, "utf-8") as string;
    return cleanText(text);
  }

  return read(descriptor, ...args) as unknown as string;
}

export const formatList = (values: string[]) => {
  values = Array.from(new Set(values));

  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return values.join(" and ");

  const allButLast = values.slice(0, values.length - 1).join(", ");
  const last = values[values.length - 1];
  return `${allButLast}, and ${last}`;
};

export const capitalize = (value: string) =>
  value[0].toUpperCase() + value.slice(1, value.length);
