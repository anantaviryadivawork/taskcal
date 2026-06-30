"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { FormState } from "@/lib/definitions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    login,
    undefined
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--primary)] text-white text-xl font-bold mb-4">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Welcome back</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Sign in to your account
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <form action={action} className="flex flex-col gap-4">
            {state?.message && !state.errors && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {state.message}
              </div>
            )}

            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={state?.errors?.email}
              autoComplete="email"
              required
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Your password"
              error={state?.errors?.password}
              autoComplete="current-password"
              required
            />

            <Button type="submit" loading={pending} className="mt-2 w-full">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--muted-foreground)] mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[var(--primary)] hover:underline font-medium">
            Create one
          </Link>
        </p>

        <div className="mt-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]">
          <p className="text-xs text-[var(--muted-foreground)] font-medium mb-2">Demo credentials:</p>
          <p className="text-xs text-[var(--muted-foreground)]">Email: demo@example.com</p>
          <p className="text-xs text-[var(--muted-foreground)]">Password: demo1234!</p>
        </div>
      </div>
    </div>
  );
}
