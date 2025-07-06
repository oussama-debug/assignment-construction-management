"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "./utils";

const buttonVariants = cva(
  "group/button cursor-pointer relative inline-flex items-center justify-center text-xs font-medium transition select-none overflow-hidden whitespace-nowrap text-ellipsis rounded-[.25rem] focus-visible:outline-[3px] before:absolute before:inset-0 before:size-full before:bg-gradient-to-b before:transition-opacity hover:before:opacity-0 disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white! before:from-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(124,58,237,1)] dark:bg-purple-700 dark:shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.16),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(0,0,0,0.12)] focus-visible:outline-purple-500",
        destructive:
          "bg-red-600 text-white before:from-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(220,38,38,1)] dark:bg-red-700 dark:shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.16),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(0,0,0,0.12)] focus-visible:outline-red-500",
        secondary:
          "bg-white text-gray-900 before:from-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_2px_4px_-1px_rgba(0,0,0,0.12),0_4px_8px_-2px_rgba(0,0,0,0.16),0_0_0_1px_rgba(229,231,235,1)] dark:bg-gray-700 dark:text-gray-100 dark:shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.16),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(75,85,99,1)] focus-visible:outline-gray-400",
        outline:
          "bg-transparent text-gray-900 dark:text-gray-100 before:from-gray-100/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(209,213,219,1)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.2)] hover:bg-gray-100/10 dark:hover:bg-white/10 focus-visible:outline-gray-500",
        ghost:
          "bg-transparent text-gray-700 dark:text-gray-300 shadow-none before:opacity-0 hover:bg-gray-100/50 dark:hover:bg-white/10 focus-visible:outline-gray-500",
        link: "bg-transparent text-primary dark:text-orange-400 shadow-none before:opacity-0 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none",
        soft: "bg-purple-100 text-purple-900 before:from-white/30 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.5),0_2px_2px_-1px_rgba(0,0,0,0.1),0_4px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(216,180,254,1)] dark:bg-purple-900/50 dark:text-purple-100 dark:shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.16),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(147,51,234,0.5)] focus-visible:outline-purple-500",
        white:
          "bg-white text-gray-900 before:from-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_2px_4px_-1px_rgba(0,0,0,0.12),0_4px_8px_-2px_rgba(0,0,0,0.16),0_0_0_1px_rgba(229,231,235,1)] dark:bg-gray-800 dark:text-gray-100 dark:shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.16),0_2px_4px_-1px_rgba(0,0,0,0.24),0_4px_8px_-2px_rgba(0,0,0,0.32),0_0_0_1px_rgba(55,65,81,1)] focus-visible:outline-gray-400",
      },
      size: {
        default: "h-[26px] px-[9px] py-0",
        xs: "h-[22px] px-[6px] py-0 text-[11px]",
        sm: "h-[25px] px-[8px] py-0 text-[12px]",
        lg: "h-[35px] px-[14px] py-0 text-[14px]",
        xl: "h-[42px] px-[18px] py-0 text-[16px]",
        icon: "h-[29px] w-[29px]",
      },
      loading: {
        true: "opacity-70 cursor-wait pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      loading: false,
    },
  }
);

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1] || "", 16),
        g: parseInt(result[2] || "", 16),
        b: parseInt(result[3] || "", 16),
      }
    : null;
};

const generateCustomColorStyles = (color: string): string => {
  const rgb = hexToRgb(color);
  if (!rgb) return "";

  const { r, g, b } = rgb;

  return `
    text-white 
    before:from-white/20 
    shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(${r},${g},${b},1)] 
    dark:shadow-[inset_0_1px_0.5px_0_rgba(255,255,255,0.16),0_2px_2px_-1px_rgba(0,0,0,0.16),0_4px_4px_-2px_rgba(0,0,0,0.24),0_0_0_1px_rgba(0,0,0,0.12)]
  `
    .replace(/\s+/g, " ")
    .trim();
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  color?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      color,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const customColorStyles = color ? generateCustomColorStyles(color) : "";
    const rgbColor = color ? hexToRgb(color) : null;

    const customStyle = color
      ? {
          backgroundColor: color,
          "--custom-dark-bg": rgbColor
            ? `rgb(${Math.max(0, Math.floor(rgbColor.r * 0.8))}, ${Math.max(0, Math.floor(rgbColor.g * 0.8))}, ${Math.max(0, Math.floor(rgbColor.b * 0.8))})`
            : color,
          ...style,
        }
      : style;

    return (
      <Comp
        className={cn(
          color
            ? cn(
                "group/button text-xs relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-[.25rem] font-medium text-ellipsis whitespace-nowrap transition select-none before:absolute before:inset-0 before:size-full before:bg-gradient-to-b before:transition-opacity hover:before:opacity-0 focus-visible:outline-[3px] disabled:cursor-not-allowed disabled:opacity-40",
                customColorStyles,
                buttonVariants({ size, loading })
              )
            : buttonVariants({ variant, size, loading }),
          color && "dark:bg-[var(--custom-dark-bg)]",
          className
        )}
        style={customStyle}
        ref={ref}
        disabled={loading || props.disabled}
        data-pending={loading ? true : undefined}
        data-disabled={props.disabled ? true : undefined}
        {...props}
      >
        {loading ? (
          <div className="flex flex-row items-center justify-center space-x-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
