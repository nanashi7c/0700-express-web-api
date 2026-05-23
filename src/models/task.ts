
import type { TaskKind, TaskStatus } from "../generated/prisma/enums.js";
import { prisma } from "../utils/prisma.js";
import { projectSelect } from "./project.js";

const taskSelect = {
  id: true,
  title: true,
  description: true,
  kind: true,
  status: true,
  projectId: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  finishedAt: true,
  startedAt: true,
  archivedAt: true,
  startingAt: true,
  deadline: true,
  project: {
    select: projectSelect,
  },
} as const;

function buildWhere(userId: string, status?: TaskStatus[]) {
  return {
    userId,
    ...(status && status.length > 0 ? { status: { in: status } } : {}),
  };
}

export function findManyByUser(
  userId: string,
  opts: { skip: number; take: number; status?: TaskStatus[] },
) {
  return prisma.task.findMany({
    where: buildWhere(userId, opts.status),
    select: taskSelect,
    orderBy: { createdAt: "desc" },
    skip: opts.skip,
    take: opts.take,
  });
}

export function countByUser(userId: string, opts: { status?: TaskStatus[] }) {
  return prisma.task.count({
    where: buildWhere(userId, opts.status),
  });
}

export function findByIdForUser(userId: string, id: string) {
  return prisma.task.findFirst({
    where: {
      id,
      userId,
    },
    select: taskSelect,
  });
}

export function findProjectOwnedByUser(userId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    select: { id: true },
  });
}

export function create(data: {
  userId: string;
  projectId: string;
  title: string;
  description: string;
  kind: TaskKind;
  status: TaskStatus;
  deadline: Date;
  startingAt?: Date;
}) {
  return prisma.task.create({
    data,
    select: taskSelect,
  });
}

export function updateById(
  id: string,
  data: {
    title?: string;
    description?: string;
    kind?: TaskKind;
    status?: TaskStatus;
    projectId?: string;
    deadline?: Date;
    startingAt?: Date;
  },
) {
  return prisma.task.update({
    where: { id },
    data,
    select: taskSelect,
  });
}

export function deleteById(id: string) {
  return prisma.task.delete({
    where: { id },
    select: taskSelect,
  });
}
