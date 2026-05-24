import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const isProduction = process.env.NODE_ENV === "production";

export const prisma = new PrismaClient({
  log: isProduction
    ? ["info", "warn", "error"]
    : ["query", "info", "warn", "error"],
  adapter,
});
