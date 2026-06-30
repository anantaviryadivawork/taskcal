"use client";

import { useState } from "react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { TaskList } from "@/components/tasks/task-list";
import { StatusSummary } from "@/components/tasks/status-summary";
import { toDateString } from "@/lib/utils";
import type { Task } from "@prisma/client";

interface DashboardClientProps {
  initialDate: string;
  allTasks: Task[];
}

export function DashboardClient({
  initialDate,
  allTasks,
}: DashboardClientProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Recompute selected tasks whenever allTasks changes (after revalidatePath)
  // or when the user picks a different date
  const selectedTasks = allTasks.filter((t) => {
    const taskDate = toDateString(new Date(t.date));
    return taskDate === selectedDate;
  });

  const taskDates = allTasks.map((t) => toDateString(new Date(t.date)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      <div className="flex flex-col gap-4">
        <CalendarView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          taskDates={taskDates}
        />
        <StatusSummary tasks={allTasks} />
      </div>

      <div className="min-h-[400px]">
        <TaskList tasks={selectedTasks} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
