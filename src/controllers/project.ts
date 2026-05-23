import type { Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import * as projectModel from "../models/project.js";
import { isNonEmptyString } from "../utils/validators.js";
import { parseOptionalInt } from "../utils/parsers.js";
import { badRequest } from "../utils/httpResponses.js";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../utils/pagenation.js";

export async function list(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");

  const pageParsed = parseOptionalInt(req.query.page, { min: 1 });
  if (!pageParsed.ok) {
    badRequest(res, `page ${pageParsed.message}`);
    return;
  }
  const limitParsed = parseOptionalInt(req.query.limit, { min: 1 });
  if (!limitParsed.ok) {
    badRequest(res, `limit ${limitParsed.message}`);
    return;
  }
  const page = pageParsed.value ?? DEFAULT_PAGE;
  const limit = limitParsed.value ?? DEFAULT_LIMIT;
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

export async function getBySlug(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");
  const { slug } = req.params;
  if (!isNonEmptyString(slug)) {
    badRequest(res, "slug is required");
    return;
  }
  const project = await projectModel.findBySlug(req.user.id, slug);

  if (!project) throw new NotFoundError("Project not found");

  const statsMap = await projectModel.getStatsByProjectIds([project.id]);

  res.json({ data: { ...project, stats: statsMap.get(project.id) } });
}
