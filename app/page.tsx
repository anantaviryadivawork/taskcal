import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { CheckSquare, Calendar, ListTodo, Shield } from "lucide-react";

export default async function HomePage() {
  const session = await getSession();
  if (session?.userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[var(--foreground)]">TaskCal</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-1.5 text-sm text-[var(--muted-foreground)] mb-6">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Free to use · No credit card required
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-4 leading-tight">
            Organize tasks with a{" "}
            <span className="text-[var(--primary)]">calendar view</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
            TaskCal helps you plan your day by linking tasks directly to calendar dates, with status tracking built in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl text-base font-medium bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl text-base font-medium border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              Sign in
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: Calendar, title: "Calendar View", desc: "See all tasks on an interactive calendar and click any date to view or create tasks." },
              { icon: ListTodo, title: "Task Management", desc: "Create, edit, and delete tasks with title, description, date, and status tracking." },
              { icon: Shield, title: "Private & Secure", desc: "Your tasks are private. JWT authentication ensures only you can access your data." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="h-9 w-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-3">
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">{title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
