import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { TaskSchema } from "@/lib/definitions";

type Params = { params: Promise<{ id: string }> };

async function getTaskForUser(id: string, userId: string) {
  const task = await db.task.findUnique({ where: { id } });
  if (!task || task.userId !== userId) return null;
  return task;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const task = await getTaskForUser(id, session.userId);
  if (!task) return Response.json({ error: "Task not found" }, { status: 404 });

  return Response.json({ task });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getTaskForUser(id, session.userId);
  if (!existing) return Response.json({ error: "Task not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });

  const result = TaskSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: "Validation failed", details: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { title, description, date, status } = result.data;
  const task = await db.task.update({
    where: { id },
    data: { title, description, date: new Date(date), status },
  });

  return Response.json({ task });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getTaskForUser(id, session.userId);
  if (!existing) return Response.json({ error: "Task not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON body" }, { status: 400 });

  const allowed = ["title", "description", "date", "status"];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      updates[key] = key === "date" ? new Date(body[key]) : body[key];
    }
  }

  const task = await db.task.update({ where: { id }, data: updates });
  return Response.json({ task });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getTaskForUser(id, session.userId);
  if (!existing) return Response.json({ error: "Task not found" }, { status: 404 });

  await db.task.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
