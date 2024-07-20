import { type ClassValue, clsx } from "clsx";
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
