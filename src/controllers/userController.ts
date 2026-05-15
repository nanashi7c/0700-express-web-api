import type { Request, Response } from "express";
import * as userModel from "../models/userModel.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError("Unauthorized");
  }
  const user = await userModel.findPublicById(req.user.id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.json({ data: user });
}
