import type { Task } from "@prisma/client";

interface StatusSummaryProps {
  tasks: Task[];
}

const STATUSES = [
  { key: "NOT_STARTED", label: "Not Started", color: "bg-slate-500" },
  { key: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500" },
  { key: "DONE", label: "Done", color: "bg-green-500" },
] as const;

export function StatusSummary({ tasks }: StatusSummaryProps) {
  const counts = {
    NOT_STARTED: tasks.filter((t) => t.status === "NOT_STARTED").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  const total = tasks.length;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Task Summary</h3>
      <div className="flex flex-col gap-3">
        {STATUSES.map(({ key, label, color }) => {
          const count = counts[key];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--muted-foreground)]">{label}</span>
                <span className="font-medium text-[var(--foreground)]">{count}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[var(--muted-foreground)] text-right">
        {total} total task{total !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
