/* eslint-disable */
export function toBase64(str: string | null | undefined): string {
  if (!str) return "";
  return btoa(str);
}

export function fromBase64(str: string | null | undefined): string {
  if (!str) return "";
  return atob(str);
}
