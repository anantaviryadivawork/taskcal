"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { TaskCard } from "@/components/tasks/task-card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TaskForm } from "@/components/tasks/task-form";
import { StatusBadge } from "@/components/ui/badge";
import type { Task } from "@prisma/client";
import { format } from "date-fns";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

interface TaskListProps {
  tasks: Task[];
  selectedDate: string;
}

export function TaskList({ tasks, selectedDate }: TaskListProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = tasks.filter((t) => {
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const displayDate = (() => {
    try {
      return format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM d, yyyy");
    } catch {
      return selectedDate;
    }
  })();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{displayDate}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="flex gap-2 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-[var(--muted)] flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {search || statusFilter ? "No tasks match your filters" : "No tasks for this date"}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {!search && !statusFilter && "Click \"Add Task\" to create one"}
            </p>
          </div>
        ) : (
          filtered.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Task"
      >
        <TaskForm defaultDate={selectedDate} onSuccess={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}
