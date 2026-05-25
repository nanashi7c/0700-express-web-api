import {
  isAtLeast,
  isAtMost,
  isDateString,
  isIntegerString,
  isNonEmptyString,
  isOneOf,
  isUuid,
} from "./validators.js";

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

export function parseOptionalInt(
  value: unknown,
  opts?: { min?: number; max?: number },
): ParseResult<number | undefined> {
  if (value === undefined || value === null || value === "")
    return { ok: true, value: undefined };

  const str = Array.isArray(value) ? value[0] : value;

  if (!isIntegerString(str))
    return { ok: false, message: "must be an integer" };

  const n = Number(str);

  if (opts?.min !== undefined && !isAtLeast(n, opts.min))
    return { ok: false, message: `must be at least ${opts.min}` };

  if (opts?.max !== undefined && !isAtMost(n, opts.max))
    return { ok: false, message: `must be at most ${opts.max}` };

  return { ok: true, value: n };
}

export function parseRequiredString(value: unknown): ParseResult<string> {
  if (!isNonEmptyString(value)) return { ok: false, message: "is required" };
  return { ok: true, value };
}

export function parseOptionalString(
  value: unknown,
): ParseResult<string | undefined> {
  if (value === undefined || value === null || value === "")
    return { ok: true, value: undefined };
  if (typeof value !== "string")
    return { ok: false, message: "must be a string" };
  return { ok: true, value };
}

export function parseRequiredEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
): ParseResult<T> {
  if (value === undefined || value === null || value === "")
    return { ok: false, message: "is required" };
  if (!isOneOf(value, allowed))
    return { ok: false, message: `must be one of ${allowed.join(", ")}` };
  return { ok: true, value };
}

export function parseOptionalEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
): ParseResult<T | undefined> {
  if (value === undefined || value === null || value === "")
    return { ok: true, value: undefined };
  if (!isOneOf(value, allowed))
    return { ok: false, message: `must be one of ${allowed.join(", ")}` };
  return { ok: true, value };
}

export function parseOptionalEnumArray<T extends string>(
  value: unknown,
  allowed: readonly T[],
): ParseResult<T[] | undefined> {
  if (value === undefined || value === null || value === "")
    return { ok: true, value: undefined };
  const arr = Array.isArray(value) ? value : [value];
  const result: T[] = [];
  for (const item of arr) {
    if (!isOneOf(item, allowed))
      return { ok: false, message: `must be one of ${allowed.join(", ")}` };
    result.push(item);
  }
  return { ok: true, value: result };
}

export function parseRequiredDateString(value: unknown): ParseResult<Date> {
  if (value === undefined || value === null || value === "")
    return { ok: false, message: "is required" };
  if (!isDateString(value))
    return { ok: false, message: "must be a valid date string" };
  return { ok: true, value: new Date(value) };
}

export function parseOptionalDateString(
  value: unknown,
): ParseResult<Date | undefined> {
  if (value === undefined || value === null || value === "")
    return { ok: true, value: undefined };
  if (!isDateString(value))
    return { ok: false, message: "must be a valid date string" };
  return { ok: true, value: new Date(value) };
}

export function parseRequiredUuid(value: unknown): ParseResult<string> {
  if (value === undefined || value === null || value === "")
    return { ok: false, message: "is required" };
  if (!isUuid(value)) return { ok: false, message: "must be a valid UUID" };
  return { ok: true, value };
}

export function parseOptionalUuid(
  value: unknown,
): ParseResult<string | undefined> {
  if (value === undefined || value === null || value === "")
    return { ok: true, value: undefined };
  if (!isUuid(value)) return { ok: false, message: "must be a valid UUID" };
  return { ok: true, value };
}
