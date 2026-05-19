import { isAtLeast, isAtMost, isIntegerString } from "./validators.js";

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
