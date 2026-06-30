"use client";

import { useState, useCallback } from "react";
import { DayPicker } from "react-day-picker";
import { toDateString } from "@/lib/utils";
import "react-day-picker/src/style.css";

interface CalendarViewProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  taskDates?: string[];
}

export function CalendarView({ selectedDate, onDateChange, taskDates = [] }: CalendarViewProps) {
  const [month, setMonth] = useState(new Date());

  const selected = new Date(selectedDate + "T00:00:00");

  // v9: onSelect receives (selected, triggerDate, modifiers, event)
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
        classNames={{
          months: "w-full",
          month: "w-full",
          month_grid: "w-full border-collapse",
          weekdays: "flex w-full",
          weekday: "flex-1 text-center text-xs text-[var(--muted-foreground)] font-medium py-2",
          week: "flex w-full mt-1",
          day: "flex-1 text-center",
          day_button: "mx-auto h-9 w-9 flex items-center justify-center rounded-lg text-sm hover:bg-[var(--muted)] transition-colors cursor-pointer w-full",
          selected: "!bg-[var(--primary)] !text-white rounded-lg",
          today: "font-bold text-[var(--primary)]",
          outside: "opacity-40",
          nav: "flex items-center justify-between mb-2",
          button_previous: "p-1 rounded-md hover:bg-[var(--muted)] transition-colors",
          button_next: "p-1 rounded-md hover:bg-[var(--muted)] transition-colors",
          month_caption: "text-center flex items-center justify-center",
          caption_label: "text-sm font-semibold text-[var(--foreground)]",
        }}
      />
    </div>
  );
}
