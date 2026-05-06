"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarRangeIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { getRevitalizationAvailableDatesByMonth } from "@/features/monitoring/actions/monitoring-revitalization-actions";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type RevitalizationReportDatePickerProps = {
  areaId: number;
  initialDate?: Date;
  onReportSelect?: (reportId: string, date: string) => void;
};

export function RevitalizationReportDatePicker({
  areaId,
  initialDate = new Date(),
  onReportSelect,
}: RevitalizationReportDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate,
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth() + 1;

  const { data: availableDates = [], isLoading } = useQuery({
    queryKey: ["revitalization-available-dates", areaId, year, month],
    queryFn: () => getRevitalizationAvailableDatesByMonth(areaId, year, month),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const modifiers = {
    hasData: (availableDates ?? []).map((d) => new Date(d.progress_date)),
  };

  const disabledDays = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    return !(availableDates ?? []).some((d) => {
      const availDate = new Date(d.progress_date);
      availDate.setHours(0, 0, 0, 0);
      return availDate.getTime() === date.getTime();
    });
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    date.setHours(0, 0, 0, 0);
    const target = (availableDates ?? []).find((d) => {
      const availDate = new Date(d.progress_date);
      availDate.setHours(0, 0, 0, 0);
      return availDate.getTime() === date.getTime();
    });

    if (target) {
      setSelectedDate(date);
      setIsOpen(false);
      onReportSelect?.(target.id, target.progress_date);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg" className="text-base font-semibold">
          <CalendarRangeIcon className="mr-1 size-5" />
          {selectedDate
            ? format(selectedDate, "dd MMMM yyyy", { locale: idLocale })
            : "Pilih Tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto border-none p-0 shadow-lg">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-md bg-white/50 backdrop-blur-sm">
              <Loader2 className="text-primary size-6 animate-spin" />
            </div>
          )}
          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={selectedDate}
            onSelect={handleSelect}
            className="w-full"
            modifiers={modifiers}
            disabled={disabledDays}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
