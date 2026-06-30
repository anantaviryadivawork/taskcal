"use client";

import { useState, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { toDateString } from "@/lib/utils";
import "react-day-picker/dist/style.css";

interface CalendarViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  taskDates?: string[];
}

export function CalendarView({ selectedDate, onDateChange, taskDates = [] }: CalendarViewProps) {
  const [month, setMonth] = useState(new Date());

  const selected = new Date(selectedDate + "T00:00:00");

  const handleSelect = useCallback(
    (day: Date | undefined) => {
      if (day) onDateChange(toDateString(day));
    },
    [onDateChange]
  );

  const taskDateSet = new Set(taskDates);

  const modifiers = {
    hasTasks: (day: Date) => taskDateSet.has(toDateString(day)),
  };

  const modifiersClassNames = {
    hasTasks: "has-tasks",
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        showOutsideDays
        className="w-full"
        classNames={{
          months: "w-full",
          month: "w-full",
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell: "flex-1 text-center text-xs text-[var(--muted-foreground)] font-medium py-2",
          row: "flex w-full mt-1",
          cell: "flex-1 text-center",
          day: "mx-auto h-9 w-9 flex items-center justify-center rounded-lg text-sm hover:bg-[var(--muted)] transition-colors cursor-pointer",
          day_selected: "!bg-[var(--primary)] !text-white",
          day_today: "font-bold text-[var(--primary)]",
          day_outside: "opacity-40",
          nav: "flex items-center justify-between mb-2",
          nav_button: "p-1 rounded-md hover:bg-[var(--muted)] transition-colors",
          caption: "text-center",
          caption_label: "text-sm font-semibold text-[var(--foreground)]",
        }}
      />
    </div>
  );
}
