"use client";

import { useActionState, useEffect } from "react";
import { createTask, updateTask } from "@/app/actions/tasks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/lib/definitions";
import type { Task } from "@prisma/client";

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

interface TaskFormProps {
  task?: Task;
  defaultDate?: string;
  onSuccess?: () => void;
}

export function TaskForm({ task, defaultDate, onSuccess }: TaskFormProps) {
  const action = task
    ? updateTask.bind(null, task.id)
    : createTask;

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined
  );

  useEffect(() => {
    if (state?.message && !state.errors && onSuccess) {
      onSuccess();
    }
  }, [state, onSuccess]);

  const defaultDateValue = task
    ? new Date(task.date).toISOString().split("T")[0]
    : defaultDate ?? new Date().toISOString().split("T")[0];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.message && !state.errors && (
        <p className="text-sm text-green-600 dark:text-green-400">{state.message}</p>
      )}
      {state?.message && state.errors && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}

      <Input
        id="title"
        name="title"
        label="Title"
        placeholder="Task title"
        defaultValue={task?.title}
        error={state?.errors?.title}
        required
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        placeholder="Optional description"
        defaultValue={task?.description ?? ""}
        error={state?.errors?.description}
      />

      <Input
        id="date"
        name="date"
        label="Date"
        type="date"
        defaultValue={defaultDateValue}
        error={state?.errors?.date}
        required
      />

      <Select
        id="status"
        name="status"
        label="Status"
        options={STATUS_OPTIONS}
        defaultValue={task?.status ?? "NOT_STARTED"}
        error={state?.errors?.status}
      />

      <Button type="submit" loading={pending} className="mt-2">
        {task ? "Update Task" : "Create Task"}
      </Button>
    </form>
  );
}
