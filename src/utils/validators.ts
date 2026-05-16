export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function hasMinLength(value: string, min: number): boolean {
  return value.length >= min;
}

export function matches(a: string, b: string): boolean {
  return a === b;
}
