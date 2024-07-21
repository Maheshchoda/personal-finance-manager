import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMilliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertAmountFromMilliUnits(amount: number) {
  return amount / 1000;
}

export function formatCurrency(amount: number) {
  return Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100; // If previous is 0, handle as 100% change if current is not 0.
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

interface FillMissingDaysProps {
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[];
  startDate: Date;
  endDate: Date;
}
export function fillMissingDays({
  activeDays,
  startDate,
  endDate,
}: FillMissingDaysProps) {
  if (activeDays.length === 0) {
    return [];
  }

  // Generate an array of all dates between the start and end dates
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Map each day to its corresponding active day data or default values if not active
  const transactionsByDay = allDays.map((day) => {
    const activeDay = activeDays.find((activeDay) =>
      isSameDay(activeDay.date, day),
    );
    return (
      activeDay || {
        date: day,
        income: 0,
        expenses: 0,
      }
    );
  });

  return transactionsByDay;
}

interface Period {
  from: string | Date | undefined;
  to: string | Date | undefined;
}

export function formatDateRange({ from, to }: Period) {
  const DAYS_IN_PERIOD = 30;
  const currentDate = new Date();
  const thirtyDaysAgo = subDays(currentDate, DAYS_IN_PERIOD);

  if (from && to) {
    return `${format(from, "LLL dd")} - ${format(to, "LLL dd,y")}`;
  }

  return `${format(thirtyDaysAgo, "LLL dd")} - ${format(currentDate, "LLL dd,y")}`;
}

interface FormatPercentage {
  value: number;
  addPrefix?: boolean;
}

export function formatPercentage({ value, addPrefix }: FormatPercentage) {
  const result = new Intl.NumberFormat("en-IN", {
    style: "percent",
  }).format(value / 100);

  if (addPrefix && value > 0) return `+${result}`;

  return result;
}
