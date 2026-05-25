import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/utils/prisma.js";

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: { username: "Test User", status: "active" },
    create: {
      email: "test@example.com",
      username: "Test User",
      passwordHash,
      status: "active",
    },
  });

  // 冪等性のため、対象ユーザーのプロジェクトは一旦削除（タスクは Cascade で消える）
  await prisma.project.deleteMany({ where: { userId: user.id } });

  const now = Date.now();
  const projects = [
    { slug: "design", name: "Design", createdAt: new Date(now - 2000) },
    { slug: "english", name: "English", createdAt: new Date(now - 1000) },
    { slug: "programming", name: "Programming", createdAt: new Date(now) },
  ];

  for (const p of projects) {
    await prisma.project.create({
      data: { ...p, userId: user.id },
    });
  }

  const programming = await prisma.project.findFirstOrThrow({
    where: { userId: user.id, slug: "programming" },
  });

  await prisma.task.create({
    data: {
      userId: user.id,
      projectId: programming.id,
      title: "Seed scheduled task",
      description: "for tests",
      status: "scheduled",
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
