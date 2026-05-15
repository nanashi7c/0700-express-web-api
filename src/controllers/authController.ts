import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { ConflictError, UnauthorizedError } from "../utils/errors.js";
import * as userModel from "../models/userModel.js";
import {
  requireEmail,
  requireMatch,
  requireString,
} from "../utils/validators.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

export async function signup(req: Request, res: Response): Promise<void> {
  const username = requireString(req.body?.username, "username");
  const email = requireEmail(req.body?.email);
  const emailConfirmation = requireEmail(
    req.body?.email_confirmation,
    "email_confirmation",
  );
  const password = requireString(req.body?.password, "password", {
    minLength: 8,
  });
  const passwordConfirmation = requireString(
    req.body?.password_confirmation,
    "password_confirmation",
  );
  requireMatch(email, emailConfirmation, "email_confirmation");
  requireMatch(password, passwordConfirmation, "password_confirmation");
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new ConflictError("Email already in use");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({ username, email, passwordHash });
  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });
  res.status(200).json({
    data: { uuid: user.id, accessToken, refreshToken },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const email = requireEmail(req.body?.email);
  const password = requireString(req.body?.password, "password");
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new UnauthorizedError("Invalid email or password");
  }
  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });
  res.status(200).json({
    data: { uuid: user.id, accessToken, refreshToken },
  });
}
