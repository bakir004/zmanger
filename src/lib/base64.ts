export function toBase64(str: string): string {
  return btoa(str);
}

export function fromBase64(str: string): string {
  return atob(str);
}
