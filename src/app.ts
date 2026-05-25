import "dotenv/config";
import express from "express";
import { prisma } from "./utils/prisma.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";
import morgan from "morgan";

const app = express();
const port = Number(process.env.PORT) || 3000;

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("DB connection: ok");
} catch (err) {
  console.error("DB connection failed:", err);
  process.exit(1);
}

app.use(morgan("combined"));
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

app.use("/api/v1", apiRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
