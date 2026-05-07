import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("DB connection: ok");
} catch (err) {
  console.error("DB connection failed:", err);
  process.exit(1);
}

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello!\n");
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(503).json({
      message: "Unexpected Error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
