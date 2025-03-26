/* eslint-disable */
export function toBase64(str: string | null | undefined): string {
  if (!str) return "";
  return Buffer.from(str, "utf-8").toString("base64");
}

export function fromBase64(str: string | null | undefined): string {
  if (!str) return "";
  return Buffer.from(str, "base64").toString("utf-8");
}
