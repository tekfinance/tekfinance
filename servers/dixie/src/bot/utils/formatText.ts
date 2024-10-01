import { type PathOrFileDescriptor, readFileSync as read } from "fs";

export function cleanText(value: string) {
  return value
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
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
  values = Array.from(new Set(values).values());

  if (values.length === 2) return values.join(" and ");
  const beforeLast = values.slice(0, values.length - 2);
  const last = values[values.length - 1];
  return [beforeLast.join(", "), last].filter(Boolean).join(" and ");
};

export const capitalize = (value: string) =>
  value[0].toUpperCase() + value.slice(1, value.length);
