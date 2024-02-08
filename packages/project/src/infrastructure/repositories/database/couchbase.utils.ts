export function ILike(field: string, value: string): string {
  return `LOWER(${field}) = LOWER("${value}")`;
}
