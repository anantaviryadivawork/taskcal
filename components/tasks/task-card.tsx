"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { deleteTask } from "@/app/actions/tasks";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/tasks/task-form";
import type { Task } from "@prisma/client";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this task?")) return;
    startTransition(async () => { await deleteTask(task.id); });
  }

  return (
    <>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-[var(--foreground)] truncate">{task.title}</h3>
              <StatusBadge status={task.status} />
            </div>
            {task.description && expanded && (
              <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {task.description && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="rounded-md p-1.5 hover:bg-[var(--muted)] transition-colors"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <ChevronUp className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                )}
              </button>
            )}
            <button
              onClick={() => setEditOpen(true)}
              className="rounded-md p-1.5 hover:bg-[var(--muted)] transition-colors"
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-md p-1.5 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-50"
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Task">
        <TaskForm task={task} onSuccess={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
