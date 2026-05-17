import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} must be set`);
  return value;
}

const ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
const REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");
const ACCESS_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN ??
  "1h") as NonNullable<SignOptions["expiresIn"]>;
const REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ??
  "7d") as NonNullable<SignOptions["expiresIn"]>;

export type JwtPayload = { userId: string };

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, ACCESS_SECRET);
  if (typeof decoded === "string" || typeof decoded.userId !== "string")
    throw new Error("Invalid token payload");
  return { userId: decoded.userId };
}
