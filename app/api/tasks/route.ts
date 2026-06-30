import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { TaskSchema } from "@/lib/definitions";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { userId: session.userId };
  if (date) {
    const d = new Date(date);
    where.date = d;
  }
  if (status) {
    where.status = status;
  }

  const tasks = await db.task.findMany({
    where,
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  return Response.json({ tasks });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = TaskSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: "Validation failed", details: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { title, description, date, status } = result.data;

  const task = await db.task.create({
    data: {
      title,
      description,
      date: new Date(date),
      status,
      userId: session.userId,
    },
  });

  return Response.json({ task }, { status: 201 });
}
