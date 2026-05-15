import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authentication required"));
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.userId };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}
