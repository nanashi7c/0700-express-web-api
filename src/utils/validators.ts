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

export function isIntegerString(value: unknown): value is string {
  return typeof value === "string" && /^-?\d+$/.test(value);
}

export function isAtLeast(n: number, min: number): boolean {
  return n >= min;
}

export function isAtMost(n: number, max: number): boolean {
  return n <= max;
}

export function isOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
): value is T {
  return (
    typeof value === "string" && (allowed as readonly string[]).includes(value)
  );
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

export function isDateString(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const [, y, mo, d] = m;
  const date = new Date(`${y}-${mo}-${d}T00:00:00Z`);
  return (
    date.getUTCFullYear() === Number(y) &&
    date.getUTCMonth() + 1 === Number(mo) &&
    date.getUTCDate() === Number(d)
  );
}
