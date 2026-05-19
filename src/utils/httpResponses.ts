import type { Response } from "express";

export function badRequest(res: Response, message: string): void {
  res.status(400).json({ message });
}
