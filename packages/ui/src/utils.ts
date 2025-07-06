"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, type Locale } from "date-fns";

export type ColorUtility = "bg" | "stroke" | "fill" | "text";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const chartColors = {
  blue: {
    bg: "bg-blue-500",
    stroke: "stroke-blue-500",
    fill: "fill-blue-500",
    text: "text-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
  violet: {
    bg: "bg-violet-500",
    stroke: "stroke-violet-500",
    fill: "fill-violet-500",
    text: "text-violet-500",
  },
  amber: {
    bg: "bg-amber-500",
    stroke: "stroke-amber-500",
    fill: "fill-amber-500",
    text: "text-amber-500",
  },
  zinc: {
    bg: "bg-zinc-400 dark:bg-zinc-600",
    stroke: "stroke-zinc-400 dark:stroke-zinc-600",
    fill: "fill-zinc-400 dark:fill-zinc-600",
    text: "text-zinc-400 dark:text-zinc-600",
  },
  cyan: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  indigo: {
    bg: "bg-indigo-600 dark:bg-indigo-500",
    stroke: "stroke-indigo-600 dark:stroke-indigo-500",
    fill: "fill-indigo-600 dark:fill-indigo-500",
    text: "text-indigo-600 dark:text-indigo-500",
  },
  pink: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors
) as Array<AvailableChartColorsKeys>;

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[]
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  const defaultColor: AvailableChartColorsKeys = "blue";
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length] ?? defaultColor);
  });
  return categoryColors;
};

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility
): string => {
  const fallbackColor = {
    bg: "bg-zinc-500",
    stroke: "stroke-zinc-500",
    fill: "fill-zinc-500",
    text: "text-zinc-500",
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined
) => {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0);
  const maxDomain = maxValue ?? "auto";
  return [minDomain, maxDomain];
};

export function hasOnlyOneValueForKey(
  array: Record<string, unknown>[],
  keyToCheck: string
): boolean {
  const val: unknown[] = [];

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck]);
      if (val.length > 1) return false;
    }
  }

  return true;
}

export const isBrowserLocaleClockType24h = () => {
  const language =
    typeof window !== "undefined" ? window.navigator.language : "en-US";

  const hr = new Intl.DateTimeFormat(language, {
    hour: "numeric",
  }).format();

  return Number.isInteger(Number(hr));
};

export const formatDate = (
  date: Date,
  locale: Locale,
  includeTime?: boolean
): string => {
  const usesAmPm = !isBrowserLocaleClockType24h();
  let dateString: string;

  if (includeTime) {
    dateString = usesAmPm
      ? format(date, "dd MMM, yyyy h:mm a", { locale })
      : format(date, "dd MMM, yyyy HH:mm", { locale });
  } else {
    dateString = format(date, "dd MMM, yyyy", { locale });
  }

  return dateString;
};
