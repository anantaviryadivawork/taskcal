import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    .trim(),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(1, { message: "Password is required." }).trim(),
});

export const TaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).trim(),
  description: z.string().optional(),
  date: z.string().min(1, { message: "Date is required." }),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]).default("NOT_STARTED"),
});

export type FormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;
