
import { prisma } from "../utils/prisma.js";

export function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findPublicById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    // 公開可能なフィールドのみを選択（パスワードハッシュ等を除外）
    select: { id: true, username: true, email: true, status: true },
  });
}

export function create(data: {
  username: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data,
    select: { id: true },
  });
}
