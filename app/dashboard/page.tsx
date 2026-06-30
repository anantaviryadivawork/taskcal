import { LogOut, CheckSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import { DashboardClient } from "@/components/dashboard-client";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toDateString } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await verifySession();

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true },
  });

  if (!user) redirect("/login");

  const allTasks = await db.task.findMany({
    where: { userId: session.userId },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
  });

  const today = toDateString(new Date());
  const todayCount = allTasks.filter(
    (t) => toDateString(new Date(t.date)) === today
  ).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--foreground)]">TaskCal</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[var(--muted-foreground)]">
              {user.name}
            </span>
            <ThemeToggle />
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Hello, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {todayCount > 0
              ? `You have ${todayCount} task${todayCount !== 1 ? "s" : ""} today`
              : "No tasks scheduled for today"}
          </p>
        </div>

        <DashboardClient initialDate={today} allTasks={allTasks} />
      </main>
    </div>
  );
}
