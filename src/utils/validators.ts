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

export function optionalInt(
  value: unknown,
  field: string,
  opts?: { min?: number; max?: number },
): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const str = Array.isArray(value) ? value[0] : value;

  if (typeof str !== "string" || !/^-?\d+$/.test(str)) {
    throw new ValidationError(`${field} must be an integer`);
  }

  const n = Number(str);

  if (opts?.min !== undefined && n < opts.min)
    throw new ValidationError(`${field} must be at least ${opts.min}`);

  if (opts?.max !== undefined && n > opts.max) {
    throw new ValidationError(`${field} must be at most ${opts.max}`);
  }

  return n;
}
