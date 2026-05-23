import type { Request, Response } from "express";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import {
  parseOptionalDateString,
  parseOptionalEnum,
  parseOptionalEnumArray,
  parseOptionalInt,
  parseOptionalString,
  parseOptionalUuid,
  parseRequiredDateString,
  parseRequiredEnum,
  parseRequiredString,
  parseRequiredUuid,
} from "../utils/parsers.js";
import { badRequest } from "../utils/httpResponses.js";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "../utils/pagenation.js";
import * as taskModel from "../models/task.js";
import { isUuid } from "../utils/validators.js";

const TASK_STATUSES = ["scheduled", "completed", "archived"] as const;
const TASK_KINDS = ["task", "milestone"] as const;

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
  const statusParsed = parseOptionalEnumArray(req.query.status, TASK_STATUSES);
  if (!statusParsed.ok) {
    badRequest(res, `status ${statusParsed.message}`);
    return;
  }

  const page = pageParsed.value ?? DEFAULT_PAGE;
  const limit = limitParsed.value ?? DEFAULT_LIMIT;

  const skip = (page - 1) * limit;
  const status = statusParsed.value;

  const [tasks, totalCount] = await Promise.all([
    taskModel.findManyByUser(req.user.id, { skip, take: limit, status }),
    taskModel.countByUser(req.user.id, { status }),
  ]);

  res.json({
    data: tasks,
    pageInfo: {
      totalCount,
      limit,
      page,
      hasNext: skip + tasks.length < totalCount,
      hasPrevious: page > 1,
    },
  });
}

export async function getById(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");

  const { id } = req.params;
  if (!isUuid(id)) {
    badRequest(res, "id must be a valid UUID");
    return;
  }

  const task = await taskModel.findByIdForUser(req.user.id, id);

  if (!task) throw new NotFoundError("Task not found");

  res.json({ data: task });
}

export async function create(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");

  const titleParsed = parseRequiredString(req.body?.title);

  if (!titleParsed.ok) {
    badRequest(res, `title ${titleParsed.message}`);
    return;
  }

  const descriptionParsed = parseRequiredString(req.body?.description);
  if (!descriptionParsed.ok) {
    badRequest(res, `description ${descriptionParsed.message}`);
    return;
  }

  const kindParsed = parseRequiredEnum(req.body?.kind, TASK_KINDS);
  if (!kindParsed.ok) {
    badRequest(res, `kind ${kindParsed.message}`);
    return;
  }

  const statusParsed = parseRequiredEnum(req.body?.status, TASK_STATUSES);
  if (!statusParsed.ok) {
    badRequest(res, `status ${statusParsed.message}`);
    return;
  }

  const deadlineParsed = parseRequiredDateString(req.body?.deadline);
  if (!deadlineParsed.ok) {
    badRequest(res, `deadline ${deadlineParsed.message}`);
    return;
  }

  const projectIdParsed = parseRequiredUuid(req.body?.projectId);
  if (!projectIdParsed.ok) {
    badRequest(res, `projectId ${projectIdParsed.message}`);
    return;
  }

  const startingAtParsed = parseOptionalDateString(req.body?.startingAt);
  if (!startingAtParsed.ok) {
    badRequest(res, `startingAt ${startingAtParsed.message}`);
    return;
  }

  const project = await taskModel.findProjectOwnedByUser(
    req.user.id,
    projectIdParsed.value,
  );
  if (!project) {
    badRequest(res, "projectId does not exist or is not owned by the user");
    return;
  }

  const task = await taskModel.create({
    userId: req.user.id,
    projectId: projectIdParsed.value,
    title: titleParsed.value,
    description: descriptionParsed.value,
    kind: kindParsed.value,
    status: statusParsed.value,
    deadline: deadlineParsed.value,
    startingAt: startingAtParsed.value,
  });

  res.status(201).json({ data: task });
}

export async function updateById(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");

  const { id } = req.params;
  if (!isUuid(id)) {
    badRequest(res, "id must be a valid UUID");
    return;
  }

  const titleParsed = parseOptionalString(req.body?.title);
  if (!titleParsed.ok) {
    badRequest(res, `title ${titleParsed.message}`);
    return;
  }

  const descriptionParsed = parseOptionalString(req.body?.description);
  if (!descriptionParsed.ok) {
    badRequest(res, `description ${descriptionParsed.message}`);
    return;
  }

  const kindParsed = parseOptionalEnum(req.body?.kind, TASK_KINDS);
  if (!kindParsed.ok) {
    badRequest(res, `kind ${kindParsed.message}`);
    return;
  }

  const statusParsed = parseOptionalEnum(req.body?.status, TASK_STATUSES);
  if (!statusParsed.ok) {
    badRequest(res, `status ${statusParsed.message}`);
    return;
  }

  const deadlineParsed = parseOptionalDateString(req.body?.deadline);
  if (!deadlineParsed.ok) {
    badRequest(res, `deadline ${deadlineParsed.message}`);
    return;
  }

  const projectIdParsed = parseOptionalUuid(req.body?.projectId);
  if (!projectIdParsed.ok) {
    badRequest(res, `projectId ${projectIdParsed.message}`);
    return;
  }

  const startingAtParsed = parseOptionalDateString(req.body?.startingAt);
  if (!startingAtParsed.ok) {
    badRequest(res, `startingAt ${startingAtParsed.message}`);
    return;
  }

  const existing = await taskModel.findByIdForUser(req.user.id, id);
  if (!existing) {
    throw new NotFoundError("Task not found");
  }

  if (projectIdParsed.value !== undefined) {
    const project = await taskModel.findProjectOwnedByUser(
      req.user.id,
      projectIdParsed.value,
    );
    if (!project) {
      badRequest(res, "projectId does not exist or is not owned by the user");
      return;
    }
  }

  const task = await taskModel.updateById(id, {
    title: titleParsed.value,
    description: descriptionParsed.value,
    kind: kindParsed.value,
    status: statusParsed.value,
    deadline: deadlineParsed.value,
    projectId: projectIdParsed.value,
    startingAt: startingAtParsed.value,
  });

  res.json({ data: task });
}

export async function deleteById(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError("Unauthorized");

  const { id } = req.params;
  if (!isUuid(id)) {
    badRequest(res, "id must be a valid UUID");
    return;
  }

  const existing = await taskModel.findByIdForUser(req.user.id, id);
  if (!existing) {
    throw new NotFoundError("Task not found");
  }

  await taskModel.deleteById(id);
  res.json({ data: existing });
}
