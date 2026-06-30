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
  initialTasks: Task[];
}

export function DashboardClient({
  initialDate,
  allTasks,
  initialTasks,
}: DashboardClientProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTasks, setSelectedTasks] = useState(initialTasks);

  function handleDateChange(date: string) {
    setSelectedDate(date);
    setSelectedTasks(
      allTasks.filter((t) => {
        const taskDate = toDateString(new Date(t.date));
        return taskDate === date;
      })
    );
  }

  const taskDates = allTasks.map((t) => toDateString(new Date(t.date)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      <div className="flex flex-col gap-4">
        <CalendarView
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
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
