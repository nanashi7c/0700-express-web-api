import type { Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import * as projectModel from "../models/project.js";
import { optionalInt, requireString } from "../utils/validators.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export async function listProjects(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");

  const page = optionalInt(req.query.page, "page", { min: 0 }) ?? DEFAULT_PAGE;
  const limit =
    optionalInt(req.query.limit, "limit", { min: 1 }) ?? DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const [projects, totalCount] = await Promise.all([
    projectModel.findManyByUser(req.user.id, { skip, take: limit }),
    projectModel.countByUser(req.user.id),
  ]);

  const statsMap = await projectModel.getStatsByProjectIds(
    projects.map((p) => p.id),
  );

  const data = projects.map((p) => ({
    ...p,
    stats: statsMap.get(p.id),
  }));

  res.json({
    data,
    pageInfo: {
      totalCount,
      limit,
      page,
      hasNext: skip + projects.length < totalCount,
      hasPrevious: page > 1,
    },
  });
}

export async function getProjectBySlug(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");
  const slug = requireString(req.params.slug, "slug");
  const project = await projectModel.findBySlug(req.user.id, slug);

  if (!project) throw new NotFoundError("Project not found");

  const statsMap = await projectModel.getStatsByProjectIds([project.id]);

  res.json({ data: { ...project, stats: statsMap.get(project.id) } });
}
