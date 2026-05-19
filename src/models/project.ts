import { prisma } from "../utils/prisma.js";

const projectSelect = {
  id: true,
  name: true,
  slug: true,
  goal: true,
  shouldbe: true,
  color: true,
  deadline: true,
  startingAt: true,
  startedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ProjectStats = {
  total: number;
  kinds: {
    milestone: number;
    task: number;
    total: number;
  };
  states: {
    scheduled: number;
    completed: number;
    archived: number;
  };
};

export function findManyByUser(
  userId: string,
  opts: { skip: number; take: number },
) {
  return prisma.project.findMany({
    where: { userId },
    select: projectSelect,
    orderBy: { createdAt: "desc" },
    skip: opts.skip,
    take: opts.take,
  });
}

export function countByUser(userId: string) {
  return prisma.project.count({ where: { userId } });
}

export function findBySlug(userId: string, slug: string) {
  return prisma.project.findUnique({
    where: { userId_slug: { userId, slug } },
    select: projectSelect,
  });
}

export async function getStatsByProjectIds(
  projectIds: string[],
): Promise<Map<string, ProjectStats>> {
  const result = new Map<string, ProjectStats>();

  for (const id of projectIds) result.set(id, emptyStats());

  if (projectIds.length === 0) return result;

  const grouped = await prisma.task.groupBy({
    by: ["projectId", "kind", "status"],
    where: { projectId: { in: projectIds } },
    _count: { _all: true },
  });

  for (const row of grouped) {
    const stats = result.get(row.projectId);
    if (!stats) continue;
    const count = row._count._all;
    stats.total += count;
    stats.kinds.total += count;
    stats.kinds[row.kind] += count;
    stats.states[row.status] += count;
  }
  return result;
}

function emptyStats(): ProjectStats {
  return {
    total: 0,
    kinds: { milestone: 0, task: 0, total: 0 },
    states: { scheduled: 0, completed: 0, archived: 0 },
  };
}
