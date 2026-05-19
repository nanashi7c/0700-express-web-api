import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { ConflictError, UnauthorizedError } from "../utils/errors.js";
import * as userModel from "../models/user.js";
import {
  isEmail,
  matches,
  isNonEmptyString,
  hasMinLength,
} from "../utils/validators.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { badRequest } from "../utils/httpResponses.js";

export async function signup(req: Request, res: Response): Promise<void> {
  const username = req.body?.username;
  if (!isNonEmptyString(username)) {
    badRequest(res, "username is required");
    return;
  }

  const email = req.body?.email;
  if (!isNonEmptyString(email)) {
    badRequest(res, "email is required");
    return;
  }
  if (!isEmail(email)) {
    badRequest(res, "email must be a valid email address");
    return;
  }
  const password = req.body?.password;
  if (!isNonEmptyString(password)) {
    badRequest(res, "password is required");
    return;
  }
  if (!hasMinLength(password, 8)) {
    badRequest(res, "password must be at least 8 characters");
    return;
  }
  if (!matches(email, req.body?.email_confirmation)) {
    badRequest(res, "email confirmation does not match");
    return;
  }
  if (!matches(password, req.body?.password_confirmation)) {
    badRequest(res, "password confirmation does not match");
    return;
  }

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
  const email = req.body?.email;
  if (!isEmail(email)) {
    badRequest(res, "email is required or invalid");
    return;
  }
  const password = req.body?.password;
  if (!isNonEmptyString(password)) {
    badRequest(res, "password is required");
    return;
  }

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
