"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { TaskSchema, type FormState } from "@/lib/definitions";

export async function createTask(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await verifySession();

  const result = TaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    date: formData.get("date"),
    status: formData.get("status") || "NOT_STARTED",
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { title, description, date, status } = result.data;

  await db.task.create({
    data: {
      title,
      description,
      date: new Date(date),
      status,
      userId: session.userId,
    },
  });

  revalidatePath("/dashboard");
  return { message: "Task created successfully." };
}

export async function updateTask(
  id: string,
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await verifySession();

  const task = await db.task.findUnique({ where: { id } });
  if (!task || task.userId !== session.userId) {
    return { message: "Task not found." };
  }

  const result = TaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    date: formData.get("date"),
    status: formData.get("status") || "NOT_STARTED",
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { title, description, date, status } = result.data;

  await db.task.update({
    where: { id },
    data: { title, description, date: new Date(date), status },
  });

  revalidatePath("/dashboard");
  return { message: "Task updated successfully." };
}

export async function deleteTask(id: string): Promise<{ error?: string }> {
  const session = await verifySession();

  const task = await db.task.findUnique({ where: { id } });
  if (!task || task.userId !== session.userId) {
    return { error: "Task not found." };
  }

  await db.task.delete({ where: { id } });
  revalidatePath("/dashboard");
  return {};
}

export async function updateTaskStatus(
  id: string,
  status: "NOT_STARTED" | "IN_PROGRESS" | "DONE"
): Promise<{ error?: string }> {
  const session = await verifySession();

  const task = await db.task.findUnique({ where: { id } });
  if (!task || task.userId !== session.userId) {
    return { error: "Task not found." };
  }

  await db.task.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard");
  return {};
}
