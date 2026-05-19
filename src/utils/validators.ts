import { ValidationError } from "./errors.js";

export function requireString(
  value: unknown,
  field: string,
  opts?: { minLength?: number },
): string {
  if (typeof value !== "string" || value.length === 0)
    throw new ValidationError(`${field} is required`);
  if (opts?.minLength !== undefined && value.length < opts.minLength)
    throw new ValidationError(
      `${field} must be at least ${opts.minLength} characters`,
    );
  return value;
}

export function requireEmail(value: unknown, field = "email"): string {
  const str = requireString(value, field);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
    throw new ValidationError(`${field} must be a valid email`);
  }
  return str;
}

export function requireMatch(a: string, b: string, field: string): void {
  if (a !== b) throw new ValidationError(`${field} does not match`);
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
