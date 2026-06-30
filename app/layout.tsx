import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskCal — To-Do List & Calendar",
  description: "Organize your daily tasks with an interactive calendar interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
